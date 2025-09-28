// 表白网站交互功能 - 统一初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面开始加载');
    
    // 显示加载动画
    showLoadingAnimation();
    
    // 初始化所有功能
    setTimeout(() => {
        hideLoadingAnimation();
        forceHideLoading(); // 双重保险
        initializeAllFeatures();
    }, 2000);
});

function showLoadingAnimation() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.remove('hidden');
        console.log('显示加载动画');
    }
}

function hideLoadingAnimation() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hidden');
        console.log('隐藏加载动画');
        // 强制隐藏，防止显示问题
        loading.style.display = 'none';
    }
}

// 强制隐藏加载动画的函数（用于紧急情况）
function forceHideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
        loading.style.opacity = '0';
        loading.style.visibility = 'hidden';
        console.log('强制隐藏加载动画');
    }
}

// 强制隐藏所有弹窗和模态框
function forceHideAllModals() {
    // 隐藏记录详情弹窗
    const recordDetailModal = document.getElementById('recordDetailModal');
    if (recordDetailModal) {
        recordDetailModal.classList.add('hidden');
        recordDetailModal.style.display = 'none';
        recordDetailModal.style.opacity = '0';
        recordDetailModal.style.visibility = 'hidden';
        console.log('强制隐藏记录详情弹窗');
    }
    
    // 隐藏其他可能的弹窗
    const modals = document.querySelectorAll('.modal, .popup, .overlay');
    modals.forEach(modal => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
    });
    
    console.log('强制隐藏所有弹窗');
}

// 全局函数，可在控制台手动调用
window.hideLoading = forceHideLoading;
window.hideAllModals = forceHideAllModals;

function initializeAllFeatures() {
    console.log('开始初始化所有功能');
    
    // 强制隐藏所有弹窗和模态框
    forceHideAllModals();
    
    // 创建更多飘动的心形
    createFloatingHearts();
    
    // 添加点击效果
    addClickEffects();
    
    // 添加键盘交互
    addKeyboardInteractions();
    
    // 添加文字动画
    addTextAnimations();
    
    // 添加滚动效果
    addScrollEffects();
    
    // 初始化功能卡片
    initializeFeatureCards();
    
    // 初始化同意/拒绝与上传
    setupConsentAndRecords();
    
    // 检查认证状态和同意状态
    checkPreviousAcceptance();
    
    // 调试：检查页面元素
    setTimeout(() => {
        debugPageElements();
    }, 1000);
    
    // 初始化高级功能
    setTimeout(() => {
        initializeAdvancedFeatures();
    }, 3000);
    
    console.log('所有功能初始化完成');
}

function showSurprise() {
    const surprise = document.getElementById('surprise');
    const button = document.querySelector('.love-button');
    
    if (surprise.classList.contains('hidden')) {
        surprise.classList.remove('hidden');
        button.textContent = '再次点击 💕';
        
        // 创建爆炸效果
        createExplosion();
        
        // 播放音效（如果需要的话）
        playLoveSound();
    } else {
        surprise.classList.add('hidden');
        button.textContent = '点击这里 💖';
    }
}

function createFloatingHearts() {
    const hearts = ['💕', '💖', '💗', '💝', '💘', '💞', '💓', '💟'];
    const container = document.querySelector('.floating-hearts');
    
    // 创建更多心形
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
        container.appendChild(heart);
    }
}

function addClickEffects() {
    document.addEventListener('click', function(e) {
        // 创建点击波纹效果
        createRipple(e.clientX, e.clientY);
        
        // 随机创建心形
        if (Math.random() < 0.3) {
            createClickHeart(e.clientX, e.clientY);
        }
    });
}

function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.background = 'rgba(255, 107, 107, 0.6)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '1000';
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function createClickHeart(x, y) {
    const heart = document.createElement('div');
    heart.textContent = '💕';
    heart.style.position = 'fixed';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = '20px';
    heart.style.transform = 'translate(-50%, -50%)';
    heart.style.animation = 'heartFloat 2s ease-out forwards';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 2000);
}

function createExplosion() {
    const button = document.querySelector('.love-button');
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // 创建爆炸心形
    for (let i = 0; i < 12; i++) {
        const heart = document.createElement('div');
        heart.textContent = '💕';
        heart.style.position = 'fixed';
        heart.style.left = centerX + 'px';
        heart.style.top = centerY + 'px';
        heart.style.fontSize = '24px';
        heart.style.transform = 'translate(-50%, -50%)';
        heart.style.animation = `explode 1s ease-out forwards`;
        heart.style.animationDelay = (i * 0.05) + 's';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        
        // 随机方向
        const angle = (i * 30) * Math.PI / 180;
        const distance = 100 + Math.random() * 50;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        heart.style.setProperty('--end-x', endX + 'px');
        heart.style.setProperty('--end-y', endY + 'px');
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
}

function addKeyboardInteractions() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showSurprise();
        }
    });
}

// 已删除的功能：音乐、照片、倒计时

