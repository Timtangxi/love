import os
import json
import re
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from nanoid import generate
from werkzeug.utils import secure_filename

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, '..'))
STORAGE_ROOT = os.path.join(BASE_DIR, 'local2')
UPLOADS_DIR = os.path.join(STORAGE_ROOT, 'uploads')
DB_FILE = os.path.join(STORAGE_ROOT, 'records.json')

# 安全配置
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'webm', 'mov'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_TEXT_LENGTH = 1000  # 最大文字长度

os.makedirs(UPLOADS_DIR, exist_ok=True)
if not os.path.exists(DB_FILE):
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump({"records": []}, f, ensure_ascii=False, indent=2)

app = Flask(__name__, static_folder=None)
# 限制CORS来源
CORS(app, origins=['http://localhost:8000', 'https://*.ngrok.io', 'https://*.ngrok-free.app'])

def allowed_file(filename):
    """检查文件扩展名是否允许"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_text_input(text, max_length=MAX_TEXT_LENGTH):
    """验证文本输入"""
    if not isinstance(text, str):
        return False
    if len(text) > max_length:
        return False
    # 检查是否包含危险字符
    dangerous_patterns = [r'<script', r'javascript:', r'on\w+\s*=', r'data:text/html']
    for pattern in dangerous_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return False
    return True

def sanitize_filename(filename):
    """清理文件名"""
    filename = secure_filename(filename)
    # 移除危险字符
    filename = re.sub(r'[^\w\-_\.]', '', filename)
    return filename

@app.route('/api/health')
def health():
    return jsonify({"ok": True})

@app.route('/api/records', methods=['GET'])
def list_records():
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception:
        return jsonify({"error": "read_failed"}), 500

@app.route('/api/records/text', methods=['POST'])
def add_text():
    try:
        body = request.get_json(force=True, silent=True) or {}
        title = body.get('title', '')
        text = body.get('text', '')
        date = body.get('date') or datetime.utcnow().strftime('%Y-%m-%d')
        
        # 输入验证
        if not validate_text_input(title, 100):  # 标题限制100字符
            return jsonify({"error": "invalid_title"}), 400
        if not validate_text_input(text, MAX_TEXT_LENGTH):
            return jsonify({"error": "invalid_text"}), 400
        
        # 验证日期格式
        try:
            datetime.strptime(date, '%Y-%m-%d')
        except ValueError:
            return jsonify({"error": "invalid_date"}), 400
        
        rid = f"rec_{generate(size=8)}"
        record = {
            "id": rid,
            "type": "text",
            "title": title,
            "text": text,
            "date": date,
            "createdAt": datetime.utcnow().isoformat() + 'Z',
            "updatedAt": datetime.utcnow().isoformat() + 'Z'
        }
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        data['records'].append(record)
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return jsonify({"ok": True, "record": record})
    except Exception as e:
        app.logger.error(f"Error in add_text: {str(e)}")
        return jsonify({"error": "server_error"}), 500

@app.route('/api/records/media', methods=['POST'])
def add_media():
    try:
        file = request.files.get('file')
        if file is None:
            return jsonify({"error": "no_file"}), 400
        
        # 文件大小检查
        file.seek(0, 2)  # 移动到文件末尾
        file_size = file.tell()
        file.seek(0)  # 重置到开头
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({"error": "file_too_large"}), 400
        
        # 文件名安全检查
        if not file.filename or not allowed_file(file.filename):
            return jsonify({"error": "invalid_file_type"}), 400
        
        title = request.form.get('title', '')
        text = request.form.get('text', '')
        rtype = request.form.get('type', 'image')
        date = request.form.get('date') or datetime.utcnow().strftime('%Y-%m-%d')
        
        # 输入验证
        if not validate_text_input(title, 100):
            return jsonify({"error": "invalid_title"}), 400
        if not validate_text_input(text, MAX_TEXT_LENGTH):
            return jsonify({"error": "invalid_text"}), 400
        if rtype not in ['image', 'video']:
            return jsonify({"error": "invalid_type"}), 400
        
        # 验证日期格式
        try:
            datetime.strptime(date, '%Y-%m-%d')
        except ValueError:
            return jsonify({"error": "invalid_date"}), 400
        
        rid = f"rec_{generate(size=8)}"
        safe_filename = sanitize_filename(file.filename)
        filename = f"{int(datetime.utcnow().timestamp()*1000)}_{generate(size=6)}_{safe_filename}"
        save_path = os.path.join(UPLOADS_DIR, filename)
        
        file.save(save_path)
        record = {
            "id": rid,
            "type": rtype,
            "title": title,
            "text": text,
            "date": date,
            "mediaPath": os.path.relpath(save_path, STORAGE_ROOT).replace('\\', '/'),
            "createdAt": datetime.utcnow().isoformat() + 'Z',
            "updatedAt": datetime.utcnow().isoformat() + 'Z'
        }
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        data['records'].append(record)
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return jsonify({"ok": True, "record": record})
    except Exception as e:
        app.logger.error(f"Error in add_media: {str(e)}")
        return jsonify({"error": "server_error"}), 500

@app.route('/api/records/<rid>', methods=['DELETE'])
def delete_record(rid):
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        idx = next((i for i, r in enumerate(data['records']) if r['id'] == rid), -1)
        if idx == -1:
            return jsonify({"error": "not_found"}), 404
        removed = data['records'].pop(idx)
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        if removed.get('mediaPath'):
            abs_path = os.path.join(STORAGE_ROOT, removed['mediaPath'])
            if os.path.exists(abs_path):
                try:
                    os.remove(abs_path)
                except Exception:
                    pass
        return jsonify({"ok": True})
    except Exception:
        return jsonify({"error": "delete_failed"}), 500

@app.route('/storage/<path:filename>')
def serve_storage(filename):
    # 防止路径遍历攻击
    if '..' in filename or filename.startswith('/'):
        return jsonify({"error": "invalid_path"}), 400
    
    # 确保文件在允许的目录内
    safe_path = os.path.join(STORAGE_ROOT, filename)
    if not os.path.exists(safe_path):
        return jsonify({"error": "file_not_found"}), 404
    
    # 确保文件在STORAGE_ROOT目录内
    if not os.path.abspath(safe_path).startswith(os.path.abspath(STORAGE_ROOT)):
        return jsonify({"error": "access_denied"}), 403
    
    return send_from_directory(STORAGE_ROOT, filename)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def static_proxy(path):
    # 让 Flask 作为后端同时静态托管前端目录
    target = os.path.join(ROOT_DIR, path)
    if os.path.isdir(target):
        target = os.path.join(ROOT_DIR, 'index.html')
    if not os.path.exists(target):
        target = os.path.join(ROOT_DIR, 'index.html')
    directory = os.path.dirname(target)
    filename = os.path.basename(target)
    return send_from_directory(directory, filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)



