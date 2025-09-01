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