// 添加CSS动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            width: 10px;
            height: 10px;
            opacity: 1;
        }
        100% {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
    
    @keyframes heartFloat {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        50% {
            transform: translate(-50%, -70px) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -100px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes explode {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        50% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 表白网站高级交互功能
// 重复代码已删除

function showSurprise() {
    const surprise = document.getElementById('surprise');
    const button = document.querySelector('.love-button');
    
    if (surprise.classList.contains('hidden')) {
        surprise.classList.remove('hidden');
        button.textContent = '再次点击 💕';
        
        // 创建爆炸效果
        createExplosion();
        
        // 播放音效（如果需要的话）
        playLoveSound();
    } else {
        surprise.classList.add('hidden');
        button.textContent = '点击这里 💖';
    }
}

function createFloatingHearts() {
    const hearts = ['💕', '💖', '💗', '💝', '💘', '💞', '💓', '💟'];
    const container = document.querySelector('.floating-hearts');
    
    // 创建更多心形
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
        container.appendChild(heart);
    }
}

function addClickEffects() {
    document.addEventListener('click', function(e) {
        // 创建点击波纹效果
        createRipple(e.clientX, e.clientY);
        
        // 随机创建心形
        if (Math.random() < 0.3) {
            createClickHeart(e.clientX, e.clientY);
        }
    });
}

function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.background = 'rgba(255, 107, 107, 0.6)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '1000';
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function createClickHeart(x, y) {
    const heart = document.createElement('div');
    heart.textContent = '💕';
    heart.style.position = 'fixed';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = '20px';
    heart.style.transform = 'translate(-50%, -50%)';
    heart.style.animation = 'heartFloat 2s ease-out forwards';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 2000);
}

function createExplosion() {
    const button = document.querySelector('.love-button');
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // 创建爆炸心形
    for (let i = 0; i < 12; i++) {
        const heart = document.createElement('div');
        heart.textContent = '💕';
        heart.style.position = 'fixed';
        heart.style.left = centerX + 'px';
        heart.style.top = centerY + 'px';
        heart.style.fontSize = '24px';
        heart.style.transform = 'translate(-50%, -50%)';
        heart.style.animation = `explode 1s ease-out forwards`;
        heart.style.animationDelay = (i * 0.05) + 's';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        
        // 随机方向
        const angle = (i * 30) * Math.PI / 180;
        const distance = 100 + Math.random() * 50;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        heart.style.setProperty('--end-x', endX + 'px');
        heart.style.setProperty('--end-y', endY + 'px');
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
}

function addKeyboardInteractions() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showSurprise();
        }
    });
}

function playLoveSound() {
    // 创建音频上下文
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // 创建简单的音调
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // 设置音调参数
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.4); // G5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.6);
    
    // 显示提示
    showNotification('🎵 爱的声音正在播放...');
}

// 照片画廊功能已删除

// 倒计时功能已删除

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 107, 107, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // 3秒后自动消失
    setTimeout(() => {
        document.body.removeChild(notification);
        document.head.removeChild(style);
    }, 3000);
}

// 新增功能函数
function addTextAnimations() {
    const loveTexts = document.querySelectorAll('.love-text');
    loveTexts.forEach((text, index) => {
        text.style.animationDelay = `${index * 0.5}s`;
        text.classList.add('animate-text');
    });
}

function addScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.heart-container');
        
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('animate-card');
    });
}

// 添加鼠标跟随效果
function addMouseFollowEffect() {
    let mouseX = 0, mouseY = 0;
    let ballX = 0, ballY = 0;
    const speed = 0.1;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animate() {
        ballX += (mouseX - ballX) * speed;
        ballY += (mouseY - ballY) * speed;
        
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) {
            cursor.style.left = ballX + 'px';
            cursor.style.top = ballY + 'px';
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// 添加自定义光标
function addCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '💕';
    document.body.appendChild(cursor);
    
    const style = document.createElement('style');
    style.textContent = `
        .custom-cursor {
            position: fixed;
            width: 30px;
            height: 30px;
            pointer-events: none;
            z-index: 9999;
            font-size: 20px;
            transition: transform 0.1s ease;
        }
        .custom-cursor.hover {
            transform: scale(1.5);
        }
    `;
    document.head.appendChild(style);
    
    // 为可点击元素添加悬停效果
    const clickableElements = document.querySelectorAll('button, .feature-card, .love-text');
    clickableElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    
    addMouseFollowEffect();
}

// 添加页面可见性检测
function addVisibilityDetection() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // 页面隐藏时暂停动画
            document.body.style.animationPlayState = 'paused';
        } else {
            // 页面显示时恢复动画
            document.body.style.animationPlayState = 'running';
        }
    });
}

// 添加性能监控
function addPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                if (loadTime > 3000) {
                    console.warn('页面加载时间较长:', loadTime + 'ms');
                }
            }, 0);
        });
    }
}

// 初始化所有高级功能
function initializeAdvancedFeatures() {
    addCustomCursor();
    addVisibilityDetection();
    addPerformanceMonitoring();
}

// 高级功能初始化已合并到主初始化函数中

// ================== 认证和权限管理 ==================
const API_BASE = window.location.origin;
let currentUser = null;
let authToken = null;

