// BharatAI Application JavaScript

class BharatAI {
    constructor() {
        this.currentUser = null;
        this.isChatbotOpen = false;
        this.init();
    }

    init() {
        // Ensure DOM is ready before setting up event listeners
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.checkAuthState();
            });
        } else {
            this.setupEventListeners();
            this.checkAuthState();
        }
    }

    setupEventListeners() {
        // Login form - with better error handling
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
            console.log('Login form event listener attached');
        } else {
            console.error('Login form not found');
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Tab navigation
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Chatbot toggle
        const chatbotToggle = document.getElementById('chatbotToggle');
        if (chatbotToggle) {
            chatbotToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleChatbot();
            });
        }

        // Close chatbot
        const closeChatbot = document.getElementById('closeChatbot');
        if (closeChatbot) {
            closeChatbot.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeChatbot();
            });
        }

        // Send message
        const sendMessage = document.getElementById('sendMessage');
        const chatInput = document.getElementById('chatInput');
        
        if (sendMessage) {
            sendMessage.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    checkAuthState() {
        // For this demo, always show login first
        this.showLogin();
    }

    handleLogin(e) {
        console.log('Login handler called');
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('Login attempt:', { username, password });

        // Simple validation for demo credentials
        if (username === 'demo' && password === 'bharatai123') {
            console.log('Login successful');
            this.currentUser = { username: username };
            this.showDashboard();
            this.showWelcomeMessage();
        } else {
            console.log('Login failed');
            this.showError('Invalid credentials. Use demo/bharatai123');
        }
    }

    handleLogout() {
        this.currentUser = null;
        this.showLogin();
        this.closeChatbot();
    }

    showLogin() {
        const loginPage = document.getElementById('loginPage');
        const dashboard = document.getElementById('dashboard');
        
        if (loginPage) {
            loginPage.classList.remove('hidden');
            loginPage.style.display = 'flex';
        }
        if (dashboard) {
            dashboard.classList.add('hidden');
            dashboard.style.display = 'none';
        }
        
        // Clear form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.reset();
    }

    showDashboard() {
        const loginPage = document.getElementById('loginPage');
        const dashboard = document.getElementById('dashboard');
        
        if (loginPage) {
            loginPage.classList.add('hidden');
            loginPage.style.display = 'none';
        }
        if (dashboard) {
            dashboard.classList.remove('hidden');
            dashboard.style.display = 'flex';
        }
    }

    showError(message) {
        // Remove existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create new error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message status status--error';
        errorDiv.style.marginTop = 'var(--space-16)';
        errorDiv.style.textAlign = 'center';
        errorDiv.textContent = message;
        
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.appendChild(errorDiv);
        }
        
        // Remove error after 4 seconds
        setTimeout(() => {
            if (errorDiv && errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 4000);
    }

    showWelcomeMessage() {
        // Show a brief welcome animation or message
        const welcomeText = document.querySelector('.welcome-text');
        if (welcomeText) {
            welcomeText.style.transition = 'opacity 0.3s ease';
            welcomeText.style.opacity = '0';
            setTimeout(() => {
                welcomeText.textContent = `Welcome, ${this.currentUser.username}!`;
                welcomeText.style.opacity = '1';
            }, 300);
        }
    }

    switchTab(tabName) {
        if (!tabName) return;
        
        // Remove active class from all tabs and content
        const allTabButtons = document.querySelectorAll('.tab-btn');
        const allTabContent = document.querySelectorAll('.tab-content');
        
        allTabButtons.forEach(btn => btn.classList.remove('active'));
        allTabContent.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        const activeTabButton = document.querySelector(`[data-tab="${tabName}"]`);
        const activeTabContent = document.getElementById(tabName);
        
        if (activeTabButton) activeTabButton.classList.add('active');
        if (activeTabContent) activeTabContent.classList.add('active');
    }

    toggleChatbot() {
        const chatbot = document.getElementById('chatbot');
        if (chatbot) {
            if (this.isChatbotOpen) {
                this.closeChatbot();
            } else {
                this.openChatbot();
            }
        }
    }

    openChatbot() {
        const chatbot = document.getElementById('chatbot');
        if (chatbot) {
            chatbot.classList.remove('hidden');
            chatbot.style.display = 'flex';
            this.isChatbotOpen = true;
        }
    }

    closeChatbot() {
        const chatbot = document.getElementById('chatbot');
        if (chatbot) {
            chatbot.classList.add('hidden');
            chatbot.style.display = 'none';
            this.isChatbotOpen = false;
        }
    }

    sendMessage() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput) return;
        
        const message = chatInput.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            chatInput.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                const botResponse = this.getBotResponse(message);
                this.addMessage(botResponse, 'bot');
            }, 1000);
        }
    }

    addMessage(message, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = message;
        messageDiv.appendChild(messageParagraph);
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Simple response logic
        if (message.includes('hello') || message.includes('hi') || message.includes('namaste')) {
            return 'Namaste! How can I assist you today?';
        } else if (message.includes('news')) {
            return 'You can find the latest news in the News tab. It covers technology, economy, and cultural updates from India.';
        } else if (message.includes('education')) {
            return 'Check out the Education tab for information about digital learning initiatives and higher education reforms in India.';
        } else if (message.includes('finance') || message.includes('market')) {
            return 'Visit the Finance tab to see current market data including Sensex, Nifty 50, and currency rates.';
        } else if (message.includes('sports')) {
            return 'The Sports tab has updates on cricket, Olympic preparations, and traditional Indian sports.';
        } else if (message.includes('astrology')) {
            return 'Explore the Astrology tab for Vedic astrology insights and festival calendar information.';
        } else if (message.includes('science')) {
            return 'The Science tab covers ISRO missions, medical research, and technology innovations from India.';
        } else if (message.includes('business')) {
            return 'Check the Business tab for startup ecosystem updates, manufacturing growth, and digital payment trends.';
        } else if (message.includes('history')) {
            return 'The History tab showcases Indian heritage, from ancient civilizations to the freedom movement.';
        } else if (message.includes('help')) {
            return 'I can help you navigate through different tabs: News, Education, Finance, Sports, Astrology, Science, Business, and History. What would you like to know about?';
        } else if (message.includes('weather')) {
            return 'Weather information is available through our regional news updates. Check the News tab for current conditions.';
        } else if (message.includes('time') || message.includes('date')) {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            const timeStr = now.toLocaleTimeString('en-IN');
            return `Today is ${dateStr}, and the current time is ${timeStr}.`;
        } else if (message.includes('thank')) {
            return 'You\'re welcome! I\'m here to help you explore India through BharatAI.';
        } else if (message.includes('bye') || message.includes('goodbye')) {
            return 'Goodbye! Feel free to ask if you need any assistance. Jai Hind! 🇮🇳';
        } else {
            const responses = [
                'That\'s interesting! You can explore more information in our different tabs.',
                'I\'m here to help you navigate BharatAI. Try checking out our various sections!',
                'For specific information, please visit the relevant tab - News, Education, Finance, Sports, Astrology, Science, Business, or History.',
                'BharatAI covers many aspects of India. Which section would you like to explore?',
                'I can guide you through different topics. What interests you most about India?'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
}

// Global app instance
let bharatAI;

// Initialize the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        bharatAI = new BharatAI();
        console.log('BharatAI application initialized');
    });
} else {
    bharatAI = new BharatAI();
    console.log('BharatAI application initialized');
}

// Additional utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification status status--${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = 'var(--space-16)';
    notification.style.right = 'var(--space-16)';
    notification.style.zIndex = '9999';
    notification.style.padding = 'var(--space-12) var(--space-16)';
    notification.style.borderRadius = 'var(--radius-base)';
    notification.style.boxShadow = 'var(--shadow-lg)';
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.parentNode.removeChild(notification);
            }, 300);
        }
    }, 3000);
}

// Handle any JavaScript errors gracefully
window.addEventListener('error', (e) => {
    console.error('BharatAI Error:', e.error);
    // Don't show error to user in production, but log it
});

// Simple performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`BharatAI loaded in ${Math.round(loadTime)}ms`);
});