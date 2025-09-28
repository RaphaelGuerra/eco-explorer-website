/**
 * Unified Language Switcher Component for Eco-Explorer
 * Provides a consistent dropdown language switcher
 */

class LanguageSwitcher {
    constructor() {
        this.isInitialized = false;
        this.dropdown = null;
        this.button = null;
    }

    /**
     * Initialize the language switcher
     */
    initialize() {
        if (this.isInitialized) return;

        // Wait for i18n to be ready
        if (!window.i18n) {
            setTimeout(() => this.initialize(), 100);
            return;
        }

        this.createLanguageSwitcher();
        this.bindEvents();
        this.bindGlobalLanguageLinks();
        this.ensureMobileSelector();
        this.isInitialized = true;
    }

    /**
     * Create the language switcher HTML
     */
    createLanguageSwitcher() {
        // Strategy: if an existing button/dropdown is present in desktop header, replace it.
        // Additionally, leave any `.mobile-lang-selector` anchors in place and handle clicks globally.
        const desktopBtn = document.getElementById('language-btn');
        const desktopDropdown = document.getElementById('language-dropdown');

        if (desktopBtn && desktopDropdown) {
            const parent = desktopBtn.parentElement;
            const newSwitcher = this.createSwitcherHTML();
            parent.replaceChild(newSwitcher, desktopBtn);
            desktopDropdown.remove();
            return;
        }

        // Fallback: add to desktop header nav
        const header = document.querySelector('header nav[aria-label="Main navigation"]');
        if (header) {
            const newSwitcher = this.createSwitcherHTML();
            header.appendChild(newSwitcher);
        }
    }

    /**
     * Create the language switcher HTML structure
     */
    createSwitcherHTML() {
        const container = document.createElement('div');
        container.className = 'language-switcher';
        
        const button = document.createElement('button');
        button.className = 'language-btn';
        button.id = 'language-btn';
        button.innerHTML = `
            <span id="current-lang">EN</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        `;

        const dropdown = document.createElement('div');
        dropdown.className = 'language-dropdown';
        dropdown.id = 'language-dropdown';

        // Add language options
        const languages = window.i18n.getSupportedLanguages();
        const languageNames = window.i18n.getLanguageNames();

        languages.forEach(lang => {
            const option = document.createElement('button');
            option.className = 'language-option';
            option.setAttribute('data-lang', lang);
            // Use textContent to avoid HTML injection risk
            option.textContent = languageNames[lang];
            dropdown.appendChild(option);
        });

        container.appendChild(button);
        container.appendChild(dropdown);

        return container;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        this.button = document.getElementById('language-btn');
        this.dropdown = document.getElementById('language-dropdown');

        if (!this.button || !this.dropdown) return;

        // Toggle dropdown
        this.button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.closeDropdown();
        });

        // Prevent dropdown from closing when clicking inside it
        this.dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Handle language selection
        this.dropdown.addEventListener('click', (e) => {
            if (e.target.classList.contains('language-option')) {
                const selectedLang = e.target.getAttribute('data-lang');
                this.changeLanguage(selectedLang);
                this.closeDropdown();
            }
        });

        // Close dropdown with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDropdown();
            }
        });
    }

    /**
     * Toggle dropdown visibility
     */
    toggleDropdown() {
        this.dropdown.classList.toggle('show');
    }

    /**
     * Close dropdown
     */
    closeDropdown() {
        this.dropdown.classList.remove('show');
    }

    /**
     * Change language
     */
    async changeLanguage(lang) {
        if (window.i18n) {
            await window.i18n.setLanguage(lang);
            // Ensure all nodes update immediately
            if (typeof window.i18n.translatePageWithTransition === 'function') {
                window.i18n.translatePageWithTransition();
            }
        }
    }

    /**
     * Update the switcher display
     */
    updateDisplay() {
        if (!this.button) return;

        const currentLang = window.i18n?.getCurrentLanguage() || 'en';
        const currentLangSpan = this.button.querySelector('#current-lang');
        
        if (currentLangSpan) {
            currentLangSpan.textContent = currentLang.toUpperCase();
        }

        // Update active state
        const options = this.dropdown?.querySelectorAll('.language-option');
        options?.forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === currentLang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    /**
     * Bind global language link handlers (for mobile simple links)
     */
    bindGlobalLanguageLinks() {
        document.addEventListener('click', (e) => {
            // Let the dedicated dropdown handler manage its own clicks
            if (e.target.closest('.language-dropdown')) return;
            const target = e.target.closest('[data-lang]');
            if (!target) return;
            const lang = target.getAttribute('data-lang');
            if (!lang) return;
            e.preventDefault();
            this.changeLanguage(lang);

            // If inside mobile menu, close it for better UX
            const mobileMenu = document.getElementById('mobile-menu');
            const menuBtn = document.getElementById('menu-btn');
            if (mobileMenu && mobileMenu.contains(target)) {
                mobileMenu.classList.add('hidden');
                menuBtn?.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /**
     * Ensure a mobile language selector exists in the mobile menu
     */
    ensureMobileSelector() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (!mobileMenu) return;
        let mobileSelector = mobileMenu.querySelector('.mobile-lang-selector');
        if (!mobileSelector) {
            // Create a simple inline selector block
            const divider = document.createElement('div');
            divider.className = 'border-t border-slate-700 my-2';

            mobileSelector = document.createElement('div');
            mobileSelector.className = 'flex justify-center space-x-4 py-2 text-slate-400 mobile-lang-selector';
            const langs = ['en','pt','es','fr'];
            langs.forEach(l => {
                const a = document.createElement('a');
                a.href = '#';
                a.setAttribute('data-lang', l);
                a.textContent = l.toUpperCase();
                a.className = 'hover:text-white transition-colors';
                mobileSelector.appendChild(a);
            });

            mobileMenu.appendChild(divider);
            mobileMenu.appendChild(mobileSelector);
        }

        // Update active state according to current language
        const currentLang = window.i18n?.getCurrentLanguage?.() || 'en';
        mobileMenu.querySelectorAll('.mobile-lang-selector [data-lang]').forEach(el => {
            el.classList.toggle('active', el.getAttribute('data-lang') === currentLang);
        });
    }
}

// Create global instance
window.languageSwitcher = new LanguageSwitcher();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageSwitcher.initialize();
});

// Update display when i18n changes
document.addEventListener('languageChanged', () => {
    window.languageSwitcher.updateDisplay();
}); 
