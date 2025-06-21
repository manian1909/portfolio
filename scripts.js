// Global Variables
let isScrolling = false;
let currentTextIndex = 0;




let animationSpeed = 1;
let colorScheme = 'neon';
let activeAnimations = 0;
let totalParticles = 0;
let animationFrameId;
let fpsCounter = 0;
let lastTime = 0;





const typingTexts = [
    "console.log('Hello World!');",
    "const developer = new FullStack();",
    "git commit -m 'Building the future'",
    "npm run build --production",
    "docker compose up -d",
    "sudo make me a sandwich 😄"
];
const THEME_KEY = 'portfolio-theme';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupScrollAnimations();
    setupNavigation();
    startTypingAnimation();
    createCodeRain();
    setupThemeToggle();
});

// Initialize all animations
function initializeAnimations() {
    // Add initial animation classes
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.2}s`;
    });
}

// Setup scroll-based animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Add staggered animation for cards
                const cards = entry.target.querySelectorAll('.project-card, .achievement-card, .timeline-item');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Setup scroll event for navbar
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const navbar = document.getElementById('navbar');
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                // Only add/remove scrolled class, don't hide navbar
                if (scrollTop > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                isScrolling = false;
            });
        }
        isScrolling = true;
    });
}

// Setup navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');

    // Update active nav link based on scroll position
    function updateActiveLink() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const scrollPosition = window.pageYOffset;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Smooth scroll to section
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Adjust for navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', throttle(updateActiveLink, 100));
}

// Typing animation for terminal
function startTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    function typeText(text, callback) {
        let index = 0;
        typingElement.textContent = '';

        function type() {
            if (index < text.length) {
                typingElement.textContent += text.charAt(index);
                index++;
                setTimeout(type, 100 + Math.random() * 100);
            } else {
                setTimeout(callback, 2000);
            }
        }
        type();
    }

    function eraseText(callback) {
        const currentText = typingElement.textContent;
        let index = currentText.length;

        function erase() {
            if (index > 0) {
                typingElement.textContent = currentText.substring(0, index - 1);
                index--;
                setTimeout(erase, 50);
            } else {
                setTimeout(callback, 500);
            }
        }
        erase();
    }

    function startTypingCycle() {
        const currentText = typingTexts[currentTextIndex];
        typeText(currentText, () => {
            eraseText(() => {
                currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
                startTypingCycle();
            });
        });
    }

    startTypingCycle();
}

// Create animated code rain background
function createCodeRain() {
    const bgAnimation = document.getElementById('bgAnimation');
    if (!bgAnimation) return;

    const codeCharacters = [
        '0', '1', '{', '}', '<', '>', '/', '\\', '(', ')', '[', ']',
        'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while',
        'class', 'import', 'export', 'return', '&&', '||', '=>', '===',
        'HTML', 'CSS', 'JS', 'React', 'Node', 'API', 'JSON', 'SQL'
    ];

    function createCodeElement() {
        const codeElement = document.createElement('div');
        codeElement.className = 'code-rain';
        codeElement.textContent = codeCharacters[Math.floor(Math.random() * codeCharacters.length)];

        // Random position and animation properties
        codeElement.style.left = Math.random() * 100 + 'vw';
        codeElement.style.animationDuration = (Math.random() * 3 + 2) + 's';
        codeElement.style.animationDelay = Math.random() * 2 + 's';
        codeElement.style.fontSize = (Math.random() * 10 + 10) + 'px';
        codeElement.style.opacity = Math.random() * 0.5 + 0.1;

        bgAnimation.appendChild(codeElement);

        // Remove element after animation
        setTimeout(() => {
            if (codeElement.parentNode) {
                codeElement.parentNode.removeChild(codeElement);
            }
        }, 5000);
    }

    // Create code rain elements periodically
    setInterval(createCodeElement, 300);
}

// Card hover effects
function setupCardAnimations() {
    const cards = document.querySelectorAll('.project-card, .achievement-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Smooth scroll for buttons
function setupButtonActions() {
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            // Handle specific button actions
            if (this.textContent.includes('Download CV')) {
                // Simulate CV download
                console.log('CV download initiated');
                // You can replace this with actual download functionality
            } else if (this.textContent.includes('Contact Me')) {
                // Scroll to contact section or open contact modal
                console.log('Contact action triggered');
                // You can add contact functionality here
            }
        });
    });
}

// Parallax effect for hero section
function setupParallax() {
    const heroSection = document.getElementById('profile');
    const terminal = document.querySelector('.terminal');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        const scrollPercent = scrolled / heroHeight;

        if (scrollPercent <= 1) {
            if (terminal) {
                terminal.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        }
    });
}

// Initialize card animations after DOM load
document.addEventListener('DOMContentLoaded', function() {
    setupCardAnimations();
    setupButtonActions();
    setupParallax();
});

// Intersection Observer for counter animations
function setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetCount = parseInt(counter.dataset.count);
                let currentCount = 0;
                const increment = targetCount / 50;

                const updateCounter = () => {
                    if (currentCount < targetCount) {
                        currentCount += increment;
                        counter.textContent = Math.floor(currentCount);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = targetCount;
                    }
                };

                updateCounter();
                observer.unobserve(counter);
            }
        });
    });

    counters.forEach(counter => observer.observe(counter));
}

// Add loading animation
function showLoadingAnimation() {
    const body = document.body;
    body.style.overflow = 'hidden';

    const loader = document.createElement('div');
    loader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            flex-direction: column;
        ">
            <div style="
                width: 50px;
                height: 50px;
                border: 3px solid #333;
                border-top: 3px solid #00ff41;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            "></div>
            <p style="color: #00ff41; font-family: 'Courier New', monospace;">Loading Portfolio...</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;

    body.appendChild(loader);

    // Remove loader after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.remove();
            body.style.overflow = 'auto';
        }, 1000);
    });
}

// Initialize loading animation
showLoadingAnimation();

// Error handling for animations
window.addEventListener('error', (e) => {
    console.warn('Animation error caught:', e.error);
    // Fallback: ensure page is still functional
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    });
});

// Performance optimization: Throttle scroll events
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
    };
}

// Apply throttling to scroll-heavy functions
const throttledScroll = throttle(() => {
    // Your scroll-heavy code here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScroll);

// Export functions for potential external use
window.PortfolioAnimations = {
    startTypingAnimation,
    createCodeRain,
    setupCardAnimations,
    setupParallax
};

// Add this to ensure navbar stays visible
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    navbar.style.transform = 'translateY(0)'; // Always keep navbar visible
});

// Theme toggle setup
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem(THEME_KEY);
    const root = document.documentElement;

    // Set initial theme without transition
    if (storedTheme) {
        root.setAttribute('data-theme', storedTheme);
        updateTerminalColors(storedTheme);
    }

    // Add transition after initial load
    setTimeout(() => {
        root.style.setProperty('--transition-duration', '0.5s');
    }, 100);

    themeToggle.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        // Add transform animation to theme toggle
        themeToggle.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0)';
        }, 500);

        root.setAttribute('data-theme', newTheme);
        updateTerminalColors(newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
    });
}

function updateTerminalColors(theme) {
    const terminal = document.querySelector('.terminal-content');
    const typingText = document.getElementById('typing-text');

    if (terminal && typingText) {
        const color = theme === 'light' ? '#A1B2D4' : '#00ff41';
        terminal.style.color = color;
        typingText.style.borderColor = color;
    }
}


const colorSchemes = {
    neon: ['#00ff41', '#0066cc', '#ff6b6b', '#ffff00'],
    fire: ['#ff4444', '#ff8800', '#ffff00', '#ff0066'],
    ocean: ['#0066cc', '#00ccff', '#0099ff', '#66ccff'],
    cosmic: ['#8a2be2', '#ff1493', '#00ced1', '#ff69b4']
};

// Animation Storage
const animations = {};

// Utility Functions
function getRandomColor(scheme = colorScheme) {
    const colors = colorSchemes[scheme];
    return colors[Math.floor(Math.random() * colors.length)];
}

function updateStats() {
    const activeCounter = document.getElementById('active-counter');
    const particleCounter = document.getElementById('particle-counter');

    if (activeCounter) {
        activeCounter.textContent = activeAnimations;
    }
    if (particleCounter) {
        particleCounter.textContent = totalParticles;
    }
}

function calculateFPS() {
    const fpsElement = document.getElementById('fps-counter');
    if (!fpsElement) return;

    const now = performance.now();
    const delta = now - lastTime;
    lastTime = now;
    const fps = Math.round(1000 / delta);
    fpsElement.textContent = fps;
}

// Enhanced Sand Formation Animation with Multiple Logos
class SandFormation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.isActive = false;
        this.colors = colorSchemes[colorScheme];
        this.phase = 'forming'; // forming, sphere, pause, exploding, freezing, traveling, symbol, symbolPause, scattering
        this.phaseTimer = 0;
        this.currentSymbol = 0;
        this.symbols = ['python', 'html', 'git', 'node'];
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
        this.numParticles = 5000;
        this.particleSize = 2;

        // Logo properties
        this.logoImages = {};
        this.logoTargets = {};
        this.logoImageLoaded = {};
        this.particleSpacing = 2;
        this.logoWidth = 300;
        this.logoHeight = 300;

        // Phase durations (in frames at 60fps)
        this.phaseDurations = {
            forming: 180, // 3 seconds
            sphere: 60, // 1 second  
            pause: 90, // 1.5 seconds pause
            exploding: 120, // 2 seconds
            freezing: 60, // 1 second freeze after explosion
            traveling: 300, // 5 seconds to form symbol (longer for physics)
            symbol: 90, // 3 seconds hold symbol
            symbolPause: 90, // 2 seconds pause
            scattering: 120 // 2 seconds scattering before next symbol
        };

        // Logo color schemes
        this.logoColors = {
            python: {
                primary: '#306998',
                secondary: '#FFD43B',
                fallback: ['#306998', '#FFD43B']
            },
            html: {
                primary: '#E34C26',
                secondary: '#F06529',
                fallback: ['#E34C26', '#F06529', '#FFFFFF']
            },
            git: {
                primary: '#F05032',
                secondary: '#FFFFFF',
                fallback: ['#F05032', '#FFFFFF', '#000000']
            },
            node: {
                primary: '#339933',
                secondary: '#68A063',
                fallback: ['#339933', '#68A063', '#F7F7F7']
            }
        };

        this.loadAllLogos();
    }

    loadAllLogos() {
        const logoFiles = {
            python: './images/python.png',
            html: './images/html.png',
            git: './images/git.png',
            node: './images/node.png'
        };

        Object.keys(logoFiles).forEach(logoName => {
            this.logoImages[logoName] = new Image();
            this.logoTargets[logoName] = [];
            this.logoImageLoaded[logoName] = false;

            this.logoImages[logoName].onload = () => {
                this.extractLogoPixels(logoName);
                console.log(`${logoName} logo loaded successfully!`);
            };

            this.logoImages[logoName].onerror = () => {
                console.error(`Failed to load ${logoName} logo image. Using fallback.`);
                this.logoImageLoaded[logoName] = false;
                this.createFallbackTargets(logoName);
            };

            this.logoImages[logoName].src = logoFiles[logoName];
        });
    }

    extractLogoPixels(logoName) {
        // Create offscreen canvas for image analysis
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.logoWidth;
        tempCanvas.height = this.logoHeight;

        tempCtx.drawImage(this.logoImages[logoName], 0, 0, this.logoWidth, this.logoHeight);
        const imageData = tempCtx.getImageData(0, 0, this.logoWidth, this.logoHeight).data;

        this.logoTargets[logoName] = [];

        // Extract pixels with higher density for Node.js
        const spacing = logoName === 'node' ? 1.5 : this.particleSpacing;

        // Loop through image pixels and extract alpha > threshold
        for (let y = 0; y < this.logoHeight; y += spacing) {
            for (let x = 0; x < this.logoWidth; x += spacing) {
                const i = (y * this.logoWidth + x) * 4;
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
                const alpha = imageData[i + 3];

                // Lower threshold for Node.js to capture more detail
                const alphaThreshold = logoName === 'node' ? 64 : 128;

                if (alpha > alphaThreshold) {
                    const targetX = x + (this.canvas.width - this.logoWidth) / 2;
                    const targetY = y + (this.canvas.height - this.logoHeight) / 2;

                    let color = this.determineLogoColor(logoName, r, g, b);

                    this.logoTargets[logoName].push({
                        x: targetX,
                        y: targetY,
                        color: color
                    });
                }
            }
        }

        this.logoImageLoaded[logoName] = true;
        console.log(`Extracted ${this.logoTargets[logoName].length} ${logoName} logo target positions`);
    }

    determineLogoColor(logoName, r, g, b) {
        const colors = this.logoColors[logoName];

        switch (logoName) {
            case 'python':
                if (b > r && b > g && b > 100) {
                    return colors.primary; // Python blue
                } else if (r > 200 && g > 200 && b < 150) {
                    return colors.secondary; // Python yellow
                } else {
                    const brightness = (r + g + b) / 3;
                    return brightness < 128 ? colors.primary : colors.secondary;
                }

            case 'html':
                if (r > 200 && g < 100 && b < 100) {
                    return colors.primary; // HTML red
                } else if (r > 200 && g > 100 && b < 100) {
                    return colors.secondary; // HTML orange
                } else {
                    return '#FFFFFF'; // White for highlights
                }

            case 'git':
                if (r > 200 && g < 100 && b < 100) {
                    return colors.primary; // Git orange/red
                } else {
                    const brightness = (r + g + b) / 3;
                    return brightness > 200 ? colors.secondary : '#000000';
                }

            case 'node':
                // More precise Node.js green detection
                const isGreen = g > r && g > b;
                const isDarkGreen = isGreen && g > 80 && g < 180 && r < 100 && b < 100;
                const isLightGreen = isGreen && g > 150 && r > 50 && b > 50;
                const brightness = (r + g + b) / 3;

                if (isDarkGreen) {
                    return colors.primary; // Dark Node green
                } else if (isLightGreen || (isGreen && brightness > 100)) {
                    return colors.secondary; // Light Node green
                } else if (brightness > 200) {
                    return '#FFFFFF'; // White highlights
                } else {
                    return colors.primary; // Default to main green
                }

            default:
                return colors.primary;
        }
    }

    createFallbackTargets(logoName) {
        this.logoTargets[logoName] = [];
        const scale = 1.2;
        const centerX = this.centerX;
        const centerY = this.centerY;
        const colors = this.logoColors[logoName];

        switch (logoName) {
            case 'python':
                // Create blue snake targets
                for (let t = 0; t <= 1; t += 0.01) {
                    let x, y;
                    if (t <= 0.5) {
                        x = centerX - 60 + t * 80;
                        y = centerY - 40 + Math.sin(t * Math.PI * 2) * 10;
                    } else {
                        x = centerX + 20 - (t - 0.5) * 80;
                        y = centerY - 20 + Math.sin((t - 0.5) * Math.PI * 2) * 10;
                    }
                    this.logoTargets[logoName].push({
                        x: x * scale,
                        y: y * scale,
                        color: colors.primary
                    });
                }
                // Create yellow snake targets
                for (let t = 0; t <= 1; t += 0.01) {
                    let x, y;
                    if (t <= 0.5) {
                        x = centerX + 60 - t * 80;
                        y = centerY + 40 - Math.sin(t * Math.PI * 2) * 10;
                    } else {
                        x = centerX - 20 + (t - 0.5) * 80;
                        y = centerY + 20 - Math.sin((t - 0.5) * Math.PI * 2) * 10;
                    }
                    this.logoTargets[logoName].push({
                        x: x * scale,
                        y: y * scale,
                        color: colors.secondary
                    });
                }
                break;

            case 'html':
                // Create HTML5 shield shape
                const shieldPoints = [
                    [0, 0],
                    [20, 0],
                    [18, 18],
                    [10, 20],
                    [0, 18]
                ];
                for (let i = 0; i < shieldPoints.length - 1; i++) {
                    const [x1, y1] = shieldPoints[i];
                    const [x2, y2] = shieldPoints[i + 1];
                    for (let t = 0; t <= 1; t += 0.05) {
                        const x = centerX + (x1 + (x2 - x1) * t - 10) * scale * 4;
                        const y = centerY + (y1 + (y2 - y1) * t - 10) * scale * 4;
                        this.logoTargets[logoName].push({
                            x: x,
                            y: y,
                            color: i % 2 === 0 ? colors.primary : colors.secondary
                        });
                    }
                }
                break;

            case 'git':
                // Create Git branching pattern
                for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
                    const radius = 50 + Math.sin(angle * 3) * 20;
                    const x = centerX + Math.cos(angle) * radius * scale;
                    const y = centerY + Math.sin(angle) * radius * scale;
                    this.logoTargets[logoName].push({
                        x: x,
                        y: y,
                        color: angle % (Math.PI / 2) < Math.PI / 4 ? colors.primary : colors.secondary
                    });
                }
                break;

            case 'node':
                // Create detailed Node.js logo pattern
                const nodeRadius = 70;
                const centerPoints = [];

                // Main hexagonal structure
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3;
                    const x = centerX + Math.cos(angle) * nodeRadius * scale;
                    const y = centerY + Math.sin(angle) * nodeRadius * scale;
                    centerPoints.push([x, y]);
                }

                // Create the Node.js logo structure with better definition
                // Central hub
                for (let angle = 0; angle < Math.PI * 2; angle += 0.2) {
                    const radius = 15;
                    const x = centerX + Math.cos(angle) * radius * scale;
                    const y = centerY + Math.sin(angle) * radius * scale;
                    this.logoTargets[logoName].push({
                        x: x,
                        y: y,
                        color: colors.primary
                    });
                }

                // Connecting lines and outer nodes
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3;

                    // Lines from center to outer points
                    for (let t = 0.2; t <= 1; t += 0.05) {
                        const x = centerX + Math.cos(angle) * nodeRadius * t * scale;
                        const y = centerY + Math.sin(angle) * nodeRadius * t * scale;
                        this.logoTargets[logoName].push({
                            x: x,
                            y: y,
                            color: t > 0.7 ? colors.secondary : colors.primary
                        });
                    }

                    // Outer node circles
                    const outerX = centerX + Math.cos(angle) * nodeRadius * scale;
                    const outerY = centerY + Math.sin(angle) * nodeRadius * scale;

                    for (let nodeAngle = 0; nodeAngle < Math.PI * 2; nodeAngle += 0.3) {
                        const nodeRadius2 = 12;
                        const x = outerX + Math.cos(nodeAngle) * nodeRadius2;
                        const y = outerY + Math.sin(nodeAngle) * nodeRadius2;
                        this.logoTargets[logoName].push({
                            x: x,
                            y: y,
                            color: colors.secondary
                        });
                    }
                }

                // Add some connecting arcs between outer nodes
                for (let i = 0; i < 6; i++) {
                    const angle1 = (i * Math.PI) / 3;
                    const angle2 = ((i + 1) * Math.PI) / 3;
                    const midAngle = (angle1 + angle2) / 2;

                    for (let t = 0; t <= 1; t += 0.1) {
                        const currentAngle = angle1 + (angle2 - angle1) * t;
                        const arcRadius = nodeRadius * 0.8;
                        const x = centerX + Math.cos(currentAngle) * arcRadius * scale;
                        const y = centerY + Math.sin(currentAngle) * arcRadius * scale;
                        this.logoTargets[logoName].push({
                            x: x,
                            y: y,
                            color: colors.primary
                        });
                    }
                }
                break;
        }
    }

    start() {
        this.isActive = true;
        this.phase = 'forming';
        this.phaseTimer = 0;
        this.currentSymbol = 0;
        this.createParticles();
        this.animate();
        activeAnimations++;
        updateStats();
    }

    stop() {
        this.isActive = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        activeAnimations--;
        totalParticles -= this.particles.length;
        this.particles = [];
        updateStats();
    }

    createParticles() {
        this.particles = [];

        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                targetX: 0,
                targetY: 0,
                vx: 0,
                vy: 0,
                size: Math.random() * 2 + 1,
                color: this.getGrayscaleColor(),
                alpha: Math.random() * 0.5 + 0.5,
                explosionVx: 0,
                explosionVy: 0,
                frozenX: 0,
                frozenY: 0,
                scatterVx: 0,
                scatterVy: 0
            });
        }

        totalParticles += this.particles.length;
        this.formFibonacciSphere();
    }

    getGrayscaleColor() {
        const grayValue = Math.floor(Math.random() * 100 + 150);
        return `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
    }

    formFibonacciSphere() {
        const radius = 80;
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));

        for (let i = 0; i < this.particles.length; i++) {
            const y = 1 - (i / (this.particles.length - 1)) * 2;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = goldenAngle * i;
            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;
            const perspective = 200 / (200 + z * radius);

            this.particles[i].targetX = this.centerX + x * radius * perspective;
            this.particles[i].targetY = this.centerY + y * radius * perspective;
        }
    }

    explodeParticles() {
        this.particles.forEach(particle => {
            const dx = particle.x - this.centerX;
            const dy = particle.y - this.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;
                const speed = Math.random() * 4 + 3;

                particle.explosionVx = normalizedDx * speed;
                particle.explosionVy = normalizedDy * speed;
            }
        });
    }

    scatterParticles() {
        this.particles.forEach(particle => {
            // Create random scatter velocities
            particle.scatterVx = (Math.random() - 0.5) * 8;
            particle.scatterVy = (Math.random() - 0.5) * 8;
        });
    }

    assignParticlesToLogo() {
        const currentLogoName = this.symbols[this.currentSymbol];

        if (!this.logoTargets[currentLogoName] || this.logoTargets[currentLogoName].length === 0) {
            this.createFallbackTargets(currentLogoName);
        }

        // Assign each particle to a random logo target
        this.particles.forEach(particle => {
            const target = this.logoTargets[currentLogoName][Math.floor(Math.random() * this.logoTargets[currentLogoName].length)];

            // Add small random offset to avoid perfect overlap
            const offsetX = (Math.random() - 0.5) * 4;
            const offsetY = (Math.random() - 0.5) * 4;

            particle.targetX = target.x + offsetX;
            particle.targetY = target.y + offsetY;
            particle.color = target.color;
        });
    }

    animate() {
        if (!this.isActive) return;

        // Clear with fully transparent background
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.phase === 'traveling' || this.phase === 'symbol' || this.phase === 'scattering') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Phase management
        this.phaseTimer++;

        if (this.phaseTimer >= this.phaseDurations[this.phase]) {
            this.phaseTimer = 0;

            switch (this.phase) {
                case 'forming':
                    this.phase = 'sphere';
                    break;
                case 'sphere':
                    this.phase = 'pause';
                    break;
                case 'pause':
                    this.phase = 'exploding';
                    this.explodeParticles();
                    break;
                case 'exploding':
                    this.phase = 'freezing';
                    this.particles.forEach(particle => {
                        particle.frozenX = particle.x;
                        particle.frozenY = particle.y;
                    });
                    break;
                case 'freezing':
                    this.phase = 'traveling';
                    this.assignParticlesToLogo();
                    // Reset velocities for physics-based movement
                    this.particles.forEach(particle => {
                        particle.vx = 0;
                        particle.vy = 0;
                    });
                    break;
                case 'traveling':
                    this.phase = 'symbol';
                    break;
                case 'symbol':
                    this.phase = 'symbolPause';
                    break;
                case 'symbolPause':
                    // Check if we have more symbols to show
                    if (this.currentSymbol < this.symbols.length - 1) {
                        this.phase = 'scattering';
                        this.scatterParticles();
                    } else {
                        // Reset to beginning
                        this.phase = 'forming';
                        this.currentSymbol = 0;
                        this.formFibonacciSphere();
                        this.particles.forEach(particle => {
                            particle.color = this.getGrayscaleColor();
                            particle.vx = 0;
                            particle.vy = 0;
                        });
                    }
                    break;
                case 'scattering':
                    // Move to next symbol
                    this.currentSymbol++;
                    this.phase = 'traveling';
                    this.assignParticlesToLogo();
                    // Reset velocities for physics-based movement
                    this.particles.forEach(particle => {
                        particle.vx = 0;
                        particle.vy = 0;
                    });
                    break;
            }
        }

        // Update particles based on current phase
        this.particles.forEach(particle => {
            switch (this.phase) {
                case 'forming':
                case 'sphere':
                case 'pause':
                    // Simple lerp for initial formation
                    const lerpFactor = this.phase === 'pause' ? 0 : 0.03;
                    particle.x += (particle.targetX - particle.x) * lerpFactor;
                    particle.y += (particle.targetY - particle.y) * lerpFactor;
                    break;

                case 'exploding':
                    // Explosion physics
                    particle.x += particle.explosionVx;
                    particle.y += particle.explosionVy;
                    particle.explosionVx *= 0.98;
                    particle.explosionVy *= 0.98;
                    break;

                case 'freezing':
                    // Frozen at explosion positions
                    particle.x = particle.frozenX;
                    particle.y = particle.frozenY;
                    break;

                case 'scattering':
                    // Scatter particles randomly
                    particle.x += particle.scatterVx;
                    particle.y += particle.scatterVy;
                    particle.scatterVx *= 0.95;
                    particle.scatterVy *= 0.95;
                    break;

                case 'traveling':
                case 'symbol':
                    // Physics-based movement to logo targets
                    const dx = particle.targetX - particle.x;
                    const dy = particle.targetY - particle.y;

                    particle.vx += dx * 0.002;
                    particle.vy += dy * 0.002;
                    particle.vx *= 0.9;
                    particle.vy *= 0.9;

                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    break;

                case 'symbolPause':
                    // Hold position
                    break;
            }
        });

        // Render particles
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillRect(particle.x - this.particleSize / 2, particle.y - this.particleSize / 2, this.particleSize, this.particleSize);
        });

        this.ctx.globalAlpha = 1;

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize animations on DOM load
document.addEventListener('DOMContentLoaded', () => {
    const canvases = {
        sand: new SandFormation(document.getElementById('sand-canvas')),
    };

    canvases.sand.start();

    // // Set up trigger buttons
    // document.querySelectorAll('.trigger-btn').forEach(btn => {
    //     const targetId = btn.dataset.target;
    //     btn.addEventListener('click', () => {
    //         const animation = canvases[btn.closest('.animation-section').dataset.animation];
    //         if (animation.isActive) {
    //             animation.stop();
    //             btn.textContent = 'Trigger';
    //         } else {
    //             animation.start();
    //             btn.textContent = 'Stop';
    //         }
    //     });
    // });

    // Global controls
    // document.getElementById('play-all').addEventListener('click', () => {
    //     Object.values(canvases).forEach(animation => animation.start());
    //     document.querySelectorAll('.trigger-btn').forEach(btn => btn.textContent = 'Stop');
    // });

    // document.getElementById('stop-all').addEventListener('click', () => {
    //     Object.values(canvases).forEach(animation => animation.stop());
    //     document.querySelectorAll('.trigger-btn').forEach(btn => btn.textContent = 'Trigger');
    // });

    // document.getElementById('reset-all').addEventListener('click', () => {
    //     Object.values(canvases).forEach(animation => {
    //         animation.stop();
    //         animation.start();
    //     });
    // });

    // Speed control
    // document.getElementById('speed-control').addEventListener('input', (e) => {
    //     animationSpeed = parseFloat(e.target.value);
    //     document.getElementById('speed-value').textContent = `${animationSpeed}x`;
    // });

    // // Color scheme control
    // document.getElementById('color-scheme').addEventListener('change', (e) => {
    //     colorScheme = e.target.value;
    //     Object.values(canvases).forEach(animation => {
    //         animation.colors = colorSchemes[colorScheme];
    //         if (animation.isActive) {
    //             animation.stop();
    //             animation.start();
    //         }
    //     });
    // });

    // Modal controls
    // const modal = document.getElementById('selection-modal');
    // document.getElementById('show-selection-modal').addEventListener('click', () => {
    //     modal.style.display = 'flex';
    // });

    // document.getElementById('close-modal').addEventListener('click', () => {
    //     modal.style.display = 'none';
    // });

    // FPS Counter
    setInterval(() => {
        calculateFPS();
    }, 1000);
});