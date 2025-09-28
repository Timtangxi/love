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
    
    // 检查是否已经同意过
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

// ================== 同意/拒绝 + 记录上传 ==================
const API_BASE = window.location.origin;

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
    
    btnAccept && btnAccept.addEventListener('click', () => {
        try {
            console.log('同意按钮被点击');
            
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
            
            // 记录同意时间
            const acceptanceTime = new Date().toISOString();
            localStorage.setItem(ACCEPTANCE_KEY, acceptanceTime);
            console.log('已保存同意时间:', acceptanceTime);
            
            // 启动计时器
            startLoveTimer();
            
            showNotification('谢谢你愿意，我们一起记录吧 💕');
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
            const res = await fetch(`${API_BASE}/api/records/text`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
        const type = document.getElementById('recType').value;
        
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
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
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
        form.append('type', type);
        
        try {
            const res = await fetch(`${API_BASE}/api/records/media`, {
                method: 'POST',
                body: form
            });
            const data = await res.json();
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
        const res = await fetch(`${API_BASE}/api/records`);
        const data = await res.json();
        
        if (data.records && data.records.length > 0) {
            recordsList.innerHTML = data.records.map(record => {
                const safeTitle = escapeHtml(record.title || '无标题');
                const safeDate = escapeHtml(record.date);
                const safeText = record.text ? escapeHtml(record.text.substring(0, 50)) + (record.text.length > 50 ? '...' : '') : '';
                const safeId = escapeHtml(record.id);
                const safeCreatedAt = escapeHtml(new Date(record.createdAt).toLocaleDateString());
                
                return `
                    <div class="record-item" style="border:1px solid #eee;border-radius:10px;padding:15px;margin-bottom:10px;cursor:pointer;" onclick="showRecordDetail('${safeId}')">
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
                `;
            }).join('');
        } else {
            recordsList.innerHTML = '<div style="text-align:center;color:#666;padding:20px;">暂无记录，快去添加第一条吧！</div>';
        }
    } catch (e) {
        recordsList.innerHTML = '<div style="text-align:center;color:#ff6b6b;padding:20px;">加载失败，请检查网络连接</div>';
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
function checkPreviousAcceptance() {
    try {
        const ACCEPTANCE_KEY = 'love_acceptance_time';
        const acceptanceTime = localStorage.getItem(ACCEPTANCE_KEY);
        
        console.log('检查之前的同意状态:', acceptanceTime);
        
        if (acceptanceTime) {
            // 已经同意过，直接显示同意后的界面
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
            console.log('没有找到之前的同意记录');
        }
    } catch (error) {
        console.error('检查之前同意状态时发生错误:', error);
    }
}

// 显示记录详情
async function showRecordDetail(recordId) {
    const modal = document.getElementById('recordDetailModal');
    const content = document.getElementById('recordDetailContent');
    if (!modal || !content) return;
    
    try {
        const res = await fetch(`${API_BASE}/api/records`);
        const data = await res.json();
        const record = data.records.find(r => r.id === recordId);
        
        if (!record) {
            showNotification('记录不存在');
            return;
        }
        
        let mediaHtml = '';
        if (record.mediaPath) {
            const mediaUrl = `${API_BASE}/storage/${record.mediaPath}`;
            if (record.type === 'image') {
                mediaHtml = `<img src="${mediaUrl}" style="max-width:100%;border-radius:10px;margin-top:10px;" alt="图片">`;
            } else if (record.type === 'video') {
                mediaHtml = `<video src="${mediaUrl}" controls preload="metadata" style="max-width:100%;border-radius:10px;margin-top:10px;max-height:400px;">
                    <p>您的浏览器不支持视频播放</p>
                </video>`;
            }
        }
        
        content.innerHTML = `
            <h3 style="color:#333;margin-bottom:15px;">${escapeHtml(record.title || '无标题')}</h3>
            <div style="color:#666;margin-bottom:10px;">
                <strong>日期：</strong>${escapeHtml(record.date)}
            </div>
            ${record.text ? `<div style="margin-bottom:15px;line-height:1.6;">${escapeHtml(record.text)}</div>` : ''}
            ${mediaHtml}
            <div style="margin-top:15px;font-size:0.9em;color:#999;">
                创建时间：${escapeHtml(new Date(record.createdAt).toLocaleString())}
            </div>
        `;
        
        modal.classList.remove('hidden');
        
        // 关闭按钮事件
        document.getElementById('closeDetailModal').onclick = () => {
            modal.classList.add('hidden');
        };
        
        // 点击背景关闭
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        };
        
    } catch (e) {
        showNotification('加载详情失败');
    }
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