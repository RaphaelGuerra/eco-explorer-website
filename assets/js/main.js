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
        this.initializeUXEnhancements();
        
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
     * Enhance UX: scroll progress, back-to-top, focus handling
     */
    initializeUXEnhancements() {
        // Scroll progress
        const progress = document.getElementById('scroll-progress');
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const ratio = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
            if (progress) progress.style.width = ratio + '%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();

        // Back to top button
        const backToTop = document.getElementById('back-to-top');
        const toggleBackToTop = () => {
            if (!backToTop) return;
            if (window.scrollY > window.innerHeight * 0.6) {
                backToTop.classList.remove('hidden');
            } else {
                backToTop.classList.add('hidden');
            }
        };
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        toggleBackToTop();
        backToTop?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Focus trap for mobile menu when open
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (menuBtn && mobileMenu) {
            const focusableSelector = 'a, button, [tabindex]:not([tabindex="-1"])';
            const trapFocus = (e) => {
                if (mobileMenu.classList.contains('hidden')) return;
                const focusables = Array.from(mobileMenu.querySelectorAll(focusableSelector));
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault(); last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault(); first.focus();
                    }
                } else if (e.key === 'Escape') {
                    mobileMenu.classList.add('hidden');
                    menuBtn.focus();
                }
            };
            document.addEventListener('keydown', trapFocus);
        }
    }

    /**
     * Initialize contact form functionality with security features
     */
    initializeContactForm() {
        const contactForm = document.querySelector('#contact form');

        if (contactForm) {
            // Generate and set CSRF token
            this.initializeCSRFToken();

            // Add real-time validation
            this.initializeFormValidation(contactForm);

            // Handle form submission
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });

            // Add form security monitoring
            this.monitorFormSecurity(contactForm);
        }
    }

    /**
     * Initialize CSRF token for form protection
     */
    initializeCSRFToken() {
        const csrfTokenField = document.getElementById('csrf-token');
        if (csrfTokenField) {
            const token = this.generateCSRFToken();
            csrfTokenField.value = token;

            // Store for validation (in production, this would be set server-side)
            sessionStorage.setItem('current_csrf_token', token);
        }
    }

    /**
     * Initialize real-time form validation
     */
    initializeFormValidation(form) {
        const inputs = form.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            // Real-time validation on blur
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            // Clear validation errors on input
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });

            // Rate limiting for typing (basic protection)
            let lastTyped = Date.now();
            input.addEventListener('keydown', () => {
                const now = Date.now();
                if (now - lastTyped < 50) { // Extremely fast typing
                    this.logSecurityEvent('suspicious_typing', {
                        field: input.name,
                        interval: now - lastTyped
                    });
                }
                lastTyped = now;
            });
        });
    }

    /**
     * Validate individual field
     */
    validateField(field) {
        const error = this.getFieldError(field);
        if (error) {
            this.showFieldError(field, error);
        } else {
            this.clearFieldError(field);
        }
    }

    /**
     * Get validation error for field
     */
    getFieldError(field) {
        const value = field.value.trim();

        switch (field.name) {
            case 'name':
                if (!value) return 'Name is required';
                if (value.length < 2) return 'Name must be at least 2 characters';
                if (value.length > 100) return 'Name must be less than 100 characters';
                if (!/^[a-zA-Z\s\-'.]{2,100}$/.test(value)) return 'Name contains invalid characters';
                break;

            case 'email':
                if (!value) return 'Email is required';
                if (!this.isValidEmail(value)) return 'Please enter a valid email address';
                if (this.isSuspiciousEmail(value)) return 'This email address is not allowed';
                break;

            case 'subject':
                if (!value) return 'Subject is required';
                if (value.length < 5) return 'Subject must be at least 5 characters';
                if (value.length > 200) return 'Subject must be less than 200 characters';
                break;

            case 'message':
                if (!value) return 'Message is required';
                if (value.length < 10) return 'Message must be at least 10 characters';
                if (value.length > 2000) return 'Message must be less than 2000 characters';
                break;
        }

        return null;
    }

    /**
     * Show field validation error
     */
    showFieldError(field, error) {
        // Remove existing error
        this.clearFieldError(field);

        // Add error styling
        field.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/20');

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'mt-1 text-xs text-red-400 field-error';
        errorDiv.textContent = error;

        // Insert after field
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }

    /**
     * Clear field validation error
     */
    clearFieldError(field) {
        // Remove error styling
        field.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/20');
        field.classList.add('border-green-500', 'focus:border-green-500', 'focus:ring-green-500/20');

        // Remove error message
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    /**
     * Monitor form security events
     */
    monitorFormSecurity(form) {
        let submissionAttempts = 0;
        const maxAttempts = 3;

        // Monitor for suspicious patterns
        form.addEventListener('submit', () => {
            submissionAttempts++;

            if (submissionAttempts > maxAttempts) {
                this.logSecurityEvent('excessive_submissions', {
                    attempts: submissionAttempts,
                    timestamp: Date.now()
                });
                // Could implement progressive delays or temporary blocking
            }
        });

        // Monitor for automated submissions
        let lastFocus = Date.now();
        form.addEventListener('focusin', () => {
            const now = Date.now();
            if (now - lastFocus < 100) { // Very fast focus changes
                this.logSecurityEvent('rapid_focus_changes', {
                    interval: now - lastFocus
                });
            }
            lastFocus = now;
        });
    }

    /**
     * Handle contact form submission with security enhancements
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

            // Validate and sanitize form data
            const validationResult = this.validateAndSanitizeForm(formData);
            if (!validationResult.isValid) {
                throw new Error(validationResult.errors.join(', '));
            }

            // Add security tokens (for actual implementation)
            const securityData = {
                timestamp: Date.now(),
                sessionId: this.generateSessionId(),
                csrfToken: this.generateCSRFToken()
            };

            // Prepare secure payload
            const payload = {
                ...validationResult.data,
                ...securityData,
                userAgent: navigator.userAgent,
                referrer: document.referrer
            };

            // Rate limiting check
            if (!this.checkRateLimit()) {
                throw new Error('Too many requests. Please wait before submitting again.');
            }

            // Simulate secure form submission
            await this.submitSecureForm(payload);

            // Show success message
            this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();

            // Reset rate limiter
            this.resetRateLimit();

        } catch (error) {
            console.error('Secure form submission error:', error);
            this.showNotification(error.message || 'Failed to send message. Please try again.', 'error');

            // Log security events
            this.logSecurityEvent('form_submission_error', { error: error.message });
        } finally {
            // Reset button state
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    }

    /**
     * Validate and sanitize form data
     */
    validateAndSanitizeForm(formData) {
        const errors = [];
        const sanitized = {};

        // Email validation with security checks
        const email = formData.get('email')?.trim();
        if (!email) {
            errors.push('Email is required');
        } else if (!this.isValidEmail(email)) {
            errors.push('Please enter a valid email address');
        } else if (this.isSuspiciousEmail(email)) {
            errors.push('This email address is not allowed');
        } else {
            sanitized.email = this.sanitizeInput(email);
        }

        // Name validation
        const name = formData.get('name')?.trim();
        if (!name) {
            errors.push('Name is required');
        } else if (name.length < 2) {
            errors.push('Name must be at least 2 characters');
        } else if (name.length > 100) {
            errors.push('Name must be less than 100 characters');
        } else {
            sanitized.name = this.sanitizeInput(name);
        }

        // Subject validation
        const subject = formData.get('subject')?.trim();
        if (!subject) {
            errors.push('Subject is required');
        } else if (subject.length > 200) {
            errors.push('Subject must be less than 200 characters');
        } else {
            sanitized.subject = this.sanitizeInput(subject);
        }

        // Message validation
        const message = formData.get('message')?.trim();
        if (!message) {
            errors.push('Message is required');
        } else if (message.length < 10) {
            errors.push('Message must be at least 10 characters');
        } else if (message.length > 2000) {
            errors.push('Message must be less than 2000 characters');
        } else {
            sanitized.message = this.sanitizeInput(message);
        }

        return {
            isValid: errors.length === 0,
            data: sanitized,
            errors
        };
    }

    /**
     * Email validation with security checks
     */
    isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    /**
     * Check for suspicious email patterns
     */
    isSuspiciousEmail(email) {
        const suspiciousPatterns = [
            /noreply/i,
            /no-reply/i,
            /test/i,
            /example/i,
            /spam/i
        ];
        return suspiciousPatterns.some(pattern => pattern.test(email));
    }

    /**
     * Sanitize input to prevent XSS
     */
    sanitizeInput(input) {
        return input
            .replace(/[<>'"&]/g, (char) => {
                const entityMap = {
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#x27;',
                    '&': '&amp;'
                };
                return entityMap[char];
            })
            .substring(0, 1000); // Limit length
    }

    /**
     * Generate CSRF token
     */
    generateCSRFToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * Generate session ID
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Rate limiting for form submissions
     */
    checkRateLimit() {
        const lastSubmission = localStorage.getItem('eco_explorer_last_submission');
        const now = Date.now();
        const cooldownPeriod = 30000; // 30 seconds

        if (lastSubmission && (now - parseInt(lastSubmission)) < cooldownPeriod) {
            return false;
        }

        localStorage.setItem('eco_explorer_last_submission', now.toString());
        return true;
    }

    /**
     * Reset rate limiter
     */
    resetRateLimit() {
        localStorage.removeItem('eco_explorer_last_submission');
    }

    /**
     * Secure form submission (placeholder for actual implementation)
     */
    async submitSecureForm(payload) {
        // Simulate secure submission with timeout
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for testing
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({ success: true });
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500 + Math.random() * 1000);
        });

        // In production, replace with actual secure API call:
        // return fetch('/api/secure-contact', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-CSRF-Token': payload.csrfToken
        //     },
        //     body: JSON.stringify(payload)
        // });
    }

    /**
     * Log security events
     */
    logSecurityEvent(eventType, data) {
        const securityLog = {
            timestamp: new Date().toISOString(),
            eventType,
            data,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // In production, send to security monitoring service
        console.log('🔒 Security Event:', securityLog);

        // Store in localStorage for debugging (clear after 24 hours)
        const logs = JSON.parse(localStorage.getItem('eco_explorer_security_logs') || '[]');
        logs.push(securityLog);
        if (logs.length > 50) logs.shift(); // Keep only last 50 entries
        localStorage.setItem('eco_explorer_security_logs', JSON.stringify(logs));
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

        // Initialize game integration features
        this.initializeGameIntegration();

        // Initialize chatbot loading states
        this.initializeChatbotStates();

        // Initialize PWA features
        this.initializePWA();

        // Initialize Analytics and Tracking
        this.initializeAnalytics();

        // Initialize Accessibility Enhancements
        this.initializeAccessibility();
    }

    /**
     * Initialize Progressive Web App features
     */
    initializePWA() {
        // Register service worker
        this.registerServiceWorker();

        // Handle install prompt
        this.handleInstallPrompt();

        // Add PWA-related event listeners
        this.addPWAEventListeners();
    }

    /**
     * Initialize Analytics and Tracking
     */
    initializeAnalytics() {
        // Show consent banner if consent not given
        this.showAnalyticsConsentBanner();

        // Initialize consent state
        const existingConsent = window.manageAnalyticsConsent();
        if (existingConsent) {
            window.manageAnalyticsConsent(true);
        }

        // Track page visibility changes
        this.trackPageVisibility();

        // Track user interactions
        this.trackUserInteractions();
    }

    /**
     * Show analytics consent banner
     */
    showAnalyticsConsentBanner() {
        const banner = document.getElementById('analytics-consent-banner');
        const acceptBtn = document.getElementById('accept-analytics');
        const declineBtn = document.getElementById('decline-analytics');
        const customizeBtn = document.getElementById('customize-analytics');

        if (!banner) return;

        // Show banner if no consent given
        const hasConsent = window.manageAnalyticsConsent();
        if (hasConsent === null) {
            setTimeout(() => {
                banner.style.display = 'block';
                requestAnimationFrame(() => {
                    banner.classList.remove('translate-y-full');
                });
            }, 3000); // Show after 3 seconds
        }

        // Handle accept button
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                window.manageAnalyticsConsent(true);
                this.hideConsentBanner();
                this.trackEvent('analytics_consent', 'given', 'banner_accept');
                this.showNotification('Analytics enabled. Thank you for helping us improve!', 'success');
            });
        }

        // Handle decline button
        if (declineBtn) {
            declineBtn.addEventListener('click', () => {
                window.manageAnalyticsConsent(false);
                this.hideConsentBanner();
                this.trackEvent('analytics_consent', 'declined', 'banner_decline');
                this.showNotification('Analytics disabled. We respect your privacy.', 'info');
            });
        }

        // Handle customize button
        if (customizeBtn) {
            customizeBtn.addEventListener('click', () => {
                this.showAnalyticsCustomization();
            });
        }
    }

    /**
     * Hide consent banner
     */
    hideConsentBanner() {
        const banner = document.getElementById('analytics-consent-banner');
        if (banner) {
            banner.classList.add('translate-y-full');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        }
    }

    /**
     * Show analytics customization options
     */
    showAnalyticsCustomization() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';
        modal.innerHTML = `
            <div class="bg-slate-800 rounded-lg p-6 max-w-md mx-4">
                <h3 class="text-white font-semibold mb-4">Customize Analytics</h3>
                <div class="space-y-3">
                    <label class="flex items-center space-x-3">
                        <input type="checkbox" id="analytics-basic" checked class="form-checkbox">
                        <span class="text-slate-300 text-sm">Basic usage analytics (page views, time spent)</span>
                    </label>
                    <label class="flex items-center space-x-3">
                        <input type="checkbox" id="analytics-performance" checked class="form-checkbox">
                        <span class="text-slate-300 text-sm">Performance monitoring (load times, errors)</span>
                    </label>
                    <label class="flex items-center space-x-3">
                        <input type="checkbox" id="analytics-interactions" class="form-checkbox">
                        <span class="text-slate-300 text-sm">User interactions (clicks, scrolls)</span>
                    </label>
                </div>
                <div class="flex space-x-3 mt-6">
                    <button id="save-preferences" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm flex-1">
                        Save Preferences
                    </button>
                    <button id="cancel-customization" class="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded text-sm flex-1">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle save preferences
        document.getElementById('save-preferences').addEventListener('click', () => {
            const basic = document.getElementById('analytics-basic').checked;
            const performance = document.getElementById('analytics-performance').checked;
            const interactions = document.getElementById('analytics-interactions').checked;

            // Store preferences
            localStorage.setItem('eco_explorer_analytics_preferences', JSON.stringify({
                basic, performance, interactions
            }));

            // Enable/disable based on preferences
            if (basic || performance || interactions) {
                window.manageAnalyticsConsent(true);
                this.trackEvent('analytics_customization', 'enabled', 'custom_preferences');
            } else {
                window.manageAnalyticsConsent(false);
            }

            modal.remove();
            this.hideConsentBanner();
            this.showNotification('Analytics preferences saved!', 'success');
        });

        // Handle cancel
        document.getElementById('cancel-customization').addEventListener('click', () => {
            modal.remove();
        });
    }

    /**
     * Track page visibility changes
     */
    trackPageVisibility() {
        let startTime = Date.now();
        let pageVisible = true;

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page hidden - calculate time spent
                const timeSpent = Math.round((Date.now() - startTime) / 1000);
                pageVisible = false;

                if (window.gtag && window.ecoExplorerAnalytics.consentGiven) {
                    window.gtag('event', 'page_visibility', {
                        event_category: 'engagement',
                        event_label: 'page_hidden',
                        value: timeSpent
                    });
                }
            } else {
                // Page visible again
                startTime = Date.now();
                pageVisible = true;

                if (window.gtag && window.ecoExplorerAnalytics.consentGiven) {
                    window.gtag('event', 'page_visibility', {
                        event_category: 'engagement',
                        event_label: 'page_visible'
                    });
                }
            }
        });

        // Track time before page unload
        window.addEventListener('beforeunload', () => {
            if (pageVisible) {
                const timeSpent = Math.round((Date.now() - startTime) / 1000);
                if (window.gtag && window.ecoExplorerAnalytics.consentGiven) {
                    // Use sendBeacon for reliable delivery
                    if (navigator.sendBeacon) {
                        const data = JSON.stringify({
                            event: 'page_unload',
                            time_spent: timeSpent,
                            timestamp: Date.now()
                        });
                        navigator.sendBeacon('/api/analytics', data);
                    }
                }
            }
        });
    }

    /**
     * Track user interactions
     */
    trackUserInteractions() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, a, [data-track]');
            if (target) {
                const action = target.getAttribute('data-translate') ||
                             target.textContent.trim().substring(0, 50) ||
                             target.getAttribute('aria-label') ||
                             'unknown_action';

                this.trackEvent('user_interaction', 'click', action);
            }
        });

        // Track form interactions
        document.addEventListener('submit', (e) => {
            this.trackEvent('user_interaction', 'form_submit', e.target.name || 'unknown_form');
        });

        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);

            if (scrollPercent > maxScrollDepth && scrollPercent > 0) {
                maxScrollDepth = scrollPercent;

                // Track milestones
                if (scrollPercent >= 25 && scrollPercent % 25 === 0) {
                    this.trackEvent('scroll_depth', 'milestone', `${scrollPercent}%`);
                }
            }
        });

        // Track language changes
        document.addEventListener('languageChanged', (e) => {
            this.trackEvent('language_change', e.detail.language, 'user_selection');
        });

        // Track PWA events
        window.addEventListener('appinstalled', () => {
            this.trackEvent('pwa_install', 'successful', 'banner_prompt');
        });

        // Track errors
        window.addEventListener('error', (e) => {
            this.trackEvent('javascript_error', e.error.message.substring(0, 100), 'runtime_error');
        });
    }

    /**
     * Track custom events
     */
    trackEvent(eventName, eventCategory, eventLabel, value = null) {
        // Console logging for development
        console.log(`📊 Event: ${eventName} | ${eventCategory} | ${eventLabel}`, value ? `| ${value}` : '');

        // Send to Google Analytics if enabled
        if (window.gtag && window.ecoExplorerAnalytics.consentGiven) {
            window.gtag('event', eventName, {
                event_category: eventCategory,
                event_label: eventLabel,
                value: value,
                custom_map: {
                    dimension1: 'visitor'
                }
            });
        }
    }

    /**
     * Initialize Accessibility Enhancements
     */
    initializeAccessibility() {
        // Enhanced keyboard navigation
        this.initializeKeyboardNavigation();

        // Focus management
        this.initializeFocusManagement();

        // Screen reader announcements
        this.initializeScreenReaderSupport();

        // High contrast mode detection
        this.initializeHighContrastSupport();

        // Reduced motion support
        this.initializeReducedMotionSupport();

        // Skip links enhancement
        this.initializeSkipLinks();
    }

    /**
     * Enhanced keyboard navigation
     */
    initializeKeyboardNavigation() {
        // Enhanced tab navigation for custom components
        document.addEventListener('keydown', (e) => {
            // Escape key handling
            if (e.key === 'Escape') {
                this.handleEscapeKey(e);
            }

            // Enhanced navigation for mobile menu
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }

            // Arrow key navigation for language switcher
            if (e.target.closest('#language-dropdown')) {
                this.handleLanguageSwitcherNavigation(e);
            }
        });

        // Make language switcher keyboard accessible
        this.initializeLanguageSwitcherKeyboard();
    }

    /**
     * Handle escape key for closing modals/menus
     */
    handleEscapeKey(e) {
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            this.closeMobileMenu();
            e.preventDefault();
        }

        // Close language dropdown if open
        const languageDropdown = document.getElementById('language-dropdown');
        if (languageDropdown && !languageDropdown.classList.contains('hidden')) {
            this.closeLanguageDropdown();
            e.preventDefault();
        }

        // Close analytics banner if visible
        const analyticsBanner = document.getElementById('analytics-consent-banner');
        if (analyticsBanner && analyticsBanner.style.display !== 'none') {
            this.hideConsentBanner();
            e.preventDefault();
        }
    }

    /**
     * Handle tab navigation for focus management
     */
    handleTabNavigation(e) {
        // Focus trap for mobile menu
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            this.handleMobileMenuTabNavigation(e);
        }
    }

    /**
     * Handle mobile menu tab navigation (focus trap)
     */
    handleMobileMenuTabNavigation(e) {
        const mobileMenu = document.getElementById('mobile-menu');
        const focusableElements = mobileMenu.querySelectorAll(
            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    /**
     * Handle language switcher keyboard navigation
     */
    handleLanguageSwitcherNavigation(e) {
        const dropdown = document.getElementById('language-dropdown');
        if (!dropdown) return;

        const options = Array.from(dropdown.querySelectorAll('button'));
        const currentIndex = options.findIndex(option => option === document.activeElement);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % options.length;
                options[nextIndex].focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
                options[prevIndex].focus();
                break;
            case 'Home':
                e.preventDefault();
                options[0].focus();
                break;
            case 'End':
                e.preventDefault();
                options[options.length - 1].focus();
                break;
        }
    }

    /**
     * Initialize language switcher keyboard support
     */
    initializeLanguageSwitcherKeyboard() {
        const languageBtn = document.getElementById('language-btn');
        const dropdown = document.getElementById('language-dropdown');

        if (languageBtn && dropdown) {
            languageBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleLanguageDropdown();
                }
            });

            // Update ARIA attributes when dropdown state changes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const isOpen = !dropdown.classList.contains('hidden');
                        languageBtn.setAttribute('aria-expanded', isOpen.toString());
                    }
                });
            });
            observer.observe(dropdown, { attributes: true });
        }
    }

    /**
     * Toggle language dropdown
     */
    toggleLanguageDropdown() {
        const dropdown = document.getElementById('language-dropdown');
        const isHidden = dropdown.classList.contains('hidden');

        if (isHidden) {
            this.openLanguageDropdown();
        } else {
            this.closeLanguageDropdown();
        }
    }

    /**
     * Open language dropdown
     */
    openLanguageDropdown() {
        const dropdown = document.getElementById('language-dropdown');
        const firstOption = dropdown.querySelector('button');

        dropdown.classList.remove('hidden');
        if (firstOption) {
            setTimeout(() => firstOption.focus(), 100);
        }
    }

    /**
     * Close language dropdown
     */
    closeLanguageDropdown() {
        const dropdown = document.getElementById('language-dropdown');
        const button = document.getElementById('language-btn');

        dropdown.classList.add('hidden');
        if (button) {
            button.focus();
        }
    }

    /**
     * Initialize focus management
     */
    initializeFocusManagement() {
        // Focus outline for keyboard users only
        this.initializeFocusOutline();

        // Auto-focus management for sections
        this.initializeSectionFocus();
    }

    /**
     * Initialize focus outline for keyboard users
     */
    initializeFocusOutline() {
        let isKeyboardUser = false;

        // Detect keyboard vs mouse usage
        document.addEventListener('keydown', () => {
            isKeyboardUser = true;
            document.body.classList.add('keyboard-navigation');
        });

        document.addEventListener('mousedown', () => {
            isKeyboardUser = false;
            document.body.classList.remove('keyboard-navigation');
        });

        // Initial focus management
        document.addEventListener('DOMContentLoaded', () => {
            // Skip to main content link gets initial focus if present
            const skipLink = document.querySelector('.skip-link');
            if (skipLink && window.location.hash === '#main-content') {
                skipLink.focus();
            }
        });
    }

    /**
     * Initialize section focus management
     */
    initializeSectionFocus() {
        // Focus section headings when navigating via anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Find the heading in the target section
                    const heading = targetElement.querySelector('h1, h2, h3, h4, h5, h6');
                    if (heading) {
                        // Focus the heading after a brief delay to allow scrolling
                        setTimeout(() => {
                            heading.focus();
                            heading.style.outline = '2px solid #3b82f6';
                            heading.style.outlineOffset = '2px';

                            // Remove outline after animation
                            setTimeout(() => {
                                heading.style.outline = '';
                                heading.style.outlineOffset = '';
                            }, 2000);
                        }, 100);
                    }
                }
            }
        });
    }

    /**
     * Initialize screen reader support
     */
    initializeScreenReaderSupport() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.setAttribute('id', 'sr-live-region');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);

        // Store reference for announcements
        this.liveRegion = liveRegion;

        // Announce page load
        this.announceToScreenReader('Eco-Explorer page loaded. Use Tab to navigate or press H to jump to headings.');
    }

    /**
     * Announce to screen reader
     */
    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                this.liveRegion.textContent = '';
            }, 1000);
        }
    }

    /**
     * Initialize high contrast support
     */
    initializeHighContrastSupport() {
        // Detect high contrast mode
        const detectHighContrast = () => {
            const testElement = document.createElement('div');
            testElement.style.position = 'absolute';
            testElement.style.left = '-9999px';
            testElement.style.color = 'rgb(31, 41, 55)';
            testElement.style.backgroundColor = 'rgb(31, 41, 55)';
            document.body.appendChild(testElement);

            const computedStyle = window.getComputedStyle(testElement);
            const isHighContrast = computedStyle.color === computedStyle.backgroundColor;

            document.body.removeChild(testElement);

            if (isHighContrast) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
        };

        detectHighContrast();
        window.addEventListener('resize', detectHighContrast);
    }

    /**
     * Initialize reduced motion support
     */
    initializeReducedMotionSupport() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        const updateMotionPreference = (mediaQuery) => {
            if (mediaQuery.matches) {
                document.body.classList.add('reduced-motion');
                this.announceToScreenReader('Animations reduced for accessibility preference.');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        };

        updateMotionPreference(prefersReducedMotion);
        prefersReducedMotion.addEventListener('change', updateMotionPreference);
    }

    /**
     * Initialize skip links enhancement
     */
    initializeSkipLinks() {
        const skipLinks = document.querySelectorAll('.skip-link');

        skipLinks.forEach(link => {
            link.addEventListener('focus', () => {
                link.style.transform = 'translateY(0)';
                link.style.opacity = '1';
            });

            link.addEventListener('blur', () => {
                // Keep visible briefly after blur for better UX
                setTimeout(() => {
                    if (!link.matches(':focus')) {
                        link.style.transform = '';
                        link.style.opacity = '';
                    }
                }, 200);
            });
        });
    }

    /**
     * Register service worker for offline functionality
     */
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('🐆 Service Worker: Registered successfully', registration.scope);

                        // Check for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            if (newWorker) {
                                newWorker.addEventListener('statechange', () => {
                                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                        // New content available, show update notification
                                        this.showUpdateNotification();
                                    }
                                });
                            }
                        });
                    })
                    .catch((error) => {
                        console.error('🐆 Service Worker: Registration failed:', error);
                    });
            });
        }
    }

    /**
     * Handle PWA install prompt
     */
    handleInstallPrompt() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            deferredPrompt = e;

            // Show install button or notification
            this.showInstallPrompt(deferredPrompt);
        });

        // Listen for successful installation
        window.addEventListener('appinstalled', (evt) => {
            console.log('🐆 PWA: App was installed successfully');
            deferredPrompt = null;

            // Show success message
            this.showNotification('Eco-Explorer installed successfully! 🐆', 'success');
        });
    }

    /**
     * Show install prompt to user
     */
    showInstallPrompt(deferredPrompt) {
        // Create install notification
        const installNotification = document.createElement('div');
        installNotification.className = 'fixed bottom-4 right-4 z-50 p-4 bg-slate-800 border border-blue-500 rounded-lg shadow-lg max-w-sm';
        installNotification.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="text-2xl">🐆</div>
                <div class="flex-1">
                    <h4 class="text-white font-semibold mb-1">Install Eco-Explorer</h4>
                    <p class="text-slate-300 text-sm mb-3">Install as an app for the best experience with offline support!</p>
                    <div class="flex space-x-2">
                        <button id="install-btn" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">
                            Install
                        </button>
                        <button id="dismiss-btn" class="text-slate-400 hover:text-white px-3 py-1 rounded text-sm transition-colors">
                            Not now
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(installNotification);

        // Handle install button click
        document.getElementById('install-btn').addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('🐆 User accepted the install prompt');
                } else {
                    console.log('🐆 User dismissed the install prompt');
                }
                deferredPrompt = null;
                installNotification.remove();
            });
        });

        // Handle dismiss button click
        document.getElementById('dismiss-btn').addEventListener('click', () => {
            installNotification.remove();
        });

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (installNotification.parentNode) {
                installNotification.remove();
            }
        }, 10000);
    }

    /**
     * Show update notification
     */
    showUpdateNotification() {
        const updateNotification = document.createElement('div');
        updateNotification.className = 'fixed top-4 right-4 z-50 p-4 bg-green-600 border border-green-400 rounded-lg shadow-lg max-w-sm';
        updateNotification.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="text-2xl">🔄</div>
                <div class="flex-1">
                    <h4 class="text-white font-semibold mb-1">Update Available</h4>
                    <p class="text-green-100 text-sm mb-3">A new version of Eco-Explorer is available!</p>
                    <button id="update-btn" class="bg-white text-green-600 px-3 py-1 rounded text-sm font-semibold hover:bg-green-50 transition-colors">
                        Update Now
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(updateNotification);

        document.getElementById('update-btn').addEventListener('click', () => {
            // Tell the service worker to skip waiting
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then((registrations) => {
                    registrations.forEach((registration) => {
                        if (registration.waiting) {
                            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                            window.location.reload();
                        }
                    });
                });
            }
            updateNotification.remove();
        });
    }

    /**
     * Add PWA-related event listeners
     */
    addPWAEventListeners() {
        // Listen for online/offline events
        window.addEventListener('online', () => {
            console.log('🐆 Network: Online');
            this.showNotification('Back online! 🌐', 'success');
        });

        window.addEventListener('offline', () => {
            console.log('🐆 Network: Offline');
            this.showNotification('You\'re offline. Some features may not work. 📴', 'info');
        });
    }

    /**
     * Initialize chatbot loading and error states with local development support
     */
    initializeChatbotStates() {
        const gradioApp = document.getElementById('gradio-app');
        const loadingState = document.getElementById('chatbot-loading');
        const errorState = document.getElementById('chatbot-error');
        const fallbackState = document.getElementById('chatbot-fallback');

        if (!gradioApp || !loadingState) return;

        // Check if we're in local development (HTTP)
        const isLocalDevelopment = window.location.protocol === 'http:' && window.location.hostname === 'localhost';

        // Hide loading state when gradio app loads
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if gradio content has loaded
                    const gradioContent = gradioApp.querySelector('gradio-app') || gradioApp.querySelector('[class*="gradio"]');
                    if (gradioContent || gradioApp.children.length > 0) {
                        setTimeout(() => {
                            loadingState.style.display = 'none';
                            gradioApp.style.opacity = '1';
                        }, 1000); // Brief delay to ensure smooth transition
                    }
                }
            });
        });

        observer.observe(gradioApp, { childList: true, subtree: true });

        // Handle loading timeout with smart fallback
        setTimeout(() => {
            if (loadingState.style.display !== 'none') {
                loadingState.style.display = 'none';

                if (isLocalDevelopment) {
                    // Show local development fallback
                    fallbackState.classList.remove('hidden');
                    console.log('🐆 Chatbot: Local development detected - showing fallback');
                } else {
                    // Show error for production
                    errorState.classList.remove('hidden');
                    console.log('🐆 Chatbot: Failed to load in production');
                }

                gradioApp.style.opacity = '1';
            }
        }, 10000); // 10 second timeout for local development

        // Handle gradio app load event
        gradioApp.addEventListener('load', () => {
            console.log('🐆 Chatbot: Successfully loaded');
            setTimeout(() => {
                loadingState.style.display = 'none';
                gradioApp.style.opacity = '1';
            }, 500);
        });

        // Handle gradio app error event
        gradioApp.addEventListener('error', (e) => {
            console.warn('🐆 Chatbot: Load error detected', e);
            loadingState.style.display = 'none';

            if (isLocalDevelopment) {
                fallbackState.classList.remove('hidden');
            } else {
                errorState.classList.remove('hidden');
            }
        });

        // Additional check for iframe content
        gradioApp.addEventListener('DOMContentLoaded', () => {
            console.log('🐆 Chatbot: DOM content loaded');
        });

        // Check for iframe load success
        const checkIframeLoad = () => {
            try {
                const iframe = gradioApp.querySelector('iframe');
                if (iframe) {
                    iframe.addEventListener('load', () => {
                        console.log('🐆 Chatbot: Iframe loaded successfully');
                        setTimeout(() => {
                            loadingState.style.display = 'none';
                            gradioApp.style.opacity = '1';
                        }, 500);
                    });

                    iframe.addEventListener('error', () => {
                        console.warn('🐆 Chatbot: Iframe load error');
                        loadingState.style.display = 'none';
                        if (isLocalDevelopment) {
                            fallbackState.classList.remove('hidden');
                        } else {
                            errorState.classList.remove('hidden');
                        }
                    });
                }
            } catch (e) {
                console.warn('🐆 Chatbot: Could not check iframe', e);
            }
        };

        // Check after a brief delay
        setTimeout(checkIframeLoad, 2000);
    }

    /**
     * Handle newsletter signup form submission
     */
    handleNewsletterSignup(form) {
        const submitBtn = document.getElementById('newsletter-submit-btn');
        const successMessage = document.getElementById('newsletter-success');

        // Get form data
        const formData = new FormData(form);
        const email = formData.get('email');
        const name = formData.get('name') || '';
        const interests = formData.getAll('interests');

        // Basic validation
        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return false;
        }

        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span><span class="ml-2">Joining...</span>';
        }

        // Track signup event
        this.trackEvent('newsletter', 'signup', 'conservation_community');

        // Simulate form submission (replace with actual Netlify form handling)
        setTimeout(() => {
            if (successMessage) {
                // Generate referral link
                const referralLink = this.generateReferralLink(name, email);
                const referralInput = document.getElementById('generated-referral-link');
                const previewInput = document.getElementById('referral-preview');

                if (referralInput) {
                    referralInput.value = referralLink;
                }
                if (previewInput) {
                    previewInput.textContent = `Example: ${referralLink}`;
                }

                successMessage.classList.remove('hidden');
                form.reset();

                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Update referral preview in newsletter form
                const newsletterPreview = document.getElementById('referral-preview');
                if (newsletterPreview) {
                    newsletterPreview.textContent = `Example: ${referralLink}`;
                }
            }

            // Reset button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg><span class="ml-3">Join the Mission</span>';
            }

            this.showNotification('Welcome to the Eco-Explorer community!', 'success');
        }, 1500);

        return false; // Prevent default form submission for demo
    }

    /**
     * Validate email address
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Generate unique referral link
     */
    generateReferralLink(name, email) {
        // Create a simple hash from email for demo purposes
        let hash = 0;
        for (let i = 0; i < email.length; i++) {
            const char = email.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }

        const referralCode = Math.abs(hash).toString(36).substring(0, 8);
        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}?ref=${referralCode}`;
    }

    /**
     * Handle referral link sharing
     */
    shareReferralLink(referralLink) {
        if (navigator.share) {
            // Use native sharing on mobile
            navigator.share({
                title: 'Join Eco-Explorer & Help Save Jaguars!',
                text: 'Every friend you invite plants a real tree in the Amazon. Join our conservation adventure!',
                url: referralLink
            });
        } else {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(referralLink).then(() => {
                this.showNotification('Referral link copied to clipboard!', 'success');
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = referralLink;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showNotification('Referral link copied to clipboard!', 'success');
            });
        }
    }

    /**
     * Initialize live activity feed
     */
    initializeLiveActivityFeed() {
        const activityFeed = document.getElementById('live-activity-feed');
        if (!activityFeed) return;

        // Array of sample activities
        const activities = [
            {
                icon: '🐆',
                iconBg: 'bg-emerald-500',
                text: 'Sarah T. just planted 5 trees through referrals!',
                time: '5 minutes ago'
            },
            {
                icon: '🎓',
                iconBg: 'bg-blue-500',
                text: 'Dr. Chen\'s class achieved 100% completion on jaguar ecology module',
                time: '12 minutes ago'
            },
            {
                icon: '🔬',
                iconBg: 'bg-purple-500',
                text: 'New research data collected from 15 active tracking stations',
                time: '18 minutes ago'
            },
            {
                icon: '👥',
                iconBg: 'bg-orange-500',
                text: 'Community challenge completed: 50 members tracked jaguar sightings this month',
                time: '25 minutes ago'
            },
            {
                icon: '🌱',
                iconBg: 'bg-green-500',
                text: 'Maria S. reached 200 trees planted milestone!',
                time: '32 minutes ago'
            },
            {
                icon: '📚',
                iconBg: 'bg-indigo-500',
                text: 'New educational module released: Amazon Rainforest Conservation',
                time: '38 minutes ago'
            },
            {
                icon: '🏆',
                iconBg: 'bg-yellow-500',
                text: 'Weekly leaderboard updated - congratulations to all participants!',
                time: '45 minutes ago'
            },
            {
                icon: '🌍',
                iconBg: 'bg-teal-500',
                text: 'International collaboration: Brazilian and Peruvian teams connected',
                time: '52 minutes ago'
            }
        ];

        let currentIndex = 0;

        // Function to update activity feed
        const updateActivityFeed = () => {
            // Remove fade-out class from all items
            const items = activityFeed.querySelectorAll('.activity-item');
            items.forEach(item => item.classList.remove('opacity-100'));
            items.forEach(item => item.classList.add('opacity-0'));

            // After fade out, update content
            setTimeout(() => {
                // Clear current content
                activityFeed.innerHTML = '';

                // Add next 4 activities
                for (let i = 0; i < 4; i++) {
                    const activityIndex = (currentIndex + i) % activities.length;
                    const activity = activities[activityIndex];

                    const activityElement = document.createElement('div');
                    activityElement.className = 'flex items-start space-x-3 p-3 bg-slate-800/30 rounded-lg activity-item opacity-0 transition-opacity duration-500';
                    activityElement.innerHTML = `
                        <div class="w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center flex-shrink-0">
                            <span class="text-xs">${activity.icon}</span>
                        </div>
                        <div class="flex-1">
                            <p class="text-slate-300 text-sm">${activity.text}</p>
                            <p class="text-slate-400 text-xs">${activity.time}</p>
                        </div>
                    `;

                    activityFeed.appendChild(activityElement);
                }

                // Fade in new items
                setTimeout(() => {
                    const newItems = activityFeed.querySelectorAll('.activity-item');
                    newItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.remove('opacity-0');
                            item.classList.add('opacity-100');
                        }, index * 200);
                    });
                }, 100);

                currentIndex = (currentIndex + 1) % activities.length;
            }, 300);
        };

        // Update every 8 seconds
        updateActivityFeed(); // Initial call
        setInterval(updateActivityFeed, 8000);
    }

    /**
     * Initialize game integration features
     */
    initializeGameIntegration() {
        // Track game download events
        this.trackGameDownloads();

        // Add installation guides
        this.initializeInstallationGuides();

        // Add platform-specific features
        this.initializePlatformDetection();

        // Initialize live activity feed
        this.initializeLiveActivityFeed();
    }

    /**
     * Track game download and play events
     */
    trackGameDownloads() {
        // Track download button clicks
        const downloadButtons = document.querySelectorAll('[data-track*="download"], [data-track*="play"]');
        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const trackId = e.currentTarget.getAttribute('data-track');
                this.trackEvent('game_interaction', 'click', trackId);

                // Add platform info to tracking
                const platform = this.detectPlatform();
                this.trackEvent('game_download', platform, trackId);
            });
        });
    }

    /**
     * Detect user's platform for analytics
     */
    detectPlatform() {
        const ua = navigator.userAgent.toLowerCase();

        if (ua.includes('windows')) return 'windows';
        if (ua.includes('macintosh') || ua.includes('mac os x')) return 'macos';
        if (ua.includes('linux')) return 'linux';
        if (ua.includes('android')) return 'android';
        if (ua.includes('iphone') || ua.includes('ipad')) return 'ios';

        return 'unknown';
    }

    /**
     * Initialize installation guides based on platform
     */
    initializeInstallationGuides() {
        const platform = this.detectPlatform();
        const installGuide = document.getElementById('install-guide');

        if (installGuide) {
            let guideContent = '';

            switch (platform) {
                case 'windows':
                    guideContent = `
                        <h4>Windows Installation</h4>
                        <ol>
                            <li>Download the .exe file from the link above</li>
                            <li>Run the installer as administrator</li>
                            <li>Follow the installation wizard</li>
                            <li>Launch Eco-Explorer from your desktop or start menu</li>
                        </ol>
                    `;
                    break;
                case 'macos':
                    guideContent = `
                        <h4>macOS Installation</h4>
                        <ol>
                            <li>Download the .dmg file from the link above</li>
                            <li>Open the downloaded file</li>
                            <li>Drag Eco-Explorer to your Applications folder</li>
                            <li>Launch from Applications or Spotlight</li>
                        </ol>
                    `;
                    break;
                default:
                    guideContent = `
                        <h4>Installation Guide</h4>
                        <ol>
                            <li>Download the appropriate file for your operating system</li>
                            <li>Run the installer and follow the on-screen instructions</li>
                            <li>Launch Eco-Explorer from your applications menu</li>
                            <li>Enjoy your conservation adventure!</li>
                        </ol>
                    `;
            }

            installGuide.innerHTML = guideContent;
        }
    }

    /**
     * Initialize platform-specific features
     */
    initializePlatformDetection() {
        const platform = this.detectPlatform();

        // Add platform-specific messaging
        const platformMessage = document.getElementById('platform-message');
        if (platformMessage) {
            let message = '';

            switch (platform) {
                case 'windows':
                    message = '💻 Optimized for Windows - Best performance with DirectX';
                    break;
                case 'macos':
                    message = '🍎 Native macOS support - Optimized for Apple Silicon';
                    break;
                case 'linux':
                    message = '🐧 Linux compatible - Runs on most distributions';
                    break;
                case 'android':
                case 'ios':
                    message = '📱 Mobile version available - Play in your browser!';
                    break;
                default:
                    message = '🎮 Cross-platform game - Works on Windows, macOS, and Linux';
            }

            platformMessage.textContent = message;
        }

        // Log platform detection for analytics
        this.trackEvent('platform_detection', platform, 'page_load');
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

// Global function for chatbot retry
window.retryChatbot = function() {
    const errorState = document.getElementById('chatbot-error');
    const loadingState = document.getElementById('chatbot-loading');
    const fallbackState = document.getElementById('chatbot-fallback');
    const gradioApp = document.getElementById('gradio-app');

    if (errorState && loadingState && gradioApp) {
        // Hide all states first
        errorState.classList.add('hidden');
        fallbackState.classList.add('hidden');

        // Show loading
        loadingState.style.display = 'flex';
        gradioApp.style.opacity = '0';

        // Reload the gradio app by recreating it
        const container = document.getElementById('chatbot-container');
        const newGradioApp = gradioApp.cloneNode(true);
        container.replaceChild(newGradioApp, gradioApp);

        // Re-initialize chatbot states for the new element
        setTimeout(() => {
            window.mainApp.initializeChatbotStates();
        }, 100);
    }
};

// Global function to show chatbot fallback manually
window.showChatbotFallback = function() {
    const fallbackState = document.getElementById('chatbot-fallback');
    const loadingState = document.getElementById('chatbot-loading');

    if (fallbackState && loadingState) {
        loadingState.style.display = 'none';
        fallbackState.classList.remove('hidden');
        console.log('🐆 Chatbot: Showing fallback manually');
    }
};

// Global function for game platform detection
window.detectGamePlatform = function() {
    return window.mainApp ? window.mainApp.detectPlatform() : 'unknown';
};

// Global function to track game interactions
window.trackGameInteraction = function(action, label) {
    if (window.mainApp) {
        window.mainApp.trackEvent('game_interaction', action, label);
    }
};

// Global function to copy referral link
window.copyReferralLink = function() {
    const referralInput = document.getElementById('generated-referral-link');
    if (referralInput && referralInput.value) {
        if (window.mainApp) {
            window.mainApp.shareReferralLink(referralInput.value);
        }
    } else {
        if (window.mainApp) {
            window.mainApp.showNotification('Please sign up first to get your referral link!', 'info');
        }
    }
};

// Create global instance
window.mainApp = new MainApp();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Performance mark for DOM ready
    window.markPerformance('dom_content_loaded');

    window.mainApp.initialize();
    window.mainApp.handleURLParameters();
    window.mainApp.initializeParticles();
    window.mainApp.initializeFloatingShapes();

    // Re-translate once DOM-ready for late mounts
    if (window.i18n && typeof window.i18n.translatePageWithTransition === 'function') {
        window.i18n.translatePageWithTransition();
    }

    // Show PWA capabilities after a brief delay
    setTimeout(() => {
        if ('serviceWorker' in navigator) {
            console.log('🐆 PWA: Service Worker supported');
        }
        if ('caches' in window) {
            console.log('🐆 PWA: Caching supported');
        }
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('🐆 PWA: Running in standalone mode');
        }
    }, 2000);
});

// Performance mark for page load complete
window.addEventListener('load', () => {
    window.markPerformance('page_load_complete');
    window.measurePerformance('dom_to_load', 'dom_content_loaded', 'page_load_complete');
});

// Track first paint and first contentful paint
if ('PerformanceObserver' in window) {
    try {
        // First Contentful Paint
        const fcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.name === 'first-contentful-paint') {
                    console.log('🎨 First Contentful Paint:', entry.startTime.toFixed(2), 'ms');
                    if (window.gtag && window.ecoExplorerAnalytics.consentGiven) {
                        window.gtag('event', 'web_vitals', {
                            event_category: 'performance',
                            event_label: 'FCP',
                            value: Math.round(entry.startTime)
                        });
                    }
                }
            });
        });
        fcpObserver.observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('📐 Largest Contentful Paint:', lastEntry.startTime.toFixed(2), 'ms');
            if (window.gtag && window.ecoExplorerAnalytics.consentGiven) {
                window.gtag('event', 'web_vitals', {
                    event_category: 'performance',
                    event_label: 'LCP',
                    value: Math.round(lastEntry.startTime)
                });
            }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    } catch (e) {
        console.warn('Web Vitals tracking failed:', e);
    }
} 