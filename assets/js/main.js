/**
 * Main JavaScript functionality for Eco-Explorer website
 * Handles mobile menu, smooth scrolling, and other interactive features
 */

class MainApp {
    constructor() {
        this.isInitialized = false;
    }

    /**
     * Initialize the main application
     */
    initialize() {
        if (this.isInitialized) return;

        this.initializeMobileMenu();
        this.initializeSmoothScrolling();
        this.initializeScrollEffects();
        this.initializeContactForm();
        this.initializeWildElements();
        
        this.isInitialized = true;
    }

    /**
     * Initialize mobile menu functionality
     */
    initializeMobileMenu() {
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });

            // Close menu when clicking on a link
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                }
            });
        }
    }

    /**
     * Initialize smooth scrolling for anchor links
     */
    initializeSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Initialize scroll effects
     */
    initializeScrollEffects() {
        // Add scroll-based animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe sections for animation
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });

        // Observe cards for staggered animation
        const cards = document.querySelectorAll('.card, .jungle-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    }

    /**
     * Initialize contact form functionality
     */
    initializeContactForm() {
        const contactForm = document.querySelector('#contact form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }
    }

    /**
     * Handle contact form submission
     */
    async handleContactForm(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn?.textContent;

        try {
            // Show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            this.showNotification('Message sent successfully!', 'success');
            form.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    /**
     * Handle URL parameters on page load
     */
    handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        
        if (langParam && window.i18n) {
            window.i18n.setLanguage(langParam);
        }
    }

    /**
     * Initialize wild elements and animations
     */
    initializeWildElements() {
        // Create floating wild elements
        this.createFloatingElements();
        
        // Initialize jaguar silhouette animation
        this.initializeJaguarSilhouette();
        
        // Add wild pattern animations
        this.initializeWildPatterns();
    }

    /**
     * Create floating wild elements
     */
    createFloatingElements() {
        const heroSection = document.querySelector('#hero');
        if (!heroSection) return;

        const floatingContainer = heroSection.querySelector('.absolute.inset-0.overflow-hidden');
        if (!floatingContainer) return;

        // Create additional floating elements
        for (let i = 0; i < 3; i++) {
            const element = document.createElement('div');
            element.className = 'absolute w-2 h-2 bg-blue-300 rounded-full animate-pulse wild-glow';
            element.style.left = `${20 + i * 30}%`;
            element.style.top = `${30 + i * 20}%`;
            element.style.animationDelay = `${i * 0.5}s`;
            floatingContainer.appendChild(element);
        }
    }

    /**
     * Initialize jaguar silhouette animation
     */
    initializeJaguarSilhouette() {
        const jaguarSilhouette = document.querySelector('#hero .absolute.top-1\\/2.right-10');
        if (jaguarSilhouette) {
            // Add subtle movement animation
            jaguarSilhouette.style.animation = 'leafSway 8s ease-in-out infinite';
        }
    }

    /**
     * Initialize wild pattern animations
     */
    initializeWildPatterns() {
        const wildPatterns = document.querySelectorAll('.wild-pattern, .jaguar-spots');
        wildPatterns.forEach(pattern => {
            // Add subtle animation to patterns
            pattern.style.animation = 'mistFloat 10s ease-in-out infinite';
        });
    }

    /**
     * Initialize particle effects
     */
    initializeParticles() {
        const particlesContainer = document.querySelector('.particles');
        if (!particlesContainer) return;

        // Create particles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    /**
     * Initialize floating shapes
     */
    initializeFloatingShapes() {
        const shapesContainer = document.querySelector('.floating-shapes');
        if (!shapesContainer) return;

        // Create floating shapes
        for (let i = 0; i < 3; i++) {
            const shape = document.createElement('div');
            shape.className = 'shape';
            shapesContainer.appendChild(shape);
        }
    }
}

// Create global instance
window.mainApp = new MainApp();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mainApp.initialize();
    window.mainApp.handleURLParameters();
    window.mainApp.initializeParticles();
    window.mainApp.initializeFloatingShapes();
}); 