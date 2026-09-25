/**
 * Quillora - Main Interaction Script
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollReveal();
    initProgressBar();
    initParallaxOrbs();
    initStickySteps();
});

/**
 * Navbar & Mobile Menu
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    // Close mobile menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });
}

/**
 * Scroll-Reveal Animation
 */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // If it's a grid, stagger the children
                if (entry.target.classList.contains('grid-cards')) {
                    const cards = entry.target.querySelectorAll('.card');
                    cards.forEach((card, index) => {
                        card.style.transitionDelay = `${index * 0.1}s`;
                        card.classList.add('visible');
                    });
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    document.querySelectorAll('.grid-cards').forEach(el => observer.observe(el));
}

/**
 * Gradient Progress Bar
 */
function initProgressBar() {
    const progress = document.createElement('div');
    progress.className = 'progress-bar';
    document.body.prepend(progress);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progress.style.width = scrolled + '%';
    });
}

/**
 * Parallax Background Orbs
 */
function initParallaxOrbs() {
    const orbs = document.querySelectorAll('.orb');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.2;
            const yPos = -(scrolled * speed);
            orb.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/**
 * Sticky Scroll "How it Works"
 */
function initStickySteps() {
    const steps = document.querySelectorAll('.step-item');
    if (steps.length === 0) return;

    const observerOptions = {
        threshold: 0.6,
        rootMargin: '-20% 0px -20% 0px'
    };

    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all others
                steps.forEach(step => step.classList.remove('active'));
                // Activate current
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    steps.forEach(step => stepObserver.observe(step));
}