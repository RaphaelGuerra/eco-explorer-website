// Enhanced Chatbot Implementation with Error Handling
class ChatbotManager {
    constructor() {
        this.container = document.getElementById('chatbot-container');
        this.wrapper = document.getElementById('chatbot-wrapper');
        this.loading = document.getElementById('chatbot-loading');
        this.error = document.getElementById('chatbot-error');
        this.fallback = document.getElementById('chatbot-fallback');
        this.retryCount = 0;
        this.maxRetries = 3;
        this.isLoading = false;

        this.init();
    }

    async init() {
        // Lazy load chatbot when user scrolls near it
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.isLoading) {
                        this.loadChatbot();
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '100px' // Start loading 100px before visible
            });

            if (this.container) {
                observer.observe(this.container);
            }
        } else {
            // Fallback for browsers without IntersectionObserver
            this.loadChatbot();
        }
    }

    async loadChatbot() {
        this.isLoading = true;

        try {
            this.showElement(this.loading);

            // Set timeout for loading
            const timeout = setTimeout(() => {
                throw new Error('Chatbot loading timeout');
            }, 15000); // 15 second timeout

            // Check if Gradio script is loaded
            await this.waitForGradio();

            // Check if HuggingFace Space is accessible
            await this.checkSpaceHealth();

            clearTimeout(timeout);

            // Show chatbot
            this.hideElement(this.loading);
            this.showElement(this.wrapper);

            // Monitor for errors
            this.monitorChatbot();

        } catch (error) {
            console.error('Failed to load chatbot:', error);
            this.handleError();
        } finally {
            this.isLoading = false;
        }
    }

    waitForGradio() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds

            const checkGradio = setInterval(() => {
                attempts++;

                if (window.gradio || document.querySelector('gradio-app')) {
                    clearInterval(checkGradio);
                    resolve();
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkGradio);
                    reject(new Error('Gradio failed to load'));
                }
            }, 100);
        });
    }

    async checkSpaceHealth() {
        try {
            const response = await fetch('https://phaelix-eco-explorer-bot.hf.space/api/health', {
                mode: 'no-cors',
                signal: AbortSignal.timeout(5000)
            });
            return true;
        } catch (error) {
            // If health check fails, still try to load the chatbot
            console.warn('Health check failed, proceeding anyway:', error);
            return true;
        }
    }

    monitorChatbot() {
        const chatbot = document.getElementById('eco-chatbot');

        if (!chatbot) return;

        // Listen for iframe errors
        chatbot.addEventListener('error', () => {
            this.handleError();
        });

        // Check periodically if chatbot is responsive
        this.healthCheck = setInterval(() => {
            this.checkChatbotHealth();
        }, 30000); // Every 30 seconds

        // Listen for iframe load events
        const iframe = chatbot.querySelector('iframe');
        if (iframe) {
            iframe.addEventListener('load', () => {
                console.log('Chatbot iframe loaded successfully');
            });

            iframe.addEventListener('error', () => {
                this.handleError();
            });
        }
    }

    async checkChatbotHealth() {
        try {
            const iframe = this.wrapper?.querySelector('iframe');
            if (iframe && iframe.contentWindow) {
                // Send health check message
                iframe.contentWindow.postMessage({ type: 'health_check' }, '*');
            }
        } catch (error) {
            console.warn('Chatbot health check failed:', error);
        }
    }

    handleError() {
        this.hideElement(this.loading);
        this.hideElement(this.wrapper);

        if (this.retryCount < this.maxRetries) {
            this.showElement(this.error);
        } else {
            // Show fallback FAQ after max retries
            this.showElement(this.fallback);
        }
    }

    async retryLoadChatbot() {
        this.retryCount++;
        this.hideElement(this.error);
        this.hideElement(this.fallback);

        try {
            await this.loadChatbot();
        } catch (error) {
            this.handleError();
        }
    }

    showElement(element) {
        if (element) {
            element.classList.remove('hidden');
            element.style.display = 'block';
        }
    }

    hideElement(element) {
        if (element) {
            element.classList.add('hidden');
            element.style.display = 'none';
        }
    }

    destroy() {
        if (this.healthCheck) {
            clearInterval(this.healthCheck);
        }
    }
}

// Global retry function for button
window.retryLoadChatbot = function() {
    if (window.chatbotManager) {
        window.chatbotManager.retryLoadChatbot();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chatbotManager = new ChatbotManager();
});

// Fallback FAQ data
const fallbackFAQ = [
    {
        question: "How do I track jaguars?",
        answer: "Use the tracking interface to follow GPS signals, analyze footprints, and monitor camera traps to locate jaguars in their natural habitat."
    },
    {
        question: "What makes Eco-Explorer educational?",
        answer: "The game teaches real conservation challenges, environmental decision-making, and the importance of biodiversity through interactive gameplay."
    },
    {
        question: "Is the game free to play?",
        answer: "Yes! Eco-Explorer is completely free to play and helps fund real conservation efforts through partnerships with environmental organizations."
    },
    {
        question: "How does the AI assistant work?",
        answer: "Our AI assistant uses advanced machine learning to help you navigate the rainforest, identify wildlife, and make informed conservation decisions."
    },
    {
        question: "Can I play on mobile devices?",
        answer: "Yes, Eco-Explorer is optimized for both desktop and mobile devices. Download from our website for the best experience."
    }
];

// Populate fallback FAQ
document.addEventListener('DOMContentLoaded', () => {
    const faqContainer = document.getElementById('chatbot-fallback');
    if (faqContainer) {
        const faqList = faqContainer.querySelector('.faq-list');
        if (faqList) {
            fallbackFAQ.forEach((faq, index) => {
                const details = document.createElement('details');
                details.className = 'faq-item';

                const summary = document.createElement('summary');
                summary.className = 'faq-question';
                summary.textContent = faq.question;

                const answer = document.createElement('div');
                answer.className = 'faq-answer';
                answer.textContent = faq.answer;

                details.appendChild(summary);
                details.appendChild(answer);
                faqList.appendChild(details);
            });
        }
    }
});
