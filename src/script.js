// 表白网站交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 创建更多飘动的心形
    createFloatingHearts();
    
    // 添加点击效果
    addClickEffects();
    
    // 添加键盘交互
    addKeyboardInteractions();
});

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
    // 这里可以添加音效，如果需要的话
    // 由于浏览器限制，需要用户交互后才能播放音频
    console.log('💕 爱的声音 💕');
}

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
document.addEventListener('DOMContentLoaded', function() {
    // 显示加载动画
    showLoadingAnimation();
    
    // 初始化所有功能
    setTimeout(() => {
        hideLoadingAnimation();
        initializeFeatures();
    }, 2000);
});

function showLoadingAnimation() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.remove('hidden');
    }
}

function hideLoadingAnimation() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hidden');
    }
}

function initializeFeatures() {
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

function showPhotoGallery() {
    // 创建照片画廊模态框
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>📸 美好回忆</h3>
            <div class="photo-grid">
                <div class="photo-placeholder">💕</div>
                <div class="photo-placeholder">💖</div>
                <div class="photo-placeholder">💗</div>
                <div class="photo-placeholder">💝</div>
            </div>
            <p>这里可以展示你们的珍贵回忆</p>
        </div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .photo-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        .modal-content {
            background: white;
            padding: 30px;
            border-radius: 20px;
            max-width: 500px;
            text-align: center;
            position: relative;
        }
        .close-modal {
            position: absolute;
            top: 10px;
            right: 20px;
            font-size: 30px;
            cursor: pointer;
            color: #ff6b6b;
        }
        .photo-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 20px 0;
        }
        .photo-placeholder {
            width: 100px;
            height: 100px;
            background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2em;
            margin: 0 auto;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // 关闭模态框
    modal.querySelector('.close-modal').onclick = () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        }
    };
}

function showCountdown() {
    // 创建倒计时模态框
    const modal = document.createElement('div');
    modal.className = 'countdown-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>⏰ 重要时刻倒计时</h3>
            <div class="countdown-display">
                <div class="time-unit">
                    <span class="time-number" id="days">00</span>
                    <span class="time-label">天</span>
                </div>
                <div class="time-unit">
                    <span class="time-number" id="hours">00</span>
                    <span class="time-label">时</span>
                </div>
                <div class="time-unit">
                    <span class="time-number" id="minutes">00</span>
                    <span class="time-label">分</span>
                </div>
                <div class="time-unit">
                    <span class="time-number" id="seconds">00</span>
                    <span class="time-label">秒</span>
                </div>
            </div>
            <p>距离下一个重要时刻</p>
        </div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .countdown-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        .countdown-display {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 30px 0;
        }
        .time-unit {
            text-align: center;
        }
        .time-number {
            display: block;
            font-size: 2em;
            font-weight: bold;
            color: #ff6b6b;
        }
        .time-label {
            font-size: 0.9em;
            color: #666;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // 设置目标时间（示例：1年后）
    const targetDate = new Date();
    targetDate.setFullYear(targetDate.getFullYear() + 1);
    
    // 更新倒计时
    function updateCountdown() {
        const now = new Date();
        const timeLeft = targetDate - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        }
    }
    
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // 关闭模态框
    modal.querySelector('.close-modal').onclick = () => {
        clearInterval(countdownInterval);
        document.body.removeChild(modal);
        document.head.removeChild(style);
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            clearInterval(countdownInterval);
            document.body.removeChild(modal);
            document.head.removeChild(style);
        }
    };
}

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

// 在初始化时调用高级功能
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeAdvancedFeatures();
    }, 3000);
});

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
document.head.appendChild(style);