// 设备指纹生成
function generateDeviceFingerprint() {
    const userAgent = navigator.userAgent;
    const screenRes = `${screen.width}x${screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    
    const fingerprintData = `${userAgent}_${screenRes}_${timezone}_${language}`;
    
    // 简单的哈希函数
    let hash = 0;
    for (let i = 0; i < fingerprintData.length; i++) {
        const char = fingerprintData.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
    }
    
    return Math.abs(hash).toString(16).substring(0, 16);
}

// 检查用户认证状态
async function checkAuthStatus() {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('current_user');
    
    if (savedToken && savedUser) {
        try {
            const response = await fetch(`${API_BASE}/api/auth/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: savedToken
                })
            });
            
            const data = await response.json();
            
            if (data.ok && data.user) {
                // 验证成功，更新用户信息
                authToken = savedToken;
                currentUser = data.user; // 使用服务器返回的最新用户信息
                console.log('Token验证成功，用户已登录:', currentUser.username);
                return true;
            } else {
                // Token无效或过期，清除本地存储
                console.log('Token验证失败，清除本地存储');
                localStorage.removeItem('auth_token');
                localStorage.removeItem('current_user');
                authToken = '';
                currentUser = null;
            }
        } catch (error) {
            console.error('验证token失败:', error);
            // 网络错误时也清除本地存储，确保安全
            localStorage.removeItem('auth_token');
            localStorage.removeItem('current_user');
            authToken = '';
            currentUser = null;
        }
    }
    
    return false;
}

// 用户注册
async function registerUser(username, password, email = '') {
    try {
        const deviceFingerprint = generateDeviceFingerprint();
        
        const response = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
                screen_resolution: `${screen.width}x${screen.height}`
            })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        return { error: '网络错误' };
    }
}

// 用户登录
async function loginUser(username, password) {
    try {
        const deviceFingerprint = generateDeviceFingerprint();
        
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                screen_resolution: `${screen.width}x${screen.height}`
            })
        });
        
        const data = await response.json();
        
        if (data.ok) {
            authToken = data.user.token || 'user_token'; // 临时token
            currentUser = data.user;
            
            // 保存到本地存储
            localStorage.setItem('auth_token', authToken);
            localStorage.setItem('current_user', JSON.stringify(currentUser));
            
            return { success: true, user: currentUser };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        return { success: false, error: '网络错误' };
    }
}

// 检查设备访问权限
async function checkDeviceAccess(username) {
    try {
        const deviceFingerprint = generateDeviceFingerprint();
        
        const response = await fetch(`${API_BASE}/api/auth/check-device`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                screen_resolution: `${screen.width}x${screen.height}`
            })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        return { ok: false, message: '网络错误' };
    }
}

// 设置同意时间
async function setAcceptanceTime(acceptanceTime) {
    if (!authToken) return false;
    
    try {
        const response = await fetch(`${API_BASE}/api/auth/set-acceptance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: authToken,
                acceptance_time: acceptanceTime
            })
        });
        
        const data = await response.json();
        return data.ok;
    } catch (error) {
        return false;
    }
}

// 获取同意时间
async function getAcceptanceTime() {
    if (!authToken) return null;
    
    try {
        const response = await fetch(`${API_BASE}/api/auth/get-acceptance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: authToken
            })
        });
        
        const data = await response.json();
        return data.acceptance_time;
    } catch (error) {
        return null;
    }
}

// 登出
function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('love_acceptance_time'); // 清除旧的本地存储
    
    // 重新加载页面
    location.reload();
}

// ================== 同意/拒绝 + 记录上传 ==================

