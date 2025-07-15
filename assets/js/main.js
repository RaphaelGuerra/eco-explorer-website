/**
 * Simplified JavaScript for Eco-Explorer Website
 */

// Main App Class
class EcoExplorerApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupFormHandling();
        this.updateFooterYear();
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

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                }
            });
        }
    }

    setupSmoothScrolling() {
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
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            // Simulate form submission (Netlify will handle the actual submission)
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

    updateFooterYear() {
        const yearElement = document.querySelector('footer p');
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            yearElement.innerHTML = `&copy; ${currentYear} Eco-Explorer. All rights reserved.`;
        }
    }
}

// Enhanced JavaScript for Eco-Explorer Atlantic Jungle Experience

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('nav a[href^="#"]');
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('text-emerald-400');
                    item.classList.add('text-gray-300');
                });
                
                const activeNavItem = document.querySelector(`nav a[href="#${sectionId}"]`);
                if (activeNavItem) {
                    activeNavItem.classList.remove('text-gray-300');
                    activeNavItem.classList.add('text-emerald-400');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call

    // Form handling with jungle-themed feedback
    const contactForm = document.querySelector('form[name="contact"]');
    const successMessage = document.getElementById('form-success-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                if (successMessage) {
                    successMessage.classList.remove('hidden');
                    successMessage.style.animation = 'fadeInUp 0.6s ease-out';
                }
                
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                this.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    if (successMessage) {
                        successMessage.classList.add('hidden');
                    }
                }, 5000);
            }, 2000);
        });
    }

    // Jungle-themed scroll effects
    function addScrollEffects() {
        const cards = document.querySelectorAll('.card, .bg-gray-800, .bg-gray-900');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out';
                    entry.target.style.opacity = '1';
                }
            });
        }, observerOptions);
        
        cards.forEach(card => {
            card.style.opacity = '0';
            observer.observe(card);
        });
    }
    
    addScrollEffects();

    // Parallax effect for hero section
    function addParallaxEffect() {
        const heroSection = document.querySelector('#home');
        const heroImage = heroSection?.querySelector('img');
        
        if (heroImage) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                heroImage.style.transform = `translateY(${rate}px)`;
            });
        }
    }
    
    addParallaxEffect();

    // Jungle sound effects (optional - can be disabled)
    function addJungleAmbience() {
        const buttons = document.querySelectorAll('.btn, a[href^="#"]');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                // Add subtle hover effect
                this.style.transform = 'scale(1.02)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    addJungleAmbience();

    // Enhanced loading states
    function addLoadingStates() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            });
            
            img.style.opacity = '0';
            img.style.transform = 'scale(0.95)';
            img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    }
    
    addLoadingStates();

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
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
        }
    }
    
    // Apply throttling to scroll events
    window.addEventListener('scroll', throttle(updateActiveNav, 100));
    
    // Initialize all effects
    console.log('🌿 Eco-Explorer Atlantic Jungle Experience loaded successfully!');
}); 