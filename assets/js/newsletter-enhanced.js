// Enhanced Newsletter Implementation
class NewsletterManager {
    constructor() {
        this.form = document.getElementById('newsletter-form');
        this.statusEl = document.getElementById('form-status');
        this.submitBtn = document.getElementById('newsletter-submit-btn');
        this.referralSection = document.getElementById('referral-section');
        this.referralLink = document.getElementById('referral-link');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            this.generateCSRFToken();
            this.setupReferralTracking();
        }
    }

    generateCSRFToken() {
        const token = Math.random().toString(36).substring(2, 15);
        const csrfInput = document.getElementById('csrf-token') || document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrf-token';
        csrfInput.id = 'csrf-token';
        csrfInput.value = token;
        if (!document.getElementById('csrf-token')) {
            this.form.appendChild(csrfInput);
        }
        sessionStorage.setItem('csrf', token);
    }

    setupReferralTracking() {
        // Check for referral in URL
        const urlParams = new URLSearchParams(window.location.search);
        const referralCode = urlParams.get('ref');

        if (referralCode) {
            sessionStorage.setItem('referrer', referralCode);
            // Track referral visit
            if (window.gtag) {
                gtag('event', 'referral_visit', {
                    referral_code: referralCode
                });
            }
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) return;

        const formData = new FormData(this.form);

        try {
            this.setLoading(true);

            // Add referrer if present
            const referrer = sessionStorage.getItem('referrer');
            if (referrer) {
                formData.append('referrer', referrer);
            }

            const response = await fetch('/api/newsletter', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-Token': sessionStorage.getItem('csrf')
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.showSuccess(data);
                this.form.reset();
                this.handleReferral(data);
            } else {
                throw new Error('Subscription failed');
            }
        } catch (error) {
            console.error('Newsletter error:', error);
            this.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }

    validateForm() {
        const email = this.form.email.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            return false;
        }

        return true;
    }

    showSuccess(data) {
        this.statusEl.className = 'status-message success';
        this.statusEl.setAttribute('aria-live', 'polite');
        this.statusEl.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span data-translate="checkEmailWelcome">Check your email for a welcome message!</span>
            </div>
        `;

        // Track successful signup
        if (window.gtag) {
            gtag('event', 'newsletter_signup', {
                event_category: 'engagement',
                event_label: 'newsletter'
            });
        }
    }

    showError(message) {
        this.statusEl.className = 'status-message error';
        this.statusEl.setAttribute('aria-live', 'assertive');
        this.statusEl.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <span>Error: ${message}</span>
            </div>
        `;
    }

    showFieldError(field, message) {
        const input = this.form[field];
        const errorEl = document.getElementById(`${field}-error`) || document.createElement('div');
        errorEl.id = `${field}-error`;
        errorEl.className = 'error-message';
        errorEl.setAttribute('role', 'alert');
        errorEl.textContent = message;

        if (!document.getElementById(`${field}-error`)) {
            input.parentNode.appendChild(errorEl);
        }

        input.setAttribute('aria-invalid', 'true');
        input.focus();
    }

    setLoading(loading) {
        this.submitBtn.disabled = loading;
        this.submitBtn.innerHTML = loading ? `
            <div class="flex items-center space-x-2">
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span data-translate="subscribing">Subscribing...</span>
            </div>
        ` : `
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span data-translate="joinTheMission">Join the Mission</span>
            </div>
        `;
    }

    handleReferral(data) {
        if (data && data.referralCode) {
            // Generate unique referral link
            const referralUrl = `${window.location.origin}?ref=${data.referralCode}`;
            this.referralLink.value = referralUrl;

            // Show referral section
            if (this.referralSection) {
                this.referralSection.classList.remove('hidden');
                this.setupShareButtons(referralUrl);
            }

            // Store referral code
            localStorage.setItem('referralCode', data.referralCode);
        }
    }

    setupShareButtons(url) {
        const message = 'Join me in protecting jaguars with Eco-Explorer!';

        // Twitter/X share
        const twitterBtn = document.getElementById('share-twitter');
        if (twitterBtn) {
            twitterBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`;
        }

        // Facebook share
        const fbBtn = document.getElementById('share-facebook');
        if (fbBtn) {
            fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        }

        // Copy button
        const copyBtn = document.getElementById('copy-referral');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(url).then(() => {
                    this.showCopySuccess();
                });
            });
        }
    }

    showCopySuccess() {
        const copyBtn = document.getElementById('copy-referral');
        if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.innerHTML = `
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span data-translate="copied">Copied!</span>
            `;
            copyBtn.classList.add('success');

            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('success');
            }, 2000);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NewsletterManager();
});