function setupConsentAndRecords() {
    const consentSection = document.getElementById('consentSection');
    const acceptedSection = document.getElementById('acceptedSection');
    const recordForm = document.getElementById('recordForm');
    const recordsView = document.getElementById('recordsView');
    const retentionSection = document.getElementById('retentionSection');
    if (!consentSection) return;

    const btnAccept = document.getElementById('btnAccept');
    const btnReject = document.getElementById('btnReject');
    const btnAddRecord = document.getElementById('btnAddRecord');
    const btnViewRecords = document.getElementById('btnViewRecords');
    const btnSaveText = document.getElementById('btnSaveText');
    const btnSaveMedia = document.getElementById('btnSaveMedia');
    const btnCancelRecord = document.getElementById('btnCancelRecord');
    const btnBackToMain = document.getElementById('btnBackToMain');
    const btnRetentionMemories = document.getElementById('btnRetentionMemories');
    const btnRetentionNote = document.getElementById('btnRetentionNote');
    const btnRetentionLater = document.getElementById('btnRetentionLater');
    const btnSaveRetentionNote = document.getElementById('btnSaveRetentionNote');
    const btnChangeMind = document.getElementById('btnChangeMind');

    // 存储同意时间到localStorage
    const ACCEPTANCE_KEY = 'love_acceptance_time';
    
    btnAccept && btnAccept.addEventListener('click', async () => {
        try {
            console.log('同意按钮被点击');
            
            // 检查是否已登录
            if (!currentUser) {
                showNotification('请先登录后再进行操作');
                showLoginModal();
                return;
            }
            
            // 检查是否已经同意过
            const existingAcceptanceTime = await getAcceptanceTime();
            if (existingAcceptanceTime) {
                showNotification('您已经同意过了，无需重复操作');
                return;
            }
            
            // 记录同意时间到服务器
            const acceptanceTime = new Date().toISOString();
            const success = await setAcceptanceTime(acceptanceTime);
            
            if (success) {
                // 隐藏其他区域
                if (consentSection) consentSection.classList.add('hidden');
                if (retentionSection) retentionSection.classList.add('hidden');
                
                // 显示同意后的区域
                if (acceptedSection) {
                    acceptedSection.classList.remove('hidden');
                    console.log('已显示同意后区域');
                } else {
                    console.error('找不到acceptedSection元素');
                }
                
                // 同时保存到本地存储作为备份
                localStorage.setItem(ACCEPTANCE_KEY, acceptanceTime);
                console.log('已保存同意时间:', acceptanceTime);
                
                // 启动计时器
                startLoveTimer();
                
                showNotification('谢谢你愿意，我们一起记录吧 💕');
            } else {
                showNotification('保存失败，请重试');
            }
        } catch (error) {
            console.error('同意按钮点击时发生错误:', error);
            showNotification('发生错误，请刷新页面重试');
        }
    });

    btnReject && btnReject.addEventListener('click', () => {
        acceptedSection && acceptedSection.classList.add('hidden');
        recordForm && recordForm.classList.add('hidden');
        recordsView && recordsView.classList.add('hidden');
        retentionSection && retentionSection.classList.remove('hidden');
        showNotification('谢谢你的坦诚，我会尊重你的选择');
    });

    // 添加记录按钮
    btnAddRecord && btnAddRecord.addEventListener('click', () => {
        recordForm && recordForm.classList.remove('hidden');
        recordsView && recordsView.classList.add('hidden');
    });

    // 查看记录按钮
    btnViewRecords && btnViewRecords.addEventListener('click', () => {
        recordsView && recordsView.classList.remove('hidden');
        recordForm && recordForm.classList.add('hidden');
        loadRecordsList();
    });

    // 取消记录按钮
    btnCancelRecord && btnCancelRecord.addEventListener('click', () => {
        recordForm && recordForm.classList.add('hidden');
        // 清空表单
        document.getElementById('recTitle').value = '';
        document.getElementById('recText').value = '';
        document.getElementById('recFile').value = '';
    });

    // 返回主页按钮
    btnBackToMain && btnBackToMain.addEventListener('click', () => {
        recordsView && recordsView.classList.add('hidden');
        recordForm && recordForm.classList.add('hidden');
    });

    // 重置功能已删除

    btnRetentionMemories && btnRetentionMemories.addEventListener('click', () => {
        showNotification('照片功能已删除');
    });

    btnRetentionNote && btnRetentionNote.addEventListener('click', () => {
        const box = document.getElementById('retentionNoteBox');
        if (box) box.classList.remove('hidden');
    });

    btnSaveRetentionNote && btnSaveRetentionNote.addEventListener('click', () => {
        const note = document.getElementById('retentionNote');
        try {
            const text = (note && note.value) || '';
            localStorage.setItem('retention_note', text);
            showNotification('已保存到本地');
        } catch (e) {}
    });

    btnChangeMind && btnChangeMind.addEventListener('click', () => {
        const box = document.getElementById('retentionNoteBox');
        if (box) box.classList.add('hidden');
        retentionSection && retentionSection.classList.add('hidden');
        recordForm && recordForm.classList.remove('hidden');
        showNotification('欢迎回来，我们继续 💖');
    });

    // 选择文件后自动识别类型并同步选择框
    const fileInputAuto = document.getElementById('recFile');
    const typeSelect = document.getElementById('recType');
    if (fileInputAuto && typeSelect) {
        fileInputAuto.addEventListener('change', () => {
            const f = fileInputAuto.files && fileInputAuto.files[0];
            if (!f) return;
            const isVideo = (f.type || '').startsWith('video/');
            typeSelect.value = isVideo ? 'video' : 'image';
        });
    }

    btnSaveText && btnSaveText.addEventListener('click', async () => {
        const title = document.getElementById('recTitle').value.trim();
        const text = document.getElementById('recText').value.trim();
        const date = document.getElementById('recDate').value;
        
        // 前端验证
        if (!title && !text) {
            showNotification('请填写一些文字');
            return;
        }
        if (title.length > 100) {
            showNotification('标题不能超过100个字符');
            return;
        }
        if (text.length > 1000) {
            showNotification('文字内容不能超过1000个字符');
            return;
        }
        
        try {
            // 检查用户认证状态
            if (!currentUser || !authToken) {
                showNotification('请先登录后再添加记录');
                showLoginModal();
                return;
            }
            
            const res = await fetch(`${API_BASE}/api/records/text`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ title, text, date })
            });
            const data = await res.json();
            if (data.ok) {
                showNotification('文字已保存到服务端本地2');
                document.getElementById('recText').value = '';
                document.getElementById('recTitle').value = '';
            } else {
                showNotification('保存失败: ' + (data.error || '未知错误'));
            }
        } catch (e) {
            showNotification('网络错误');
        }
    });

    btnSaveMedia && btnSaveMedia.addEventListener('click', async () => {
        const fileInput = document.getElementById('recFile');
        const title = document.getElementById('recTitle').value.trim();
        const text = document.getElementById('recText').value.trim();
        const date = document.getElementById('recDate').value;
        const selectedType = document.getElementById('recType').value;
        
        if (!fileInput.files || fileInput.files.length === 0) {
            showNotification('请选择图片或视频');
            return;
        }
        
        const file = fileInput.files[0];
        
        // 文件大小检查（10MB）
        if (file.size > 10 * 1024 * 1024) {
            showNotification('文件大小不能超过10MB');
            return;
        }
        
        // 文件类型检查
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime', 'video/ogg', 'video/x-matroska'];
        if (!allowedTypes.includes(file.type)) {
            showNotification('不支持的文件类型，请选择图片或视频');
            return;
        }
        
        // 文字长度检查
        if (title.length > 100) {
            showNotification('标题不能超过100个字符');
            return;
        }
        if (text.length > 1000) {
            showNotification('文字内容不能超过1000个字符');
            return;
        }
        
        const form = new FormData();
        form.append('file', file);
        form.append('title', title);
        form.append('text', text);
        form.append('date', date);
        // 最终类型以文件MIME为准，避免用户忘记切换
        const finalType = (file.type || '').startsWith('video/') ? 'video' : 'image';
        form.append('type', finalType);
        
        try {
            // 检查用户认证状态
            if (!currentUser || !authToken) {
                showNotification('请先登录后再上传文件');
                showLoginModal();
                return;
            }
            
            const res = await fetch(`${API_BASE}/api/records/media`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: form
            });
            const data = await res.json();
            if (data.error === 'duplicate') {
                showNotification('重复上传：该内容已存在');
                return;
            }
            if (data.ok) {
                showNotification('已上传到服务端本地2');
                fileInput.value = '';
                document.getElementById('recTitle').value = '';
                document.getElementById('recText').value = '';
            } else {
                showNotification('上传失败: ' + (data.error || '未知错误'));
            }
        } catch (e) {
            showNotification('网络错误');
        }
    });
}

