// Eco-Explorer Language Switcher
document.addEventListener('DOMContentLoaded', function() {
    const languageBtn = document.getElementById('language-btn');
    const languageDropdown = document.getElementById('language-dropdown');
    
    // Toggle dropdown
    if (languageBtn && languageDropdown) {
        languageBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            languageDropdown.classList.add('hidden');
        });
        
        // Prevent dropdown from closing when clicking inside it
        languageDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Handle language selection
        languageDropdown.addEventListener('click', function(e) {
            if (e.target.hasAttribute('data-lang')) {
                const selectedLang = e.target.getAttribute('data-lang');
                translatePageWithTransition(selectedLang);
                languageDropdown.classList.add('hidden');
            }
        });
    }
    
    // Add smooth transition for language changes
    const style = document.createElement('style');
    style.textContent = `
        [data-translate] {
            transition: opacity 0.3s ease;
        }
        .language-transition {
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);
});

// Enhanced translate function with smooth transitions
function translatePageWithTransition(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    
    // Add transition class
    elements.forEach(el => el.classList.add('language-transition'));
    
    // Translate after a brief delay
    setTimeout(() => {
        translatePage(lang);
        
        // Remove transition class
        setTimeout(() => {
            elements.forEach(el => el.classList.remove('language-transition'));
        }, 100);
    }, 150);
} 