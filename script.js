// Load animations
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
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

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all animation cards
    document.querySelectorAll('.animation-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        observer.observe(card);
    });

    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Function to initialize video with better error handling
    function initVideo(videoId) {
        console.log(`Initializing video for ${videoId}`);
        
        const video = document.getElementById(`${videoId}-video`);
        const loadingSpinner = document.querySelector(`#${videoId} .animation-loading`);
        
        if (!video) {
            console.error(`Video element not found for ${videoId}`);
            return null;
        }

        // Set video properties
        video.muted = true;
        video.loop = true;
        video.playsInline = true;

        video.addEventListener('loadeddata', () => {
            console.log(`${videoId} video loaded`);
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
        });

        video.addEventListener('error', (err) => {
            console.error(`Error loading video for ${videoId}:`, err);
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
        });

        return video;
    }

    // Initialize all videos
    const videos = {
        anim1: initVideo('anim1'),
        anim2: initVideo('anim2'),
        anim3: initVideo('anim3'),
        anim4: initVideo('anim4')
    };

    // Animation rotation logic
    const animationItems = document.querySelectorAll('.animation-item');
    const animationDots = document.querySelectorAll('.animation-dot');
    let currentIndex = 0;
    let isAnimating = false;

    function rotateAnimations(newIndex = null) {
        if (isAnimating) return;
        isAnimating = true;

        if (newIndex === null) {
            newIndex = (currentIndex + 1) % animationItems.length;
        }

        // Pause current video
        const currentVideo = videos[`anim${currentIndex + 1}`];
        if (currentVideo) {
            currentVideo.pause();
            currentVideo.currentTime = 0;
        }

        animationItems[currentIndex].classList.remove('active');
        animationDots[currentIndex].classList.remove('active');

        // Play new video
        const newVideo = videos[`anim${newIndex + 1}`];
        if (newVideo) {
            newVideo.currentTime = 0;
            newVideo.play().catch(error => {
                console.error(`Error playing video for anim${newIndex + 1}:`, error);
            });
        }

        animationItems[newIndex].classList.add('active');
        animationDots[newIndex].classList.add('active');

        currentIndex = newIndex;

        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    // Restore dot click handlers for navigation
    animationDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== currentIndex) {
                rotateAnimations(index);
            }
        });
    });

    // Set up interval for rotation
    const rotationInterval = setInterval(() => {
        rotateAnimations();
    }, 30000);

    // Pause rotation on hover
    const animationContainer = document.querySelector('.animation-container');
    animationContainer.addEventListener('mouseenter', () => {
        clearInterval(rotationInterval);
    });

    // Resume rotation on mouse leave
    animationContainer.addEventListener('mouseleave', () => {
        setInterval(() => {
            rotateAnimations();
        }, 30000);
    });

    // Start playing the first video
    if (videos.anim3) {
        videos.anim3.play().catch(error => {
            console.error('Error playing initial video:', error);
        });
    }

    // Sine wave effect on hover
    const circleItems = document.querySelectorAll('.circle-item');
    const signalPulse = document.querySelector('.signal-pulse');

    circleItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            signalPulse.classList.add('sine-wave');
        });

        item.addEventListener('mouseleave', () => {
            signalPulse.classList.remove('sine-wave');
        });
    });

    // Animated particles for site-wide background
    const canvas = document.getElementById('site-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    let w = canvas.width;
    let h = canvas.height;
    let particles = [];
    const PARTICLE_COUNT = 48;
    function randomColor() {
        const colors = ['#4a90e2', '#50c878', '#ffd700', '#fff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    function createParticle() {
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            r: 1.5 + Math.random() * 2.5,
            dx: -0.2 + Math.random() * 0.4,
            dy: -0.15 + Math.random() * 0.3,
            color: randomColor(),
            alpha: 0.12 + Math.random() * 0.18
        };
    }
    function initParticles() {
        w = canvas.width;
        h = canvas.height;
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle());
        }
    }
    function draw() {
        ctx.clearRect(0, 0, w, h);
        for (let p of particles) {
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
            ctx.fillStyle = p.color;
            ctx.fill();
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
                Object.assign(p, createParticle());
                if (Math.random() > 0.5) p.x = Math.random() * w, p.y = (p.dy > 0 ? 0 : h);
                else p.y = Math.random() * h, p.x = (p.dx > 0 ? 0 : w);
            }
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }
    initParticles();
    draw();
    window.addEventListener('resize', () => {
        setCanvasSize();
        initParticles();
    });

    // Animated particles for hero section only
    const heroCanvas = document.getElementById('hero-particles');
    if (!heroCanvas) return;
    const heroCtx = heroCanvas.getContext('2d');
    function heroSetCanvasSize() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        heroCanvas.width = hero.offsetWidth;
        heroCanvas.height = hero.offsetHeight;
    }
    heroSetCanvasSize();
    window.addEventListener('resize', heroSetCanvasSize);
    let heroW = heroCanvas.width;
    let heroH = heroCanvas.height;
    let heroParticles = [];
    const HERO_PARTICLE_COUNT = 32;
    function heroRandomColor() {
        const colors = ['#4a90e2', '#50c878', '#ffd700', '#fff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    function heroCreateParticle() {
        return {
            x: Math.random() * heroW,
            y: Math.random() * heroH,
            r: 1.5 + Math.random() * 2.5,
            dx: -0.2 + Math.random() * 0.4,
            dy: -0.15 + Math.random() * 0.3,
            color: heroRandomColor(),
            alpha: 0.15 + Math.random() * 0.25
        };
    }
    function heroInitParticles() {
        heroW = heroCanvas.width;
        heroH = heroCanvas.height;
        heroParticles = [];
        for (let i = 0; i < HERO_PARTICLE_COUNT; i++) {
            heroParticles.push(heroCreateParticle());
        }
    }
    function heroDraw() {
        heroCtx.clearRect(0, 0, heroW, heroH);
        for (let p of heroParticles) {
            heroCtx.globalAlpha = p.alpha;
            heroCtx.beginPath();
            heroCtx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
            heroCtx.fillStyle = p.color;
            heroCtx.fill();
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > heroW || p.y < 0 || p.y > heroH) {
                Object.assign(p, heroCreateParticle());
                if (Math.random() > 0.5) p.x = Math.random() * heroW, p.y = (p.dy > 0 ? 0 : heroH);
                else p.y = Math.random() * heroH, p.x = (p.dx > 0 ? 0 : heroW);
            }
        }
        heroCtx.globalAlpha = 1;
        requestAnimationFrame(heroDraw);
    }
    heroInitParticles();
    heroDraw();
    window.addEventListener('resize', () => {
        heroSetCanvasSize();
        heroInitParticles();
    });

    // === LIVELY COLOR PREVIEW START ===
    function livelyRandomColor() {
        const livelyColors = ['#ff4b2b', '#ffb347', '#4a90e2', '#50c878', '#ffd700', '#f7971e', '#fff'];
        return livelyColors[Math.floor(Math.random() * livelyColors.length)];
    }
    // === LIVELY COLOR PREVIEW END ===

    // Moving dots background animation (responsive)
    const bgCanvas = document.getElementById('bg-dots');
    if (!bgCanvas) return;
    const bgCtx = bgCanvas.getContext('2d');
    let bgW = window.innerWidth;
    let bgH = window.innerHeight;
    let dots = [];
    let DOT_COUNT = 36;
    let DOT_MIN = 2.5, DOT_MAX = 5;

    function setBgCanvasSize() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
        bgW = bgCanvas.width;
        bgH = bgCanvas.height;
        if (bgW < 600) {
            DOT_COUNT = 16;
            DOT_MIN = 1.5; DOT_MAX = 3;
        } else if (bgW < 1000) {
            DOT_COUNT = 28;
            DOT_MIN = 2; DOT_MAX = 4;
        } else {
            DOT_COUNT = 44;
            DOT_MIN = 2.5; DOT_MAX = 5;
        }
    }

    function createDot() {
        return {
            x: Math.random() * bgW,
            y: Math.random() * bgH,
            r: DOT_MIN + Math.random() * (DOT_MAX - DOT_MIN),
            dx: -0.12 + Math.random() * 0.24,
            dy: -0.12 + Math.random() * 0.24,
            color: livelyRandomColor(), // lively color
            alpha: 0.18 + Math.random() * 0.18
        };
    }
    function initDots() {
        dots = [];
        for (let i = 0; i < DOT_COUNT; i++) {
            dots.push(createDot());
        }
    }
    function drawDots() {
        bgCtx.clearRect(0, 0, bgW, bgH);
        for (let d of dots) {
            bgCtx.globalAlpha = d.alpha;
            bgCtx.beginPath();
            bgCtx.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
            bgCtx.fillStyle = d.color;
            bgCtx.fill();
            d.x += d.dx;
            d.y += d.dy;
            if (d.x < 0 || d.x > bgW || d.y < 0 || d.y > bgH) {
                Object.assign(d, createDot());
                if (Math.random() > 0.5) d.x = Math.random() * bgW, d.y = (d.dy > 0 ? 0 : bgH);
                else d.y = Math.random() * bgH, d.x = (d.dx > 0 ? 0 : bgW);
            }
        }
        bgCtx.globalAlpha = 1;
        requestAnimationFrame(drawDots);
    }
    setBgCanvasSize();
    initDots();
    drawDots();
    window.addEventListener('resize', () => {
        setBgCanvasSize();
        initDots();
    });
});

