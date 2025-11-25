// 静谧山居 - 主要JavaScript功能文件
// 包含动画效果、交互功能和工具函数

class JingjiShanju {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupScrollEffects();
        this.initializeParticles();
    }

    // 设置事件监听器
    setupEventListeners() {
        // 页面加载完成后的初始化
        document.addEventListener('DOMContentLoaded', () => {
            this.initializePage();
        });

        // 窗口大小改变时的响应
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // 滚动事件
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // 触摸事件（移动端优化）
        document.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e);
        });

        document.addEventListener('touchmove', (e) => {
            this.handleTouchMove(e);
        });
    }

    // 初始化页面
    initializePage() {
        // 设置当前页面的导航状态
        this.updateNavigationState();
        
        // 初始化懒加载
        this.initializeLazyLoading();
        
        // 初始化表单验证
        this.initializeFormValidation();
        
        // 初始化图片画廊
        this.initializeGallery();
    }

    // 更新导航状态
    updateNavigationState() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                item.classList.add('active');
            }
        });
    }

    // 初始化动画效果
    initializeAnimations() {
        // 页面加载动画
        anime({
            targets: 'body',
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutExpo'
        });

        // 滚动触发动画
        this.setupScrollAnimations();
    }

    // 设置滚动动画
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // 观察需要动画的元素
        const animateElements = document.querySelectorAll('.feature-card, .gallery-card, .room-detail, .booking-card');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }

    // 动画元素
    animateElement(element) {
        anime({
            targets: element,
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutExpo',
            delay: Math.random() * 200
        });
    }

    // 初始化粒子效果
    initializeParticles() {
        if (document.getElementById('particles')) {
            this.createParticleSystem();
        }
    }

    // 创建粒子系统
    createParticleSystem() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const particles = [];
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        
        document.getElementById('particles').appendChild(canvas);

        // 粒子类
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = this.getRandomColor();
            }

            getRandomColor() {
                const colors = [
                    'rgba(74, 155, 142, ',
                    'rgba(107, 182, 168, ',
                    'rgba(139, 209, 194, ',
                    'rgba(171, 236, 220, '
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // 边界检测
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // 保持粒子在画布内
                this.x = Math.max(0, Math.min(canvas.width, this.x));
                this.y = Math.max(0, Math.min(canvas.height, this.y));
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.opacity + ')';
                ctx.fill();
            }
        }

        // 创建粒子
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        // 动画循环
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // 连接近距离粒子
            this.connectParticles(particles, ctx);

            requestAnimationFrame(animate);
        };

        animate();

        // 窗口大小改变时重新调整画布
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // 连接近距离粒子
    connectParticles(particles, ctx) {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(74, 155, 142, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // 初始化懒加载
    initializeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // 降级处理
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    // 初始化表单验证
    initializeFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    // 验证表单
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // 验证单个字段
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let errorMessage = '';

        // 必填验证
        if (field.hasAttribute('required') && !value) {
            errorMessage = '此字段为必填项';
            isValid = false;
        }

        // 类型验证
        if (value && type === 'email' && !this.isValidEmail(value)) {
            errorMessage = '请输入有效的邮箱地址';
            isValid = false;
        }

        if (value && type === 'tel' && !this.isValidPhone(value)) {
            errorMessage = '请输入有效的手机号码';
            isValid = false;
        }

        // 显示错误信息
        this.showFieldError(field, errorMessage);

        return isValid;
    }

    // 验证邮箱格式
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // 验证手机号格式
    isValidPhone(phone) {
        return /^1[3-9]\d{9}$/.test(phone);
    }

    // 显示字段错误
    showFieldError(field, message) {
        const errorElement = field.parentNode.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.textContent = message;
        } else if (message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }

        // 添加/移除错误样式
        if (message) {
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    }

    // 初始化图片画廊
    initializeGallery() {
        const galleries = document.querySelectorAll('.splide');
        
        galleries.forEach(gallery => {
            new Splide(gallery, {
                type: 'loop',
                perPage: 3,
                perMove: 1,
                gap: '1rem',
                autoplay: true,
                interval: 4000,
                pauseOnHover: true,
                breakpoints: {
                    768: {
                        perPage: 1,
                    },
                    1024: {
                        perPage: 2,
                    }
                }
            }).mount();
        });
    }

    // 处理窗口大小改变
    handleResize() {
        // 重新初始化粒子系统
        if (this.particleCanvas) {
            this.particleCanvas.width = window.innerWidth;
            this.particleCanvas.height = window.innerHeight;
        }

        // 重新计算布局
        this.recalculateLayout();
    }

    // 重新计算布局
    recalculateLayout() {
        // 移动端导航优化
        const nav = document.querySelector('.nav-bottom');
        if (nav && window.innerWidth < 768) {
            nav.style.paddingBottom = 'env(safe-area-inset-bottom)';
        }
    }

    // 处理滚动事件
    handleScroll() {
        const scrollY = window.scrollY;
        
        // 导航栏背景透明度
        const header = document.querySelector('header');
        if (header) {
            const opacity = Math.min(scrollY / 100, 1);
            header.style.backgroundColor = `rgba(255, 255, 255, ${0.95 * opacity})`;
        }

        // 滚动到顶部按钮
        const scrollTopBtn = document.getElementById('scrollTop');
        if (scrollTopBtn) {
            if (scrollY > 300) {
                scrollTopBtn.style.display = 'block';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        }
    }

    // 处理触摸开始
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }

    // 处理触摸移动
    handleTouchMove(e) {
        if (!this.touchStartX || !this.touchStartY) return;

        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;

        const diffX = this.touchStartX - touchEndX;
        const diffY = this.touchStartY - touchEndY;

        // 检测滑动方向
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 50) {
                // 向左滑动
                this.handleSwipeLeft();
            } else if (diffX < -50) {
                // 向右滑动
                this.handleSwipeRight();
            }
        }

        this.touchStartX = null;
        this.touchStartY = null;
    }

    // 处理左滑
    handleSwipeLeft() {
        // 可以在这里添加左滑逻辑，比如切换图片
        console.log('Swipe left detected');
    }

    // 处理右滑
    handleSwipeRight() {
        // 可以在这里添加右滑逻辑
        console.log('Swipe right detected');
    }

    // 设置滚动效果
    setupScrollEffects() {
        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // 工具函数：防抖
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 工具函数：节流
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 工具函数：格式化日期
    formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    }

    // 工具函数：计算日期差
    dateDiff(date1, date2) {
        const timeDiff = Math.abs(new Date(date2).getTime() - new Date(date1).getTime());
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    // 工具函数：生成随机ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    // 工具函数：本地存储
    setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('LocalStorage not available:', e);
        }
    }

    getStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('LocalStorage not available:', e);
            return defaultValue;
        }
    }

    // 显示通知
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });

        // 根据类型设置背景色
        const colors = {
            info: '#4A9B8E',
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    }

    // 加载状态
    showLoading(element) {
        const loader = document.createElement('div');
        loader.className = 'loading-spinner';
        loader.innerHTML = `
            <div class="spinner"></div>
            <span>加载中...</span>
        `;
        
        element.appendChild(loader);
        return loader;
    }

    hideLoading(loader) {
        if (loader && loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
    }
}

// 初始化应用
const app = new JingjiShanju();

// 导出全局函数供HTML使用
window.JingjiShanju = JingjiShanju;
window.app = app;