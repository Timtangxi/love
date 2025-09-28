import os
import json
import re
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from nanoid import generate
from werkzeug.utils import secure_filename
import hashlib
from auth import AuthManager

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, '..'))
STORAGE_ROOT = os.path.join(BASE_DIR, 'local2')
UPLOADS_DIR = os.path.join(STORAGE_ROOT, 'uploads')
DB_FILE = os.path.join(STORAGE_ROOT, 'records.json')
AUTH_DB_FILE = os.path.join(STORAGE_ROOT, 'auth.json')

# 初始化认证管理器
auth_manager = AuthManager(AUTH_DB_FILE)

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

# 认证相关API
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        body = request.get_json(force=True, silent=True) or {}
        username = body.get('username', '').strip()
        password = body.get('password', '')
        email = body.get('email', '').strip()
        
        # 获取设备指纹
        user_agent = request.headers.get('User-Agent', '')
        ip = request.remote_addr
        screen_res = body.get('screen_resolution', '')
        device_fingerprint = auth_manager.generate_device_fingerprint(user_agent, ip, screen_res)
        
        # 验证输入
        if not username or len(username) < 3:
            return jsonify({"error": "用户名至少3个字符"}), 400
        if not password or len(password) < 6:
            return jsonify({"error": "密码至少6个字符"}), 400
        
        success, message = auth_manager.register_user(username, password, email, device_fingerprint)
        if success:
            return jsonify({"ok": True, "message": message})
        else:
            return jsonify({"error": message}), 400
            
    except Exception as e:
        app.logger.error(f"Error in register: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        body = request.get_json(force=True, silent=True) or {}
        username = body.get('username', '').strip()
        password = body.get('password', '')
        
        # 阻止root用户通过普通登录接口登录
        if username == 'root':
            return jsonify({"error": "root用户请使用管理员登录页面"}), 401
        
        # 获取设备指纹
        user_agent = request.headers.get('User-Agent', '')
        ip = request.remote_addr
        screen_res = body.get('screen_resolution', '')
        device_fingerprint = auth_manager.generate_device_fingerprint(user_agent, ip, screen_res)
        
        success, message, user_info = auth_manager.login_user(username, password, device_fingerprint)
        if success:
            return jsonify({"ok": True, "message": message, "user": user_info})
        else:
            return jsonify({"error": message}), 401
            
    except Exception as e:
        app.logger.error(f"Error in login: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    try:
        body = request.get_json(force=True, silent=True) or {}
        username = body.get('username', '').strip()
        password = body.get('password', '')
        
        # 获取设备指纹
        user_agent = request.headers.get('User-Agent', '')
        ip = request.remote_addr
        screen_res = body.get('screen_resolution', '')
        device_fingerprint = auth_manager.generate_device_fingerprint(user_agent, ip, screen_res)
        
        success, message, user_info = auth_manager.admin_login(username, password, device_fingerprint)
        if success:
            return jsonify({"ok": True, "message": message, "user": user_info})
        else:
            return jsonify({"error": message}), 401
            
    except Exception as e:
        app.logger.error(f"Error in admin_login: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

@app.route('/api/auth/verify', methods=['POST'])
def verify_token():
    try:
        body = request.get_json(force=True, silent=True) or {}
        token = body.get('token', '')
        
        if not token:
            return jsonify({"error": "缺少token"}), 400
        
        success, user_info = auth_manager.verify_admin_token(token)
        if success:
            return jsonify({"ok": True, "user": user_info})
        else:
            return jsonify({"error": "token无效或已过期"}), 401
            
    except Exception as e:
        app.logger.error(f"Error in verify_token: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

@app.route('/api/auth/check-device', methods=['POST'])
def check_device():
    try:
        body = request.get_json(force=True, silent=True) or {}
        username = body.get('username', '').strip()
        
        # 获取设备指纹
        user_agent = request.headers.get('User-Agent', '')
        ip = request.remote_addr
        screen_res = body.get('screen_resolution', '')
        device_fingerprint = auth_manager.generate_device_fingerprint(user_agent, ip, screen_res)
        
        success, message = auth_manager.check_device_access(device_fingerprint, username)
        return jsonify({"ok": success, "message": message, "device_fingerprint": device_fingerprint})
        
    except Exception as e:
        app.logger.error(f"Error in check_device: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

@app.route('/api/auth/set-acceptance', methods=['POST'])
def set_acceptance():
    try:
        body = request.get_json(force=True, silent=True) or {}
        token = body.get('token', '')
        acceptance_time = body.get('acceptance_time', '')
        
        if not token:
            return jsonify({"error": "缺少token"}), 400
        
        success, user_info = auth_manager.verify_admin_token(token)
        if not success:
            return jsonify({"error": "token无效"}), 401
        
        if auth_manager.set_acceptance_time(user_info['id'], acceptance_time):
            return jsonify({"ok": True, "message": "同意时间已设置"})
        else:
            return jsonify({"error": "设置失败"}), 500
            
    except Exception as e:
        app.logger.error(f"Error in set_acceptance: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

@app.route('/api/auth/get-acceptance', methods=['POST'])
def get_acceptance():
    try:
        body = request.get_json(force=True, silent=True) or {}
        token = body.get('token', '')
        
        if not token:
            return jsonify({"error": "缺少token"}), 400
        
        success, user_info = auth_manager.verify_admin_token(token)
        if not success:
            return jsonify({"error": "token无效"}), 401
        
        acceptance_time = auth_manager.get_acceptance_time(user_info['id'])
        return jsonify({"ok": True, "acceptance_time": acceptance_time})
        
    except Exception as e:
        app.logger.error(f"Error in get_acceptance: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    try:
        body = request.get_json(force=True, silent=True) or {}
        token = body.get('token', '')
        
        if not token:
            return jsonify({"error": "缺少token"}), 400
        
        success = auth_manager.logout_user(token)
        if success:
            return jsonify({"ok": True, "message": "登出成功"})
        else:
            return jsonify({"error": "登出失败"}), 500
            
    except Exception as e:
        app.logger.error(f"Error in logout: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

# 管理员API
@app.route('/api/admin/users', methods=['GET'])
def admin_get_users():
    try:
        # 验证管理员权限
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "缺少认证token"}), 401
        
        success, user_info = auth_manager.verify_admin_token(token)
        if not success or not user_info.get('is_admin'):
            return jsonify({"error": "需要管理员权限"}), 403
        
        users = auth_manager.get_all_users()
        return jsonify({"ok": True, "users": users})
        
    except Exception as e:
        app.logger.error(f"Error in admin_get_users: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

@app.route('/api/admin/whitelist', methods=['POST'])
def admin_manage_whitelist():
    try:
        # 验证管理员权限
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "缺少认证token"}), 401
        
        success, user_info = auth_manager.verify_admin_token(token)
        if not success or not user_info.get('is_admin'):
            return jsonify({"error": "需要管理员权限"}), 403
        
        body = request.get_json(force=True, silent=True) or {}
        action = body.get('action', '')  # 'add' or 'remove'
        username = body.get('username', '').strip()
        
        if not username:
            return jsonify({"error": "缺少用户名"}), 400
        
        # 保护root用户：不允许将root添加到白名单
        if username == 'root':
            return jsonify({"error": "无法管理root用户"}), 403
        
        if action == 'add':
            success = auth_manager.add_to_whitelist(username)
            message = "已添加到白名单" if success else "用户已在白名单中"
        elif action == 'remove':
            success = auth_manager.remove_from_whitelist(username)
            message = "已从白名单移除" if success else "用户不在白名单中"
        else:
            return jsonify({"error": "无效的操作"}), 400
        
        return jsonify({"ok": True, "message": message})
        
    except Exception as e:
        app.logger.error(f"Error in admin_manage_whitelist: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

@app.route('/api/admin/blacklist', methods=['POST'])
def admin_manage_blacklist():
    try:
        # 验证管理员权限
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "缺少认证token"}), 401
        
        success, user_info = auth_manager.verify_admin_token(token)
        if not success or not user_info.get('is_admin'):
            return jsonify({"error": "需要管理员权限"}), 403
        
        body = request.get_json(force=True, silent=True) or {}
        action = body.get('action', '')  # 'add' or 'remove'
        username = body.get('username', '').strip()
        
        if not username:
            return jsonify({"error": "缺少用户名"}), 400
        
        # 保护root用户：不允许将root添加到黑名单
        if username == 'root':
            return jsonify({"error": "无法管理root用户"}), 403
        
        if action == 'add':
            success = auth_manager.add_to_blacklist(username)
            message = "已添加到黑名单" if success else "用户已在黑名单中"
        elif action == 'remove':
            success = auth_manager.remove_from_blacklist(username)
            message = "已从黑名单移除" if success else "用户不在黑名单中"
        else:
            return jsonify({"error": "无效的操作"}), 400
        
        return jsonify({"ok": True, "message": message})
        
    except Exception as e:
        app.logger.error(f"Error in admin_manage_blacklist: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

@app.route('/api/admin/user-status', methods=['POST'])
def admin_update_user_status():
    try:
        # 验证管理员权限
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "缺少认证token"}), 401
        
        success, user_info = auth_manager.verify_admin_token(token)
        if not success or not user_info.get('is_admin'):
            return jsonify({"error": "需要管理员权限"}), 403
        
        body = request.get_json(force=True, silent=True) or {}
        username = body.get('username', '').strip()
        status = body.get('status', '').strip()
        
        if not username or status not in ['active', 'inactive']:
            return jsonify({"error": "无效的参数"}), 400
        
        # 特别保护root用户：不允许禁用root用户
        if username == 'root' and status == 'inactive':
            return jsonify({"error": "无法禁用root用户"}), 403
        
        success = auth_manager.update_user_status(username, status)
        if success:
            return jsonify({"ok": True, "message": f"用户状态已更新为{status}"})
        else:
            # 检查是否是管理员保护
            data = auth_manager.load_db()
            user = next((u for u in data['users'] if u['username'] == username), None)
            if user and user['is_admin'] and status == 'inactive':
                return jsonify({"error": "无法禁用管理员用户"}), 403
            else:
                return jsonify({"error": "用户不存在"}), 404
        
    except Exception as e:
        app.logger.error(f"Error in admin_update_user_status: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

@app.route('/api/admin/whitelist', methods=['GET'])
def admin_get_whitelist():
    try:
        # 验证管理员权限
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "缺少认证token"}), 401
        
        success, user_info = auth_manager.verify_admin_token(token)
        if not success or not user_info.get('is_admin'):
            return jsonify({"error": "需要管理员权限"}), 403
        
        whitelist = auth_manager.get_whitelist()
        return jsonify({"ok": True, "whitelist": whitelist})
        
    except Exception as e:
        app.logger.error(f"Error in admin_get_whitelist: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

@app.route('/api/admin/blacklist', methods=['GET'])
def admin_get_blacklist():
    try:
        # 验证管理员权限
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "缺少认证token"}), 401
        
        success, user_info = auth_manager.verify_admin_token(token)
        if not success or not user_info.get('is_admin'):
            return jsonify({"error": "需要管理员权限"}), 403
        
        blacklist = auth_manager.get_blacklist()
        return jsonify({"ok": True, "blacklist": blacklist})
        
    except Exception as e:
        app.logger.error(f"Error in admin_get_blacklist: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

@app.route('/api/admin/admins', methods=['GET'])
def admin_get_admins():
    try:
        # 验证管理员权限
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "缺少认证token"}), 401
        
        success, user_info = auth_manager.verify_admin_token(token)
        if not success or not user_info.get('is_admin'):
            return jsonify({"error": "需要管理员权限"}), 403
        
        admins = auth_manager.get_admin_users()
        return jsonify({"ok": True, "admins": admins})
        
    except Exception as e:
        app.logger.error(f"Error in admin_get_admins: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

@app.route('/api/admin/admins', methods=['POST'])
def admin_manage_admins():
    try:
        # 验证管理员权限
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "缺少认证token"}), 401
        
        success, user_info = auth_manager.verify_admin_token(token)
        if not success or not user_info.get('is_admin'):
            return jsonify({"error": "需要管理员权限"}), 403
        
        body = request.get_json(force=True, silent=True) or {}
        action = body.get('action', '')  # 'add' or 'remove'
        username = body.get('username', '').strip()
        
        if not username:
            return jsonify({"error": "缺少用户名"}), 400
        
        # 保护root用户：不允许添加或移除root的管理员权限
        if username == 'root':
            return jsonify({"error": "root用户是系统内置管理员，无法管理"}), 403
        
        if action == 'add':
            success = auth_manager.add_admin(username)
            message = "已添加为管理员" if success else "用户已是管理员"
        elif action == 'remove':
            success = auth_manager.remove_admin(username)
            message = "已移除管理员权限" if success else "用户不是管理员"
        else:
            return jsonify({"error": "无效的操作"}), 400
        
        return jsonify({"ok": True, "message": message})
        
    except Exception as e:
        app.logger.error(f"Error in admin_manage_admins: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

@app.route('/api/admin/kick-user', methods=['POST'])
def admin_kick_user():
    try:
        # 验证管理员权限
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "缺少认证token"}), 401
        
        success, user_info = auth_manager.verify_admin_token(token)
        if not success or not user_info.get('is_admin'):
            return jsonify({"error": "需要管理员权限"}), 403
        
        body = request.get_json(force=True, silent=True) or {}
        username = body.get('username', '').strip()
        
        if not username:
            return jsonify({"error": "缺少用户名"}), 400
        
        # 查找用户
        data = auth_manager.load_db()
        user = next((u for u in data['users'] if u['username'] == username), None)
        if not user:
            return jsonify({"error": "用户不存在"}), 404
        
        # 清理用户的所有会话
        success = auth_manager.logout_all_sessions(user['id'])
        if success:
            return jsonify({"ok": True, "message": f"已强制登出用户 {username}"})
        else:
            return jsonify({"ok": True, "message": f"用户 {username} 没有活跃会话"})
        
    except Exception as e:
        app.logger.error(f"Error in admin_kick_user: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

@app.route('/api/admin/cleanup-sessions', methods=['POST'])
def admin_cleanup_sessions():
    try:
        # 验证管理员权限
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "缺少认证token"}), 401
        
        success, user_info = auth_manager.verify_admin_token(token)
        if not success or not user_info.get('is_admin'):
            return jsonify({"error": "需要管理员权限"}), 403
        
        # 清理过期和禁用用户的会话
        auth_manager.cleanup_expired_sessions()
        
        return jsonify({"ok": True, "message": "会话清理完成"})
        
    except Exception as e:
        app.logger.error(f"Error in admin_cleanup_sessions: {str(e)}")
        return jsonify({"error": "服务器错误"}), 500