// 网络时间计时器
function startLoveTimer() {
    try {
        const ACCEPTANCE_KEY = 'love_acceptance_time';
        const acceptanceTime = localStorage.getItem(ACCEPTANCE_KEY);
        
        if (!acceptanceTime) {
            console.log('没有找到同意时间，计时器不启动');
            return;
        }
        
        console.log('启动计时器，同意时间:', acceptanceTime);
        
        function updateTimer() {
            try {
                const now = new Date();
                const start = new Date(acceptanceTime);
                const diff = now - start;
                
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                
                const timerDays = document.getElementById('timerDays');
                const timerHours = document.getElementById('timerHours');
                const timerMinutes = document.getElementById('timerMinutes');
                
                if (timerDays) {
                    timerDays.textContent = days;
                } else {
                    console.error('找不到timerDays元素');
                }
                if (timerHours) {
                    timerHours.textContent = hours;
                } else {
                    console.error('找不到timerHours元素');
                }
                if (timerMinutes) {
                    timerMinutes.textContent = minutes;
                } else {
                    console.error('找不到timerMinutes元素');
                }
                
                console.log(`计时器更新: ${days}天 ${hours}小时 ${minutes}分钟`);
            } catch (error) {
                console.error('更新计时器时发生错误:', error);
            }
        }
        
        updateTimer();
        setInterval(updateTimer, 60000); // 每分钟更新一次
        console.log('计时器已启动');
    } catch (error) {
        console.error('启动计时器时发生错误:', error);
    }
}