function clearLottieSVGs(container) {
    Array.from(container.children).forEach(child => {
        if (child.tagName && child.tagName.toLowerCase() === 'svg') {
            container.removeChild(child);
        }
    });
}

// Scrollspy and scroll progress bar
window.addEventListener('DOMContentLoaded', () => {
    // Scrollspy
    const sections = ['features', 'animations', 'download'];
    const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
    function onScrollSpy() {
        let scrollPos = window.scrollY || window.pageYOffset;
        let found = false;
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i]);
            if (section && scrollPos + 80 >= section.offsetTop) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = navLinks.find(link => link.getAttribute('href') === '#' + sections[i]);
                if (activeLink) activeLink.classList.add('active');
                found = true;
                break;
            }
        }
        if (!found) navLinks.forEach(link => link.classList.remove('active'));
    }
    window.addEventListener('scroll', onScrollSpy);
    onScrollSpy();

    // Scroll progress bar
    const progressBar = document.getElementById('scroll-progress');
    function updateProgressBar() {
        const scrollTop = window.scrollY || window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = percent + '%';
    }
    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar();

    // Dark/Light mode toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    function setTheme(light) {
        if (light) {
            document.body.classList.add('light-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.body.classList.remove('light-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        setTheme(isLight);
    });
    // Set initial theme
    setTheme(document.body.classList.contains('light-mode'));
});

// Speed up the stretch break video
document.addEventListener('DOMContentLoaded', function() {
    const stretchVideo = document.querySelector('video[src*="stretch-break.mp4"]');
    if (stretchVideo) {
        stretchVideo.playbackRate = 10; // Increase playback speed by 1.5x
    }
}); 