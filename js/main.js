// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Typewriter Effect
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize Typewriter
document.addEventListener('DOMContentLoaded', function() {
    const txtElement = document.querySelector('#typewriter');
    const words = ['UI/UX Designer', 'Web Developer', 'Creative Thinker', 'Problem Solver'];
    const wait = 3000;

    if (txtElement) {
        new TypeWriter(txtElement, words, wait);
    }
});

// Particles.js Configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#0066FF'
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000'
            }
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#0066FF',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
});

// Smooth Scrolling for Navigation Links
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

// Navbar Background on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
    }
});

// Skill Bar Animation
const animateSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                skillBar.style.width = width;
            }
        });
    }, {
        threshold: 0.5
    });

    skillBars.forEach(bar => {
        observer.observe(bar);
    });
};

// Initialize skill bar animation
document.addEventListener('DOMContentLoaded', animateSkillBars);

// 3D Tilt Effect for Cards
const addTiltEffect = () => {
    const cards = document.querySelectorAll('.project-card, .skill-card, .contact-info');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
};

// Initialize tilt effect
document.addEventListener('DOMContentLoaded', addTiltEffect);

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-visual');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Counter Animation for Stats
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                const suffix = counter.textContent.replace(/\d/g, '');
                let current = 0;
                const increment = target / 100;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + suffix;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
};

// Initialize counter animation
document.addEventListener('DOMContentLoaded', animateCounters);

// Form Validation and Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const subject = this.querySelector('input[placeholder="Subject"]').value;
        const message = this.querySelector('textarea').value;
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Message sent successfully!', 'success');
        this.reset();
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: linear-gradient(135deg, #06D6A0, #0066FF);' : ''}
        ${type === 'error' ? 'background: linear-gradient(135deg, #FF6B6B, #FF8E53);' : ''}
        ${type === 'info' ? 'background: linear-gradient(135deg, #0066FF, #8B5CF6);' : ''}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Enhanced Loading Animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    const loaderProgress = document.querySelector('.loader-progress');
    
    if (loader && loaderProgress) {
        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Hide loader after completion
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.display = 'none';
                        // Trigger entrance animations
                        document.body.classList.add('loaded');
                    }, 500);
                }, 300);
            }
            loaderProgress.style.width = progress + '%';
        }, 100);
    }
});

// Intersection Observer for Animations
const observeElements = () => {
    const elements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
};

// Initialize observers
document.addEventListener('DOMContentLoaded', observeElements);

