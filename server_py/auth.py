import hashlib
import json
import os
import uuid
from datetime import datetime, timedelta
from typing import Dict, Optional, Tuple
import jwt
from werkzeug.security import generate_password_hash, check_password_hash

class AuthManager:
    def __init__(self, db_file: str):
        self.db_file = db_file
        self.secret_key = os.environ.get('JWT_SECRET', 'love_secret_key_2024')
        # 内置root用户配置
        self.root_user = {
            "id": "root_user_builtin",
            "username": "root",
            "password_hash": generate_password_hash("123456"),  # 修改为123456
            "email": "",
            "created_at": datetime.utcnow().isoformat(),
            "last_login": None,
            "status": "active",
            "device_fingerprints": [],
            "acceptance_time": None,
            "is_admin": True
        }
        self.init_db()
        # 启动时清理过期会话
        self.cleanup_expired_sessions()
    
    def init_db(self):
        """初始化数据库"""
        if not os.path.exists(self.db_file):
            data = {
                "users": [],
                "sessions": [],
                "device_fingerprints": [],
                "whitelist": [],
                "blacklist": [],
                "admin_users": []  # 不包含root，因为root是内置的
            }
            with open(self.db_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        else:
            # 确保root用户不在admin_users列表中（因为它是内置的）
            data = self.load_db()
            if "root" in data.get("admin_users", []):
                data["admin_users"] = [user for user in data.get("admin_users", []) if user != "root"]
                self.save_db(data)
    
    def load_db(self) -> Dict:
        """加载数据库"""
        try:
            with open(self.db_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {"users": [], "sessions": [], "device_fingerprints": [], "whitelist": [], "blacklist": [], "admin_users": []}
    
    def save_db(self, data: Dict):
        """保存数据库"""
        with open(self.db_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    def generate_device_fingerprint(self, user_agent: str, ip: str, screen_res: str = "") -> str:
        """生成设备指纹"""
        fingerprint_data = f"{user_agent}_{ip}_{screen_res}"
        return hashlib.sha256(fingerprint_data.encode()).hexdigest()[:16]
    
    def register_user(self, username: str, password: str, email: str = "", device_fingerprint: str = "") -> Tuple[bool, str]:
        """注册用户"""
        # 防止注册root用户
        if username == 'root':
            return False, "root用户是系统内置用户，无法注册"
        
        data = self.load_db()
        
        # 检查用户名是否已存在
        if any(user['username'] == username for user in data['users']):
            return False, "用户名已存在"
        
        # 检查是否在黑名单中
        if username in data['blacklist']:
            return False, "该用户已被禁止注册"
        
        # 检查白名单（如果白名单不为空，则只允许白名单用户注册）
        if data['whitelist'] and username not in data['whitelist']:
            return False, "该用户未在白名单中，无法注册"
        
        # 创建新用户
        user_id = str(uuid.uuid4())
        new_user = {
            "id": user_id,
            "username": username,
            "password_hash": generate_password_hash(password),
            "email": email,
            "created_at": datetime.utcnow().isoformat(),
            "last_login": None,
            "status": "active",
            "device_fingerprints": [device_fingerprint] if device_fingerprint else [],
            "acceptance_time": None,  # 同意表白的时间
            "is_admin": username in data['admin_users']
        }
        
        data['users'].append(new_user)
        self.save_db(data)
        return True, "注册成功"
    
    def login_user(self, username: str, password: str, device_fingerprint: str = "") -> Tuple[bool, str, Optional[Dict]]:
        """用户登录"""
        # 内置root用户登录检查
        if username == 'root':
            if check_password_hash(self.root_user['password_hash'], password):
                # 更新设备指纹
                if device_fingerprint and device_fingerprint not in self.root_user['device_fingerprints']:
                    self.root_user['device_fingerprints'].append(device_fingerprint)
                
                # 更新最后登录时间
                self.root_user['last_login'] = datetime.utcnow().isoformat()
                
                # 生成JWT token
                token_payload = {
                    'user_id': self.root_user['id'],
                    'username': username,
                    'exp': datetime.utcnow() + timedelta(days=30)
                }
                token = jwt.encode(token_payload, self.secret_key, algorithm='HS256')
                
                # 保存会话
                data = self.load_db()
                session = {
                    "user_id": self.root_user['id'],
                    "token": token,
                    "device_fingerprint": device_fingerprint,
                    "created_at": datetime.utcnow().isoformat(),
                    "expires_at": (datetime.utcnow() + timedelta(days=30)).isoformat()
                }
                data['sessions'].append(session)
                self.save_db(data)
                
                # 返回用户信息
                user_info = {k: v for k, v in self.root_user.items() if k != 'password_hash'}
                user_info["token"] = token
                return True, "登录成功", user_info
            else:
                return False, "密码错误", None
        
        data = self.load_db()
        
        # 查找用户
        user = next((u for u in data['users'] if u['username'] == username), None)
        if not user:
            return False, "用户不存在", None
        
        # 检查密码
        if not check_password_hash(user['password_hash'], password):
            return False, "密码错误", None
        
        # 检查用户状态
        if user['status'] != 'active':
            return False, "账户已被禁用", None
        
        # 检查黑名单
        if username in data['blacklist']:
            return False, "该用户已被禁止登录", None
        
        # 检查白名单（如果白名单不为空，则只允许白名单用户登录）
        if data['whitelist'] and username not in data['whitelist']:
            return False, "该用户未在白名单中，无法登录", None
        
        # 更新设备指纹
        if device_fingerprint and device_fingerprint not in user['device_fingerprints']:
            user['device_fingerprints'].append(device_fingerprint)
        
        # 更新最后登录时间
        user['last_login'] = datetime.utcnow().isoformat()
        
        # 生成JWT token
        token_payload = {
            'user_id': user['id'],
            'username': username,
            'exp': datetime.utcnow() + timedelta(days=30)
        }
        token = jwt.encode(token_payload, self.secret_key, algorithm='HS256')
        
        # 保存会话
        session = {
            "user_id": user['id'],
            "token": token,
            "device_fingerprint": device_fingerprint,
            "created_at": datetime.utcnow().isoformat(),
            "expires_at": (datetime.utcnow() + timedelta(days=30)).isoformat()
        }
        data['sessions'].append(session)
        
        self.save_db(data)
        
        # 返回用户信息（不包含密码），并附带本次会话token供前端使用
        user_info = {k: v for k, v in user.items() if k != 'password_hash'}
        user_info["token"] = token
        return True, "登录成功", user_info
    
    def admin_login(self, username: str, password: str, device_fingerprint: str = "") -> Tuple[bool, str, Optional[Dict]]:
        """管理员专用登录（仅用于管理功能）"""
        # 内置root用户登录检查
        if username == 'root':
            if check_password_hash(self.root_user['password_hash'], password):
                # 更新设备指纹
                if device_fingerprint and device_fingerprint not in self.root_user['device_fingerprints']:
                    self.root_user['device_fingerprints'].append(device_fingerprint)
                
                # 更新最后登录时间
                self.root_user['last_login'] = datetime.utcnow().isoformat()
                
                # 生成JWT token
                token_payload = {
                    'user_id': self.root_user['id'],
                    'username': username,
                    'exp': datetime.utcnow() + timedelta(days=30)
                }
                token = jwt.encode(token_payload, self.secret_key, algorithm='HS256')
                
                # 保存会话
                data = self.load_db()
                session = {
                    "user_id": self.root_user['id'],
                    "token": token,
                    "device_fingerprint": device_fingerprint,
                    "created_at": datetime.utcnow().isoformat(),
                    "expires_at": (datetime.utcnow() + timedelta(days=30)).isoformat()
                }
                data['sessions'].append(session)
                self.save_db(data)
                
                # 返回用户信息
                user_info = {k: v for k, v in self.root_user.items() if k != 'password_hash'}
                user_info["token"] = token
                return True, "管理员登录成功", user_info
            else:
                return False, "密码错误", None
        
        data = self.load_db()
        
        # 查找用户
        user = next((u for u in data['users'] if u['username'] == username), None)
        if not user:
            return False, "用户不存在", None
        
        # 检查密码
        if not check_password_hash(user['password_hash'], password):
            return False, "密码错误", None
        
        # 检查用户状态
        if user['status'] != 'active':
            return False, "账户已被禁用", None
        
        # 检查是否是管理员用户
        if username not in data['admin_users']:
            return False, "该用户不是管理员", None
        
        # 更新设备指纹
        if device_fingerprint and device_fingerprint not in user['device_fingerprints']:
            user['device_fingerprints'].append(device_fingerprint)
        
        # 更新最后登录时间
        user['last_login'] = datetime.utcnow().isoformat()
        
        # 生成JWT token
        token_payload = {
            'user_id': user['id'],
            'username': username,
            'exp': datetime.utcnow() + timedelta(days=30)
        }
        token = jwt.encode(token_payload, self.secret_key, algorithm='HS256')
        
        # 保存会话
        session = {
            "user_id": user['id'],
            "token": token,
            "device_fingerprint": device_fingerprint,
            "created_at": datetime.utcnow().isoformat(),
            "expires_at": (datetime.utcnow() + timedelta(days=30)).isoformat()
        }
        data['sessions'].append(session)
        
        self.save_db(data)
        
        # 返回用户信息（不包含密码），并附带本次会话token供前端使用
        user_info = {k: v for k, v in user.items() if k != 'password_hash'}
        user_info["token"] = token
        return True, "管理员登录成功", user_info
    
    def verify_admin_token(self, token: str) -> Tuple[bool, Optional[Dict]]:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            data = self.load_db()
            
            # 检查是否是内置root用户
            if payload['user_id'] == self.root_user['id']:
                # 检查会话是否存在
                session = next((s for s in data['sessions'] if s['token'] == token), None)
                if not session:
                    return False, None
                
                # 检查会话是否过期
                if datetime.fromisoformat(session['expires_at']) < datetime.utcnow():
                    # 会话过期，清理过期会话
                    self.cleanup_expired_sessions()
                    return False, None
                
                # 返回root用户信息
                user_info = {k: v for k, v in self.root_user.items() if k != 'password_hash'}
                return True, user_info
            
            # 查找用户
            user = next((u for u in data['users'] if u['id'] == payload['user_id']), None)
            if not user or user['status'] != 'active':
                return False, None
            
            # 检查白名单（如果白名单不为空，则只允许白名单用户访问）
            if data['whitelist'] and user['username'] not in data['whitelist']:
                # 用户不在白名单中，清理其所有会话
                self.logout_all_sessions(user['id'])
                return False, None
            
            # 检查黑名单 - 但如果是管理员用户，允许通过
            if user['username'] in data['blacklist']:
                # 检查是否是管理员用户
                if user['username'] not in data['admin_users']:
                    # 非管理员用户在黑名单中，清理其所有会话
                    self.logout_all_sessions(user['id'])
                    return False, None
                # 管理员用户即使在黑名单中，也允许使用管理员功能
            
            # 检查会话是否存在
            session = next((s for s in data['sessions'] if s['token'] == token), None)
            if not session:
                return False, None
            
            # 检查会话是否过期
            if datetime.fromisoformat(session['expires_at']) < datetime.utcnow():
                # 会话过期，清理过期会话
                self.cleanup_expired_sessions()
                return False, None
            
            # 动态更新管理员状态（确保与admin_users列表同步）
            user['is_admin'] = user['username'] in data['admin_users']
            
            user_info = {k: v for k, v in user.items() if k != 'password_hash'}
            return True, user_info
            
        except jwt.ExpiredSignatureError:
            return False, None
        except jwt.InvalidTokenError:
            return False, None
    
    def verify_token(self, token: str) -> Tuple[bool, Optional[Dict]]:
        """验证token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            data = self.load_db()
            
            # 检查是否是内置root用户
            if payload['user_id'] == self.root_user['id']:
                # 检查会话是否存在
                session = next((s for s in data['sessions'] if s['token'] == token), None)
                if not session:
                    return False, None
                
                # 检查会话是否过期
                if datetime.fromisoformat(session['expires_at']) < datetime.utcnow():
                    # 会话过期，清理过期会话
                    self.cleanup_expired_sessions()
                    return False, None
                
                # 返回root用户信息
                user_info = {k: v for k, v in self.root_user.items() if k != 'password_hash'}
                return True, user_info
            
            # 查找用户
            user = next((u for u in data['users'] if u['id'] == payload['user_id']), None)
            if not user or user['status'] != 'active':
                return False, None
            
            # 检查白名单（如果白名单不为空，则只允许白名单用户访问）
            if data['whitelist'] and user['username'] not in data['whitelist']:
                # 用户不在白名单中，清理其所有会话
                self.logout_all_sessions(user['id'])
                return False, None
            
            # 检查黑名单
            if user['username'] in data['blacklist']:
                # 用户在黑名单中，清理其所有会话
                self.logout_all_sessions(user['id'])
                return False, None
            
            # 检查会话是否存在
            session = next((s for s in data['sessions'] if s['token'] == token), None)
            if not session:
                return False, None
            
            # 检查会话是否过期
            if datetime.fromisoformat(session['expires_at']) < datetime.utcnow():
                # 会话过期，清理过期会话
                self.cleanup_expired_sessions()
                return False, None
            
            # 动态更新管理员状态（确保与admin_users列表同步）
            user['is_admin'] = user['username'] in data['admin_users']
            
            user_info = {k: v for k, v in user.items() if k != 'password_hash'}
            return True, user_info
            
        except jwt.ExpiredSignatureError:
            return False, None
        except jwt.InvalidTokenError:
            return False, None
    
    def set_acceptance_time(self, user_id: str, acceptance_time: str) -> bool:
        """设置用户同意表白的时间"""
        data = self.load_db()
        user = next((u for u in data['users'] if u['id'] == user_id), None)
        if user:
            user['acceptance_time'] = acceptance_time
            self.save_db(data)
            return True
        return False
    
    def get_acceptance_time(self, user_id: str) -> Optional[str]:
        """获取用户同意表白的时间"""
        data = self.load_db()
        user = next((u for u in data['users'] if u['id'] == user_id), None)
        return user['acceptance_time'] if user else None
    
    def check_device_access(self, device_fingerprint: str, username: str) -> Tuple[bool, str]:
        """检查设备访问权限"""
        data = self.load_db()
        
        # 检查黑名单
        if username in data['blacklist']:
            return False, "该用户已被禁止访问"
        
        # 检查白名单（如果白名单不为空，则只允许白名单用户）
        if data['whitelist'] and username not in data['whitelist']:
            return False, "该用户未在白名单中"
        
        # 查找用户
        user = next((u for u in data['users'] if u['username'] == username), None)
        if not user:
            return False, "用户不存在"
        
        # 检查设备是否已注册
        if device_fingerprint in user['device_fingerprints']:
            return True, "设备已验证"
        
        return False, "新设备需要登录验证"
    
    def add_to_whitelist(self, username: str) -> bool:
        """添加到白名单"""
        data = self.load_db()
        # 保护root用户：不允许将root添加到白名单
        if username == 'root':
            return False
        if username not in data['whitelist']:
            data['whitelist'].append(username)
            self.save_db(data)
            return True
        return False
    
    def remove_from_whitelist(self, username: str) -> bool:
        """从白名单移除"""
        data = self.load_db()
        if username in data['whitelist']:
            data['whitelist'].remove(username)
            self.save_db(data)
            return True
        return False
    
    def add_to_blacklist(self, username: str) -> bool:
        """添加到黑名单"""
        data = self.load_db()
        # 保护root用户：不允许将root添加到黑名单
        if username == 'root':
            return False
        if username not in data['blacklist']:
            data['blacklist'].append(username)
            self.save_db(data)
            return True
        return False
    
    def remove_from_blacklist(self, username: str) -> bool:
        """从黑名单移除"""
        data = self.load_db()
        if username in data['blacklist']:
            data['blacklist'].remove(username)
            self.save_db(data)
            return True
        return False
    
    def get_all_users(self) -> list:
        """获取所有用户（管理员功能）"""
        data = self.load_db()
        # 只返回数据库中的用户，不包含内置root用户
        return [{k: v for k, v in user.items() if k != 'password_hash'} for user in data['users']]
    
    def update_user_status(self, username: str, status: str) -> bool:
        """更新用户状态（管理员功能）"""
        # 特别保护root用户：不允许禁用root用户
        if username == 'root' and status == 'inactive':
            return False  # 拒绝禁用root用户
        
        data = self.load_db()
        user = next((u for u in data['users'] if u['username'] == username), None)
        if user:
            # 保护管理员：不允许禁用管理员用户
            if user['is_admin'] and status == 'inactive':
                return False  # 拒绝禁用管理员
            
            # 如果用户被禁用，清理其所有会话
            if status == 'inactive':
                self.logout_all_sessions(user['id'])
                print(f"用户 {username} 被禁用，已清理其所有会话")
            
            user['status'] = status
            self.save_db(data)
            return True
        return False
    
    def get_whitelist(self) -> list:
        """获取白名单列表（管理员功能）"""
        data = self.load_db()
        return data['whitelist']
    
    def get_blacklist(self) -> list:
        """获取黑名单列表（管理员功能）"""
        data = self.load_db()
        return data['blacklist']
    
    def add_admin(self, username: str) -> bool:
        """添加管理员（超级管理员功能）"""
        # 不允许添加root用户，因为它是内置的
        if username == 'root':
            return False
        
        data = self.load_db()
        if username not in data['admin_users']:
            data['admin_users'].append(username)
            # 更新对应用户的is_admin字段
            user = next((u for u in data['users'] if u['username'] == username), None)
            if user:
                user['is_admin'] = True
            self.save_db(data)
            return True
        return False
    
    def remove_admin(self, username: str) -> bool:
        """移除管理员（超级管理员功能）"""
        data = self.load_db()
        # 保护root用户：不允许移除root的管理员权限
        if username == 'root':
            return False
        if username in data['admin_users']:
            data['admin_users'].remove(username)
            # 更新对应用户的is_admin字段
            user = next((u for u in data['users'] if u['username'] == username), None)
            if user:
                user['is_admin'] = False
            self.save_db(data)
            return True
        return False
    
    def get_admin_users(self) -> list:
        """获取管理员列表（超级管理员功能）"""
        data = self.load_db()
        admin_users = data.get('admin_users', []).copy()
        # 确保root用户始终在管理员列表中
        if 'root' not in admin_users:
            admin_users.append('root')
        return admin_users
    
    def cleanup_expired_sessions(self):
        """清理过期的会话"""
        data = self.load_db()
        current_time = datetime.utcnow()
        
        # 过滤掉过期的会话
        original_count = len(data['sessions'])
        data['sessions'] = [
            session for session in data['sessions'] 
            if datetime.fromisoformat(session['expires_at']) >= current_time
        ]
        
        # 清理禁用用户的会话
        inactive_users = [user['id'] for user in data['users'] if user['status'] != 'active']
        sessions_before_inactive_cleanup = len(data['sessions'])
        data['sessions'] = [
            session for session in data['sessions']
            if session['user_id'] not in inactive_users
        ]
        
        # 如果有会话被清理，保存数据库
        total_cleaned = original_count - len(data['sessions'])
        if total_cleaned > 0:
            self.save_db(data)
            expired_cleaned = original_count - sessions_before_inactive_cleanup
            inactive_cleaned = sessions_before_inactive_cleanup - len(data['sessions'])
            print(f"清理了 {expired_cleaned} 个过期会话和 {inactive_cleaned} 个禁用用户会话")
    
    def logout_user(self, token: str) -> bool:
        """用户登出，移除会话"""
        data = self.load_db()
        
        # 查找并移除会话
        original_count = len(data['sessions'])
        data['sessions'] = [s for s in data['sessions'] if s['token'] != token]
        
        if len(data['sessions']) < original_count:
            self.save_db(data)
            return True
        return False
    
    def logout_all_sessions(self, user_id: str) -> bool:
        """登出用户的所有会话"""
        data = self.load_db()
        
        # 移除用户的所有会话
        original_count = len(data['sessions'])
        data['sessions'] = [s for s in data['sessions'] if s['user_id'] != user_id]
        
        if len(data['sessions']) < original_count:
            self.save_db(data)
            return True
        return False
