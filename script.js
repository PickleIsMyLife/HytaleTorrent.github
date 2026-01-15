// Throttle функция для оптимизации
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Свечение сзади курсора
const cursor = document.getElementById('cursor');
let cursorX = 0;
let cursorY = 0;
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - 25;
    mouseY = e.clientY - 25;
});

function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.15; // Плавное следование
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(updateCursor);
}

updateCursor();

// Параллакс эффект для hero
const heroBg = document.querySelector('.hero-bg');

window.addEventListener('scroll', throttle(() => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    heroBg.style.transform = `translate(-50%, -50%) translateY(${rate}px)`;
}, 16));

// Плавное появление элементов при прокрутке
const sections = document.querySelectorAll('.section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, {
    threshold: 0.1
});

sections.forEach(section => {
    observer.observe(section);
});

// Плавная прокрутка для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Ripple эффект для кнопок
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

const buttons = document.querySelectorAll('.cta-button');
buttons.forEach(button => {
    button.addEventListener('click', createRipple);
});

// Модальное окно
const modal = document.getElementById('modal');
const downloadBtn = document.getElementById('download-btn');
const closeBtn = document.querySelector('.close');

downloadBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Переключение темы
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    themeToggle.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
});

// Загрузка темы
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.textContent = '☀️';
    }
});

// Typewriter effect for hero text
const heroText = document.querySelector('.hero-text');
let typewriterInterval;
let isHovering = false;

function typeWriter(text, element, speed = 50, callback) {
    let i = 0;
    element.textContent = '';
    clearInterval(typewriterInterval);
    typewriterInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typewriterInterval);
            if (callback) callback();
        }
    }, speed);
}

function eraseText(element, speed = 50, callback) {
    let text = element.textContent;
    clearInterval(typewriterInterval);
    typewriterInterval = setInterval(() => {
        if (text.length > 0) {
            text = text.slice(0, -1);
            element.textContent = text;
        } else {
            clearInterval(typewriterInterval);
            if (callback) callback();
        }
    }, speed);
}

function startCycle() {
    const originalText = heroText.getAttribute('data-original');
    const hoverText = heroText.getAttribute('data-hover');
    eraseText(heroText, 30, () => {
        typeWriter(hoverText, heroText, 30, () => {
            setTimeout(() => {
                eraseText(heroText, 30, () => {
                    typeWriter(originalText, heroText, 30, () => {
                        setTimeout(startCycle, 2000);
                    });
                });
            }, 1000); // Пауза
        });
    });
}

// Particles эффект
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 100;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

initParticles();
animateParticles();

// Анимация загрузки страницы
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    // Typewriter для начального текста
    const originalText = heroText.getAttribute('data-original');
    typeWriter(originalText, heroText, 50, () => {
        // После печати начать цикл
        setTimeout(() => {
            startCycle();
        }, 2000);
    });
});