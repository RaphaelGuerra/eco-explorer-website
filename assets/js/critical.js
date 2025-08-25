// CRITICAL JS - MINIMAL FUNCTIONALITY UNDER 15KB TOTAL
// Only essential JavaScript for above-the-fold interactions

class CriticalLoader {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupLanguageSwitcher();
        this.setupScrollEffects();
        this.loadRemainingContent();
    }

    // Mobile menu toggle - critical for mobile users
    setupMobileMenu() {
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileBtn && mobileMenu) {
            mobileBtn.addEventListener('click', () => {
                const isHidden = mobileMenu.classList.contains('hidden');
                mobileMenu.classList.toggle('hidden');
                mobileBtn.setAttribute('aria-expanded', !isHidden);
            });
        }
    }

    // Basic language switching - critical for international users
    setupLanguageSwitcher() {
        const languageBtn = document.getElementById('language-btn');
        const languageMenu = document.getElementById('language-menu');

        if (languageBtn && languageMenu) {
            languageBtn.addEventListener('click', () => {
                const isHidden = languageMenu.classList.contains('hidden');
                languageMenu.classList.toggle('hidden');
                languageBtn.setAttribute('aria-expanded', !isHidden);
            });

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!languageBtn.contains(e.target) && !languageMenu.contains(e.target)) {
                    languageMenu.classList.add('hidden');
                    languageBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // Minimal scroll effects for hero section
    setupScrollEffects() {
        let ticking = false;

        const updateScroll = () => {
            const scrolled = window.pageYOffset;
            const header = document.querySelector('header');

            if (header) {
                if (scrolled > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        });
    }

    // Progressive loading of remaining content
    loadRemainingContent() {
        // Load remaining CSS after critical render
        this.loadCSS('assets/css/main.css');

        // Load remaining JavaScript after critical render
        setTimeout(() => {
            this.loadScript('assets/js/i18n.js');
            this.loadScript('assets/js/language-switcher.js');
            this.loadScript('assets/js/main.js');
        }, 100);

        // Load additional sections after hero is visible
        setTimeout(() => {
            this.loadAdditionalSections();
        }, 500);
    }

    // Utility function to load CSS dynamically
    loadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print';
        link.onload = () => {
            link.media = 'all';
        };
        document.head.appendChild(link);
    }

    // Utility function to load scripts dynamically
    loadScript(src) {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        document.head.appendChild(script);
    }

    // Load additional sections progressively
    loadAdditionalSections() {
        const sections = [
            'about-section',
            'features-section',
            'vision-section',
            'game-section',
            'newsletter-section',
            'referral-section',
            'progress-section',
            'community-section'
        ];

        sections.forEach((sectionId, index) => {
            setTimeout(() => {
                this.loadSection(sectionId);
            }, index * 200); // Stagger loading
        });
    }

    // Load individual sections
    loadSection(sectionId) {
        // This would typically fetch HTML from a separate file
        // For now, we'll show a loading indicator
        const placeholder = document.getElementById(`${sectionId}-placeholder`);
        if (placeholder) {
            placeholder.innerHTML = `
                <div class="loading-spinner" aria-hidden="true"></div>
                <span class="sr-only">Loading ${sectionId}...</span>
            `;
        }
    }
}

// Initialize critical functionality when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CriticalLoader());
} else {
    new CriticalLoader();
}

// Performance monitoring - critical for optimization
window.addEventListener('load', () => {
    // Log critical path performance
    if (window.performance) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('🚀 Critical path loaded in:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    }
});
