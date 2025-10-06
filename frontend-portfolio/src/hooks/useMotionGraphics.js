import { useEffect } from 'react';

export const useMotionGraphics = () => {
  useEffect(() => {
    // Only run on desktop
    if (window.innerWidth <= 768) return;

    // Magnetic Cursor Effect
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    
    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);
    
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    // Smooth follow for outline
    function animateOutline() {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      
      cursorOutline.style.left = outlineX + 'px';
      cursorOutline.style.top = outlineY + 'px';
      
      requestAnimationFrame(animateOutline);
    }
    const animationId = requestAnimationFrame(animateOutline);
    
    // Magnetic effect on interactive elements
    const magneticElements = document.querySelectorAll('a, button, .btn-3d, .project-card, .skill-circle');
    
    const handleMouseEnter = (element) => () => {
      cursorOutline.style.width = '60px';
      cursorOutline.style.height = '60px';
      cursorDot.style.transform = 'scale(1.5)';
    };
    
    const handleMouseLeave = () => {
      cursorOutline.style.width = '40px';
      cursorOutline.style.height = '40px';
      cursorDot.style.transform = 'scale(1)';
    };
    
    const handleElementMouseMove = (element) => (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    };
    
    const handleElementMouseLeave = (element) => () => {
      element.style.transform = 'translate(0, 0)';
    };
    
    magneticElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter(element));
      element.addEventListener('mouseleave', handleMouseLeave);
      element.addEventListener('mousemove', handleElementMouseMove(element));
      element.addEventListener('mouseleave', handleElementMouseLeave(element));
    });

    // Particle Trail Effect
    let lastTime = 0;
    const throttleDelay = 30;
    
    const createParticleTrail = (x, y) => {
      const particle = document.createElement('div');
      particle.className = 'particle-trail';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      
      const size = Math.random() * 4 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 1000);
    };
    
    const handleParticleMove = (e) => {
      const currentTime = Date.now();
      if (currentTime - lastTime > throttleDelay) {
        createParticleTrail(e.clientX, e.clientY);
        lastTime = currentTime;
      }
    };
    
    document.addEventListener('mousemove', handleParticleMove);

    // Ambient Light Effect
    const ambientLight = document.createElement('div');
    ambientLight.className = 'ambient-light';
    document.body.appendChild(ambientLight);
    
    let lightX = 0, lightY = 0;
    let targetX = 0, targetY = 0;
    
    const handleLightMove = (e) => {
      targetX = e.clientX - 200;
      targetY = e.clientY - 200;
    };
    
    document.addEventListener('mousemove', handleLightMove);
    
    function animateLight() {
      lightX += (targetX - lightX) * 0.05;
      lightY += (targetY - lightY) * 0.05;
      
      ambientLight.style.transform = `translate(${lightX}px, ${lightY}px)`;
      requestAnimationFrame(animateLight);
    }
    const lightAnimationId = requestAnimationFrame(animateLight);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleParticleMove);
      document.removeEventListener('mousemove', handleLightMove);
      cancelAnimationFrame(animationId);
      cancelAnimationFrame(lightAnimationId);
      cursorDot.remove();
      cursorOutline.remove();
      ambientLight.remove();
      
      magneticElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter(element));
        element.removeEventListener('mouseleave', handleMouseLeave);
        element.removeEventListener('mousemove', handleElementMouseMove(element));
        element.removeEventListener('mouseleave', handleElementMouseLeave(element));
      });
    };
  }, []);
};

export const useScrollAnimations = () => {
  useEffect(() => {
    // Liquid Navigation Effect
    const navbar = document.querySelector('.navbar');
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Liquid Reveal for Sections
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
    
    sections.forEach(section => observer.observe(section));
    
    // Stagger Animation
    const staggerElements = document.querySelectorAll('.stat-item, .skill-tag, .project-tech span');
    
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('stagger-item');
          }, index * 50);
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    staggerElements.forEach(element => staggerObserver.observe(element));
    
    // Enhanced Parallax
    const parallaxElements = document.querySelectorAll('.hero-visual, .profile-container, .floating-skill');
    
    const handleParallax = () => {
      const scrolled = window.pageYOffset;
      parallaxElements.forEach((element, index) => {
        const speed = 0.3 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    };
    
    window.addEventListener('scroll', handleParallax);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleParallax);
      observer.disconnect();
      staggerObserver.disconnect();
    };
  }, []);
};

export const useCardEffects = () => {
  useEffect(() => {
    // Holographic Card Effect
    const cards = document.querySelectorAll('.skill-category-card, .project-card');
    
    const handleMouseMove = (card) => (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    };
    
    cards.forEach(card => {
      card.classList.add('holographic-card');
      const handler = handleMouseMove(card);
      card.addEventListener('mousemove', handler);
    });
    
    // Contact Items Ripple Effect
    const contactItems = document.querySelectorAll('.contact-item, .social-btn');
    contactItems.forEach(item => item.classList.add('ripple-effect'));
    
    // Gradient Border for Contact Card
    const contactCard = document.querySelector('.contact-card');
    contactCard?.classList.add('gradient-border');
    
    // Cleanup
    return () => {
      cards.forEach(card => {
        card.classList.remove('holographic-card');
      });
    };
  }, []);
};

export const useSkillAnimations = () => {
  useEffect(() => {
    const skillCircles = document.querySelectorAll('.skill-circle');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const circle = entry.target;
          const percentage = parseInt(circle.getAttribute('data-percentage'));
          
          animateCircularProgress(circle, percentage);
          observer.unobserve(circle);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -50px 0px'
    });
    
    const animateCircularProgress = (circle, targetPercentage) => {
      const degrees = (targetPercentage / 100) * 360;
      let currentDegree = 0;
      const increment = degrees / 60;
      
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
        }
      };
      
      setTimeout(animate, 200);
    };
    
    skillCircles.forEach(circle => observer.observe(circle));
    
    // Floating Particles Around Badges
    const skillBadges = document.querySelectorAll('.floating-skill-badge, .floating-skill');
    
    const createFloatingParticle = (element) => {
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
      
      setTimeout(() => particle.remove(), 2000);
    };
    
    const intervals = [];
    skillBadges.forEach(badge => {
      const interval = setInterval(() => createFloatingParticle(badge), 2000);
      intervals.push(interval);
    });
    
    return () => {
      observer.disconnect();
      intervals.forEach(interval => clearInterval(interval));
    };
  }, []);
};