// 安全的HTML转义函数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 加载记录列表
async function loadRecordsList() {
    const recordsList = document.getElementById('recordsList');
    if (!recordsList) return;
    
    try {
        // 检查用户认证状态
        if (!currentUser || !authToken) {
            recordsList.innerHTML = '<div style="text-align:center;color:#ff6b6b;padding:20px;">请先登录才能查看记录</div>';
            return;
        }
        
        const res = await fetch(`${API_BASE}/api/records`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const data = await res.json();
        
        if (data.records && data.records.length > 0) {
            recordsList.innerHTML = data.records.map(record => {
                const safeTitle = escapeHtml(record.title || '无标题');
                const safeDate = escapeHtml(record.date);
                const safeText = record.text ? escapeHtml(record.text.substring(0, 50)) + (record.text.length > 50 ? '...' : '') : '';
                const safeId = escapeHtml(record.id);
                const safeCreatedAt = escapeHtml(new Date(record.createdAt).toLocaleDateString());
                
                return `
                    <div class="record-item" style="border:1px solid #eee;border-radius:10px;padding:15px;margin-bottom:10px;">
                        <div class="record-summary" style="cursor:pointer;" onclick="toggleRecordDetail('${safeId}')">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <div>
                                    <strong style="color:#333;">${safeTitle}</strong>
                                    <div style="font-size:0.9em;color:#666;margin-top:5px;">
                                        ${safeDate} • ${record.type === 'text' ? '📝' : record.type === 'image' ? '🖼️' : '🎥'}
                                    </div>
                                </div>
                                <div style="font-size:0.8em;color:#999;">
                                    ${safeCreatedAt}
                                </div>
                            </div>
                            ${safeText ? `<div style="margin-top:8px;color:#555;font-size:0.9em;">${safeText}</div>` : ''}
                        </div>
                        <div class="record-detail" id="detail-${safeId}" style="display:none;margin-top:15px;padding-top:15px;border-top:1px solid #eee;">
                            <div style="color:#666;margin-bottom:10px;">
                                <strong>日期：</strong>${safeDate}
                            </div>
                            ${record.text ? `<div style="margin-bottom:15px;line-height:1.6;color:#333;">${escapeHtml(record.text)}</div>` : ''}
                            ${record.mediaPath ? `<div style="margin-bottom:15px;">
                                ${record.type === 'image' ? 
                                    `<img src="${API_BASE}/storage/${record.mediaPath}" style="max-width:100%;border-radius:10px;" alt="图片">` : 
                                    `<video src="${API_BASE}/storage/${record.mediaPath}" controls preload="metadata" style="max-width:100%;border-radius:10px;max-height:300px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                        <p>您的浏览器不支持视频播放</p>
                                        <div style="display:none;padding:20px;text-align:center;color:#ff6b6b;border:2px dashed #ff6b6b;border-radius:10px;">
                                            <p>视频加载失败</p>
                                            <p style="font-size:0.9em;color:#666;">请检查文件是否存在或网络连接</p>
                                        </div>
                                    </video>`
                                }
                            </div>` : ''}
                            <div style="font-size:0.9em;color:#999;margin-bottom:10px;">
                                创建时间：${escapeHtml(new Date(record.createdAt).toLocaleString())}
                            </div>
                            <div style="display:flex;gap:10px;">
                                <button class="love-button" onclick="toggleRecordDetail('${safeId}')" style="font-size:0.9em;padding:8px 16px;">收起详情</button>
                                <button class="love-button" onclick="deleteRecord('${safeId}')" style="font-size:0.9em;padding:8px 16px;background:#ff6b6b;">删除记录</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            recordsList.innerHTML = '<div style="text-align:center;color:#666;padding:20px;">暂无记录，快去添加第一条吧！</div>';
        }
    } catch (e) {
        recordsList.innerHTML = '<div style="text-align:center;color:#ff6b6b;padding:20px;">加载失败，请检查网络连接</div>';
    }
}

// 删除记录
async function deleteRecord(recordId) {
    try {
        // 检查用户认证状态
        if (!currentUser || !authToken) {
            showNotification('请先登录才能删除记录');
            showLoginModal();
            return;
        }
        
        // 确认删除
        if (!confirm('确定要删除这条记录吗？此操作不可恢复。')) {
            return;
        }
        
        const res = await fetch(`${API_BASE}/api/records/${recordId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await res.json();
        if (data.ok) {
            showNotification('记录已删除');
            // 重新加载记录列表
            loadRecordsList();
        } else {
            showNotification('删除失败: ' + (data.error || '未知错误'));
        }
    } catch (e) {
        showNotification('网络错误');
    }
}

// 调试函数：检查页面元素
function debugPageElements() {
    console.log('=== 页面元素调试 ===');
    console.log('consentSection:', document.getElementById('consentSection'));
    console.log('acceptedSection:', document.getElementById('acceptedSection'));
    console.log('retentionSection:', document.getElementById('retentionSection'));
    console.log('btnAccept:', document.getElementById('btnAccept'));
    console.log('timerDays:', document.getElementById('timerDays'));
    console.log('timerHours:', document.getElementById('timerHours'));
    console.log('timerMinutes:', document.getElementById('timerMinutes'));
    console.log('btnAddRecord:', document.getElementById('btnAddRecord'));
    console.log('btnViewRecords:', document.getElementById('btnViewRecords'));
    console.log('==================');
}

// 检查是否已经同意过
async function checkPreviousAcceptance() {
    try {
        console.log('检查之前的同意状态');
        
        // 首先检查认证状态
        const isAuthenticated = await checkAuthStatus();
        
        if (isAuthenticated && currentUser) {
            // 用户已登录，从服务器获取同意时间
            const serverAcceptanceTime = await getAcceptanceTime();
            
            if (serverAcceptanceTime) {
                // 服务器有同意记录，显示同意后的界面
                const consentSection = document.getElementById('consentSection');
                const acceptedSection = document.getElementById('acceptedSection');
                
                if (consentSection) {
                    consentSection.classList.add('hidden');
                    console.log('隐藏同意区域');
                }
                if (acceptedSection) {
                    acceptedSection.classList.remove('hidden');
                    console.log('显示同意后区域');
                }
                
                // 同步到本地存储
                localStorage.setItem(ACCEPTANCE_KEY, serverAcceptanceTime);
                
                // 启动计时器
                startLoveTimer();
                return;
            }
        }
        
        // 检查本地存储（兼容旧版本）
        const ACCEPTANCE_KEY = 'love_acceptance_time';
        const localAcceptanceTime = localStorage.getItem(ACCEPTANCE_KEY);
        
        if (localAcceptanceTime && isAuthenticated && currentUser) {
            console.log('找到本地同意记录:', localAcceptanceTime);
            
            // 如果用户已登录，同步到服务器
            await setAcceptanceTime(localAcceptanceTime);
            
            // 显示同意后的界面
            const consentSection = document.getElementById('consentSection');
            const acceptedSection = document.getElementById('acceptedSection');
            
            if (consentSection) {
                consentSection.classList.add('hidden');
                console.log('隐藏同意区域');
            }
            if (acceptedSection) {
                acceptedSection.classList.remove('hidden');
                console.log('显示同意后区域');
            }
            
            // 启动计时器
            startLoveTimer();
        } else {
            console.log('没有找到之前的同意记录或用户未登录');
            
            // 如果用户已登录但没有同意记录，显示登录状态
            if (isAuthenticated && currentUser) {
                showUserStatus();
            } else {
                // 用户未登录，显示同意/拒绝界面
                console.log('用户未登录，显示同意/拒绝界面');
            }
        }
    } catch (error) {
        console.error('检查之前同意状态时发生错误:', error);
    }
}

// 切换记录详情显示/隐藏
let currentOpenDetailId = null;

function toggleRecordDetail(recordId) {
    const detailElement = document.getElementById(`detail-${recordId}`);
    if (!detailElement) return;
    
    // 若有其它已展开，先关闭
    if (currentOpenDetailId && currentOpenDetailId !== recordId) {
        const opened = document.getElementById(`detail-${currentOpenDetailId}`);
        if (opened) {
            opened.style.opacity = '0';
            opened.style.transform = 'translateY(-10px)';
            setTimeout(() => { 
                opened.style.display = 'none';
                console.log(`已关闭详情: ${currentOpenDetailId}`);
            }, 300);
        }
    }

    if (detailElement.style.display === 'none' || detailElement.style.display === '') {
        detailElement.style.display = 'block';
        // 添加展开动画效果
        detailElement.style.opacity = '0';
        detailElement.style.transform = 'translateY(-10px)';
        detailElement.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            detailElement.style.opacity = '1';
            detailElement.style.transform = 'translateY(0)';
        }, 10);
        currentOpenDetailId = recordId;
        console.log(`已打开详情: ${recordId}`);
    } else {
        // 添加收起动画效果
        detailElement.style.opacity = '0';
        detailElement.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            detailElement.style.display = 'none';
        }, 300);
        if (currentOpenDetailId === recordId) {
            currentOpenDetailId = null;
            console.log(`已关闭详情: ${recordId}`);
        }
    }
}

// 供内联事件调用
window.toggleRecordDetail = toggleRecordDetail;

// ================== 登录注册模态框 ==================
function createAuthModal() {
    // 创建模态框HTML
    const modalHTML = `
        <div id="authModal" class="auth-modal hidden">
            <div class="auth-modal-content">
                <span class="close-auth-modal" id="closeAuthModal">&times;</span>
                <div class="auth-tabs">
                    <div class="auth-tab active" data-tab="login">登录</div>
                    <div class="auth-tab" data-tab="register">注册</div>
                </div>
                
                <!-- 登录表单 -->
                <div class="auth-form active" id="loginForm">
                    <h3>用户登录</h3>
                    <form id="loginFormElement">
                        <div class="form-group">
                            <label for="loginUsername">用户名</label>
                            <input type="text" id="loginUsername" required>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">密码</label>
                            <input type="password" id="loginPassword" required>
                        </div>
                        <button type="submit" class="btn">登录</button>
                    </form>
                    <div class="auth-message" id="loginMessage"></div>
                </div>
                
                <!-- 注册表单 -->
                <div class="auth-form" id="registerForm">
                    <h3>用户注册</h3>
                    <form id="registerFormElement">
                        <div class="form-group">
                            <label for="registerUsername">用户名</label>
                            <input type="text" id="registerUsername" required>
                        </div>
                        <div class="form-group">
                            <label for="registerPassword">密码</label>
                            <input type="password" id="registerPassword" required>
                        </div>
                        <div class="form-group">
                            <label for="registerEmail">邮箱（可选）</label>
                            <input type="email" id="registerEmail">
                        </div>
                        <button type="submit" class="btn">注册</button>
                    </form>
                    <div class="auth-message" id="registerMessage"></div>
                </div>
            </div>
        </div>
    `;
    
    // 添加样式
    const styleHTML = `
        <style>
            .auth-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .auth-modal.hidden {
                display: none;
            }
            
            .auth-modal-content {
                background: white;
                border-radius: 15px;
                padding: 30px;
                max-width: 400px;
                width: 90%;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            
            .close-auth-modal {
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 24px;
                cursor: pointer;
                color: #999;
            }
            
            .close-auth-modal:hover {
                color: #333;
            }
            
            .auth-tabs {
                display: flex;
                border-bottom: 2px solid #eee;
                margin-bottom: 20px;
            }
            
            .auth-tab {
                padding: 10px 20px;
                cursor: pointer;
                border-bottom: 3px solid transparent;
                transition: all 0.3s;
            }
            
            .auth-tab.active {
                border-bottom-color: #ff6b6b;
                color: #ff6b6b;
                font-weight: 500;
            }
            
            .auth-form {
                display: none;
            }
            
            .auth-form.active {
                display: block;
            }
            
            .auth-form h3 {
                margin-bottom: 20px;
                color: #333;
                text-align: center;
            }
            
            .auth-form .form-group {
                margin-bottom: 15px;
            }
            
            .auth-form label {
                display: block;
                margin-bottom: 5px;
                color: #333;
                font-weight: 500;
            }
            
            .auth-form input {
                width: 100%;
                padding: 12px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 16px;
                transition: border-color 0.3s;
            }
            
            .auth-form input:focus {
                outline: none;
                border-color: #ff6b6b;
            }
            
            .auth-form .btn {
                width: 100%;
                background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                color: white;
                border: none;
                padding: 12px;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                transition: transform 0.2s;
            }
            
            .auth-form .btn:hover {
                transform: translateY(-2px);
            }
            
            .auth-message {
                margin-top: 15px;
                padding: 10px;
                border-radius: 5px;
                display: none;
            }
            
            .auth-message.success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            
            .auth-message.error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
        </style>
    `;
    
    // 添加到页面
    document.head.insertAdjacentHTML('beforeend', styleHTML);
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 绑定事件
    setupAuthModalEvents();
}

function setupAuthModalEvents() {
    const modal = document.getElementById('authModal');
    const closeBtn = document.getElementById('closeAuthModal');
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginFormElement');
    const registerForm = document.getElementById('registerFormElement');
    
    // 关闭模态框
    closeBtn.addEventListener('click', hideLoginModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideLoginModal();
    });
    
    // 标签页切换
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabId = tab.getAttribute('data-tab');
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            document.getElementById(tabId + 'Form').classList.add('active');
        });
    });
    
    // 登录表单提交
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        if (!username || !password) {
            showAuthMessage('loginMessage', '请填写用户名和密码', 'error');
            return;
        }
        
        const result = await loginUser(username, password);
        
        if (result.success) {
            showAuthMessage('loginMessage', '登录成功！', 'success');
            setTimeout(() => {
                hideLoginModal();
                showUserStatus();
                // 重新检查同意状态
                checkPreviousAcceptance();
            }, 1500); // 增加延迟时间，确保用户能看到成功消息
        } else {
            showAuthMessage('loginMessage', result.error || '登录失败', 'error');
        }
    });
    
    // 注册表单提交
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value.trim();
        const password = document.getElementById('registerPassword').value;
        const email = document.getElementById('registerEmail').value.trim();
        
        if (!username || !password) {
            showAuthMessage('registerMessage', '请填写用户名和密码', 'error');
            return;
        }
        
        if (username.length < 3) {
            showAuthMessage('registerMessage', '用户名至少3个字符', 'error');
            return;
        }
        
        if (password.length < 6) {
            showAuthMessage('registerMessage', '密码至少6个字符', 'error');
            return;
        }
        
        const result = await registerUser(username, password, email);
        
        if (result.ok) {
            showAuthMessage('registerMessage', '注册成功！请登录', 'success');
            // 切换到登录标签页
            setTimeout(() => {
                tabs.forEach(t => t.classList.remove('active'));
                document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
                document.querySelectorAll('.auth-form').forEach(form => {
                    form.classList.remove('active');
                });
                document.getElementById('loginForm').classList.add('active');
                
                // 清空注册表单
                registerForm.reset();
            }, 1000);
        } else {
            showAuthMessage('registerMessage', result.error || '注册失败', 'error');
        }
    });
}

function showLoginModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('hidden');
    } else {
        createAuthModal();
        setTimeout(() => {
            document.getElementById('authModal').classList.remove('hidden');
        }, 100);
    }
}

function hideLoginModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.add('hidden');
        // 清除表单内容
        const loginForm = document.getElementById('loginFormElement');
        const registerForm = document.getElementById('registerFormElement');
        if (loginForm) loginForm.reset();
        if (registerForm) registerForm.reset();
        // 清除消息
        const loginMessage = document.getElementById('loginMessage');
        const registerMessage = document.getElementById('registerMessage');
        if (loginMessage) loginMessage.textContent = '';
        if (registerMessage) registerMessage.textContent = '';
    }
}

function showAuthMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = `auth-message ${type}`;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function showUserStatus() {
    if (!currentUser) return;
    
    // 隐藏登录提示
    const loginPrompt = document.getElementById('loginPrompt');
    if (loginPrompt) {
        loginPrompt.style.display = 'none';
    }
    
    // 在页面顶部显示用户状态
    let userStatusDiv = document.getElementById('userStatus');
    if (!userStatusDiv) {
        userStatusDiv = document.createElement('div');
        userStatusDiv.id = 'userStatus';
        userStatusDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(255, 107, 107, 0.9);
            color: white;
            padding: 10px 15px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(userStatusDiv);
    }
    
    userStatusDiv.innerHTML = `
        <span>欢迎，${currentUser.username}</span>
        <button onclick="logout()" style="margin-left: 10px; background: none; border: 1px solid white; color: white; padding: 2px 8px; border-radius: 10px; cursor: pointer;">退出</button>
    `;
}

// 添加CSS动画样式（高级功能的补充样式，避免与上方变量名冲突）
const styleAdvanced = document.createElement('style');
styleAdvanced.textContent = `
    @keyframes ripple {
        0% {
            width: 10px;
            height: 10px;
            opacity: 1;
        }
        100% {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
    
    @keyframes heartFloat {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        50% {
            transform: translate(-50%, -70px) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -100px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes explode {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        50% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0);
            opacity: 0;
        }
    }
    
    .animate-text {
        animation: fadeInUp 1s ease-out forwards;
    }
    
    .animate-card {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(styleAdvanced);