/**
 * Main JavaScript for Eco-Explorer Website
 * Handles core functionality, navigation, and interactions
 */

// Main App Class
class EcoExplorerApp {
    constructor() {
        this.currentSection = 'home';
        this.sections = ['home', 'about', 'world', 'gameplay', 'vision', 'endgame', 'contact'];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeNavigation();
        this.setupMobileMenu();
        this.setupFormHandling();
        this.updateFooterYear();
        this.setupScrollAnimations();
    }

    setupEventListeners() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            
            if (mobileMenu && !mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });

        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    initializeNavigation() {
        const sections = document.querySelectorAll('main section[id]');
        const navLinks = document.querySelectorAll('a.nav-link[data-nav-link]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.updateActiveNavLink(id);
                    this.currentSection = id;
                }
            });
        }, {
            rootMargin: '-30% 0px -70% 0px',
            threshold: 0.1
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    updateActiveNavLink(activeId) {
        const navLinks = document.querySelectorAll('a.nav-link[data-nav-link]');
        
        navLinks.forEach(link => {
            link.classList.remove('nav-active');
            if (link.getAttribute('data-nav-link') === activeId) {
                link.classList.add('nav-active');
            }
        });
    }

    setupMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });

            // Close mobile menu when a link is clicked
            document.querySelectorAll('#mobile-menu a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });
        }
    }

    setupFormHandling() {
        const form = document.querySelector('form[name="contact"]');
        const successMessage = document.getElementById('form-success-message');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form, successMessage);
            });
        }
    }

    async handleFormSubmission(form, successMessage) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            // For Netlify forms, the form will be handled automatically
            // This is just for UI feedback
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show success message
            form.style.display = 'none';
            successMessage.classList.remove('hidden');
            
            // Reset form
            form.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error submitting the form. Please try again.');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    setupScrollAnimations() {
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

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.card, .bg-gray-800 > div');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    handleResize() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (window.innerWidth >= 768 && mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
    }

    updateFooterYear() {
        const yearElement = document.querySelector('footer p:first-child');
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            yearElement.innerHTML = `&copy; ${currentYear} Eco-Explorer Game Studios. All Rights Reserved.`;
        }
    }

    // Utility methods
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-emerald-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        this.measurePageLoad();
        this.measureFirstContentfulPaint();
    }

    measurePageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.metrics.pageLoadTime = loadTime;
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        });
    }

    measureFirstContentfulPaint() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.fcp = entry.startTime;
                        console.log(`First Contentful Paint: ${entry.startTime.toFixed(2)}ms`);
                    }
                }
            });
            observer.observe({ entryTypes: ['paint'] });
        }
    }
}

// Error handling
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    }

    handleError(event) {
        console.error('JavaScript Error:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });
    }

    handlePromiseRejection(event) {
        console.error('Unhandled Promise Rejection:', event.reason);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize error handling
    new ErrorHandler();
    
    // Initialize performance monitoring
    new PerformanceMonitor();
    
    // Initialize main app
    window.ecoExplorerApp = new EcoExplorerApp();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EcoExplorerApp, PerformanceMonitor, ErrorHandler };
} 