// Mouse Cursor Effect
const createCursorEffect = () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: linear-gradient(135deg, #0066FF, #8B5CF6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: all 0.1s ease;
        opacity: 0;
    `;
    
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .btn-3d');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.background = 'linear-gradient(135deg, #06D6A0, #0066FF)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'linear-gradient(135deg, #0066FF, #8B5CF6)';
        });
    });
};

// Initialize cursor effect on desktop
if (window.innerWidth > 768) {
    document.addEventListener('DOMContentLoaded', createCursorEffect);
}

// Scroll Progress Indicator
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #0066FF, #8B5CF6, #06D6A0);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
};

// Initialize scroll progress
document.addEventListener('DOMContentLoaded', createScrollProgress);

// Performance optimization - Debounce scroll events
function debounce(func, wait) {
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

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(() => {
    // Scroll-based animations here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Project Filtering System
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Initialize filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter projects with smooth animation
            projectCards.forEach((card, index) => {
                const cardParent = card.closest('.col-lg-4');
                
                if (filter === 'all' || cardParent.classList.contains(filter)) {
                    // Show card with animation
                    cardParent.style.display = 'block';
                    setTimeout(() => {
                        card.classList.add('fade-in');
                    }, index * 50); // Stagger animation
                } else {
                    // Hide card
                    card.classList.remove('fade-in');
                    setTimeout(() => {
                        cardParent.style.display = 'none';
                    }, 200);
                }
            });
        });
    });
    
    // Update filter button counts
    const updateFilterCounts = () => {
        const allProjects = document.querySelectorAll('.project-card').length;
        const developProjects = document.querySelectorAll('.develop').length;
        const designProjects = document.querySelectorAll('.design').length;
        const mobileProjects = document.querySelectorAll('.mobile').length;
        
        // Update button text with counts
        filterBtns.forEach(btn => {
            const filter = btn.getAttribute('data-filter');
            const currentText = btn.textContent.split(' (')[0]; // Remove existing count
            
            let count = 0;
            switch(filter) {
                case 'all': count = allProjects; break;
                case 'develop': count = developProjects; break;
                case 'design': count = designProjects; break;
                case 'mobile': count = mobileProjects; break;
            }
            
            btn.textContent = `${currentText} (${count})`;
        });
    };
    
    // Initialize counts
    updateFilterCounts();
});

// Enhanced Skills Section Animation
document.addEventListener('DOMContentLoaded', function() {
    // Animate skill circles when they come into view
    const animateSkillCircles = () => {
        const skillCircles = document.querySelectorAll('.skill-circle');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const circle = entry.target;
                    const percentage = parseInt(circle.getAttribute('data-percentage'));
                    
                    // Animate the circular progress
                    animateCircularProgress(circle, percentage);
                    
                    // Unobserve after animation
                    observer.unobserve(circle);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });
        
        skillCircles.forEach(circle => {
            observer.observe(circle);
        });
    };
    
    // Function to animate circular progress
    const animateCircularProgress = (circle, targetPercentage) => {
        const degrees = (targetPercentage / 100) * 360;
        let currentDegree = 0;
        const increment = degrees / 60; // 60 frames for smooth animation
        
        const animate = () => {
            if (currentDegree < degrees) {
                currentDegree += increment;
                const primaryColor = getComputedStyle(document.documentElement)
                    .getPropertyValue('--primary-color').trim();
                
                circle.style.background = `conic-gradient(
                    ${primaryColor} 0deg,
                    ${primaryColor} ${currentDegree}deg,
                    rgba(255, 255, 255, 0.1) ${currentDegree}deg
                )`;
                
                requestAnimationFrame(animate);
            } else {
                // Final state
                circle.style.background = `conic-gradient(
                    ${primaryColor} 0deg,
                    ${primaryColor} ${degrees}deg,
                    rgba(255, 255, 255, 0.1) ${degrees}deg
                )`;
            }
        };
        
        // Start animation with a slight delay
        setTimeout(animate, 200);
    };
    
    // Initialize skill circle animations
    animateSkillCircles();
    
    // Add interactive hover effects to skill tags
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
    
    // Floating skill badges interaction
    const floatingBadges = document.querySelectorAll('.floating-skill-badge');
    floatingBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            // Create a pulse effect
            this.style.transform = 'scale(1.2)';
            this.style.boxShadow = '0 20px 50px rgba(0, 102, 255, 0.6)';
            
            setTimeout(() => {
                this.style.transform = '';
                this.style.boxShadow = '';
            }, 300);
        });
    });
    
    // Add counter animation for skill percentages
    const animateCounters = () => {
        const counters = document.querySelectorAll('.skill-percentage');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.textContent);
                    let current = 0;
                    const increment = target / 50; // 50 frames
                    
                    const updateCounter = () => {
                        if (current < target) {
                            current += increment;
                            counter.textContent = Math.round(current) + '%';
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target + '%';
                        }
                    };
                    
                    setTimeout(updateCounter, 500);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    };
    
    // Initialize counter animations
    animateCounters();
});

// Add CSS for ripple effect
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .skill-tag {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

console.log('🚀 Portfolio loaded successfully!');
console.log('✨ All animations and interactions are ready!');
console.log('🎯 Project filtering system initialized!');
console.log('🎨 Enhanced skills section with circular progress animations!');

// ========================================
// ADVANCED MOTION GRAPHICS & INTERACTIONS
// ========================================

// Magnetic Cursor Effect
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth > 768) {
        const cursorDot = document.createElement('div');
        const cursorOutline = document.createElement('div');
        
        cursorDot.className = 'cursor-dot';
        cursorOutline.className = 'cursor-outline';
        
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorOutline);
        
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });
        
        // Smooth follow for outline
        function animateOutline() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            
            requestAnimationFrame(animateOutline);
        }
        animateOutline();
        
        // Magnetic effect on interactive elements
        const magneticElements = document.querySelectorAll('a, button, .btn-3d, .project-card, .skill-circle');
        
        magneticElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorDot.style.transform = 'scale(1.5)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorDot.style.transform = 'scale(1)';
            });
            
            // Magnetic pull effect
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }
});

// Particle Trail Effect
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth > 768) {
        let lastTime = 0;
        const throttleDelay = 30;
        
        document.addEventListener('mousemove', (e) => {
            const currentTime = Date.now();
            
            if (currentTime - lastTime > throttleDelay) {
                createParticleTrail(e.clientX, e.clientY);
                lastTime = currentTime;
            }
        });
        
        function createParticleTrail(x, y) {
            const particle = document.createElement('div');
            particle.className = 'particle-trail';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            // Random size variation
            const size = Math.random() * 4 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
});

// Ambient Light Effect Following Cursor
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth > 768) {
        const ambientLight = document.createElement('div');
        ambientLight.className = 'ambient-light';
        document.body.appendChild(ambientLight);
        
        let lightX = 0, lightY = 0;
        let targetX = 0, targetY = 0;
        
        document.addEventListener('mousemove', (e) => {
            targetX = e.clientX - 200;
            targetY = e.clientY - 200;
        });
        
        function animateLight() {
            lightX += (targetX - lightX) * 0.05;
            lightY += (targetY - lightY) * 0.05;
            
            ambientLight.style.transform = `translate(${lightX}px, ${lightY}px)`;
            requestAnimationFrame(animateLight);
        }
        animateLight();
    }
});

// Enhanced Scroll Progress with Color Change
document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
        
        // Change color based on section
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });
        
        // Update progress bar gradient based on section
        if (currentSection === 'home') {
            progressBar.style.background = 'linear-gradient(90deg, #0066FF, #8B5CF6)';
        } else if (currentSection === 'about') {
            progressBar.style.background = 'linear-gradient(90deg, #8B5CF6, #06D6A0)';
        } else if (currentSection === 'skills') {
            progressBar.style.background = 'linear-gradient(90deg, #06D6A0, #0066FF)';
        } else if (currentSection === 'projects') {
            progressBar.style.background = 'linear-gradient(90deg, #0066FF, #06D6A0)';
        } else if (currentSection === 'contact') {
            progressBar.style.background = 'linear-gradient(90deg, #8B5CF6, #0066FF)';
        }
    });
});

// Liquid Navigation Effect
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// Holographic Card Effect
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.skill-category-card, .project-card');
    
    cards.forEach(card => {
        card.classList.add('holographic-card');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });
});

// Magnetic Grid Effect for Projects
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.classList.add('magnetic-grid');
        
        const parent = card.closest('.col-lg-4');
        if (!parent) return;
        
        parent.addEventListener('mouseenter', function() {
            // Get all sibling cards
            const allCards = document.querySelectorAll('.project-card');
            
            allCards.forEach(otherCard => {
                if (otherCard !== card) {
                    const rect1 = card.getBoundingClientRect();
                    const rect2 = otherCard.getBoundingClientRect();
                    
                    const dx = rect2.left - rect1.left;
                    const dy = rect2.top - rect1.top;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 400) {
                        const force = (400 - distance) / 400;
                        const angle = Math.atan2(dy, dx);
                        
                        const pushX = Math.cos(angle) * force * 10;
                        const pushY = Math.sin(angle) * force * 10;
                        
                        otherCard.style.transform = `translate(${pushX}px, ${pushY}px)`;
                    }
                }
            });
        });
        
        parent.addEventListener('mouseleave', function() {
            const allCards = document.querySelectorAll('.project-card');
            allCards.forEach(otherCard => {
                otherCard.style.transform = 'translate(0, 0)';
            });
        });
    });
});

// Enhanced Liquid Reveal for Sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('liquid-reveal');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Stagger Animation for List Items
document.addEventListener('DOMContentLoaded', function() {
    const staggerElements = document.querySelectorAll('.stat-item, .skill-tag, .project-tech span');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('stagger-item');
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    staggerElements.forEach(element => {
        observer.observe(element);
    });
});

// Ripple Effect on Contact Items
document.addEventListener('DOMContentLoaded', function() {
    const contactItems = document.querySelectorAll('.contact-item, .social-btn');
    
    contactItems.forEach(item => {
        item.classList.add('ripple-effect');
    });
});

// Enhanced Parallax Effect
document.addEventListener('DOMContentLoaded', function() {
    const parallaxElements = document.querySelectorAll('.hero-visual, .profile-container, .floating-skill');
    
    parallaxElements.forEach(element => {
        element.classList.add('parallax-layer');
    });
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.3 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
});

// Gradient Border Animation for Contact Cards
document.addEventListener('DOMContentLoaded', function() {
    const contactCard = document.querySelector('.contact-card');
    if (contactCard) {
        contactCard.classList.add('gradient-border');
    }
});

// Enhanced Loading Animation with Liquid Fill
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    const loaderProgress = document.querySelector('.loader-progress');
    
    if (loader && loaderProgress) {
        loaderProgress.classList.add('liquid-fill');
        
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.classList.add('loaded');
                
                // Trigger entrance animations
                triggerEntranceAnimations();
            }, 500);
        }, 2000);
    }
});

function triggerEntranceAnimations() {
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroContent) {
        heroContent.classList.add('clip-reveal');
    }
    if (heroVisual) {
        setTimeout(() => {
            heroVisual.classList.add('liquid-reveal');
        }, 300);
    }
}

// Floating Particles Around Skill Badges
document.addEventListener('DOMContentLoaded', function() {
    const skillBadges = document.querySelectorAll('.floating-skill-badge, .floating-skill');
    
    skillBadges.forEach(badge => {
        setInterval(() => {
            createFloatingParticle(badge);
        }, 2000);
    });
    
    function createFloatingParticle(element) {
        const rect = element.getBoundingClientRect();
        const particle = document.createElement('div');
        
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            box-shadow: 0 0 10px var(--primary-color);
        `;
        
        const tx = (Math.random() - 0.5) * 100;
        const ty = (Math.random() - 0.5) * 100;
        
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        document.body.appendChild(particle);
        
        particle.style.animation = 'floatParticle 2s ease-out forwards';
        
        setTimeout(() => {
            particle.remove();
        }, 2000);
    }
});

// Enhanced Project Overlay with Liquid Effect
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const overlay = card.querySelector('.project-overlay');
        if (!overlay) return;
        
        card.addEventListener('mouseenter', () => {
            overlay.style.animation = 'liquidReveal 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        });
        
        card.addEventListener('mouseleave', () => {
            overlay.style.animation = 'none';
        });
    });
});

// Aurora Background Effect
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.classList.add('aurora-bg');
    }
});

// Smooth Scroll with Easing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const targetPosition = target.offsetTop - 80;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000;
            let start = null;
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }
            
            function easeInOutCubic(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t * t + b;
                t -= 2;
                return c / 2 * (t * t * t + 2) + b;
            }
            
            requestAnimationFrame(animation);
        }
    });
});

// Performance Monitoring
if (window.performance && window.performance.mark) {
    window.performance.mark('portfolio-interactive-ready');
}

console.log('🎨 Advanced motion graphics initialized!');
console.log('✨ Magnetic cursor effect active!');
console.log('🌊 Liquid animations ready!');
console.log('💫 Particle effects enabled!');