@app.route('/api/records', methods=['GET'])
def list_records():
    try:
        # 验证用户认证
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "需要登录才能查看记录"}), 401
        
        success, user_info = auth_manager.verify_admin_token(token)
        if not success:
            return jsonify({"error": "认证失败，请重新登录"}), 401
        
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception:
        return jsonify({"error": "read_failed"}), 500

@app.route('/api/records/text', methods=['POST'])
def add_text():
    try:
        # 验证用户认证
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "需要登录才能添加记录"}), 401
        
        success, user_info = auth_manager.verify_admin_token(token)
        if not success:
            return jsonify({"error": "认证失败，请重新登录"}), 401
        
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
        
        # 重复检测：同一天同标题且文本一致则认定为重复
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for r in data.get('records', []):
            if r.get('type') == 'text' and r.get('date') == date and r.get('title', '') == title and r.get('text', '') == text:
                return jsonify({"error": "duplicate"}), 200

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
        # 验证用户认证
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "需要登录才能上传文件"}), 401
        
        success, user_info = auth_manager.verify_admin_token(token)
        if not success:
            return jsonify({"error": "认证失败，请重新登录"}), 401
        
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
        
        # 计算文件哈希用于重复检测
        file_bytes = file.read()
        file.seek(0)
        file_hash = hashlib.sha256(file_bytes).hexdigest()

        # 重复检测：相同hash或同一天同标题同文本且文件名/大小相近
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for r in data.get('records', []):
            if r.get('type') in ['image', 'video'] and r.get('date') == date and r.get('title', '') == title and r.get('text', '') == text:
                # 同元数据，进一步通过路径中的hash前缀粗略判断（兼容历史无hash的情况则跳过）
                if r.get('mediaHash') == file_hash:
                    return jsonify({"error": "duplicate"}), 200

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
            "mediaHash": file_hash,
            "createdAt": datetime.utcnow().isoformat() + 'Z',
            "updatedAt": datetime.utcnow().isoformat() + 'Z'
        }
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
        # 验证用户认证
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "需要登录才能删除记录"}), 401
        
        success, user_info = auth_manager.verify_admin_token(token)
        if not success:
            return jsonify({"error": "认证失败，请重新登录"}), 401
        
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

@app.route('/admin')
def admin_redirect():
    """重定向到admin页面"""
    return send_from_directory(ROOT_DIR, 'admin.html')

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



