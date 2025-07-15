# 🐆 Eco-Explorer Website

A wild, blue-toned website for the Eco-Explorer educational gaming project, featuring the elusive onça pintada (jaguar) and an integrated AI chatbot.

## 🌟 Features

- **Wild Blue Theme** - Unique jaguar-inspired design with blue tones
- **AI Chatbot Integration** - Embedded Hugging Face Spaces chatbot
- **Responsive Design** - Works on all devices
- **Jaguar Focus** - Celebrates Brazil's iconic onça pintada
- **Educational Gaming** - Showcases conservation through gaming

## 🚀 Quick Start

### Option 1: Simple HTTP Server (Recommended)
```bash
# Navigate to the website directory
cd eco-explorer-website

# Start the local server
python server.py

# Open your browser to: http://localhost:8000
```

### Option 2: Python Built-in Server
```bash
# Navigate to the website directory
cd eco-explorer-website

# Start Python's built-in server
python -m http.server 8000

# Open your browser to: http://localhost:8000
```

### Option 3: Live Server (VS Code)
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 🔧 Why Use a Server?

The website needs to be served from a proper HTTP server (not just opening the HTML file) because:

1. **CORS Issues** - The Hugging Face chatbot embedding requires proper HTTP headers
2. **Security** - Modern browsers block certain features when opening files directly
3. **Functionality** - The AI chatbot won't work without proper server setup

## 🐆 AI Chatbot

The website embeds the EcoExplorerBot from Hugging Face Spaces:
- **URL**: https://huggingface.co/spaces/Phaelix/eco-explorer-bot
- **Features**: Answers questions about Eco-Explorer, jaguars, conservation, and game mechanics
- **Theme**: Blue-toned interface matching the website

## 🎨 Design Features

- **Jaguar Spots Pattern** - Subtle background pattern inspired by onça pintada
- **Wild Glow Effects** - Animated elements with blue glow
- **Glass Morphism** - Modern glass-like effects
- **Responsive Navigation** - Works on mobile and desktop
- **Gradient Text** - Blue gradient effects throughout

## 📱 Sections

1. **Hero** - Wild introduction with jaguar theme
2. **AI Assistant** - Embedded chatbot for questions
3. **About** - Project overview and technology stack
4. **Wild Features** - Game mechanics and capabilities
5. **Vision** - Future goals and impact
6. **Contact** - Get involved and connect

## 🌿 Conservation Focus

The website emphasizes:
- Brazilian rainforest conservation
- Jaguar (onça pintada) protection
- Educational gaming for environmental awareness
- Citizen science and real conservation impact

## 🛠️ Technical Stack

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first styling
- **Gradio** - AI chatbot integration
- **Hugging Face Spaces** - Hosted AI application
- **Python** - Local development server

## 🚨 Troubleshooting

### Chatbot Not Loading?
- Make sure you're using a proper HTTP server (not just opening the HTML file)
- Check that the Hugging Face Spaces URL is accessible
- Try refreshing the page

### CORS Errors?
- Use the provided `server.py` script
- Don't open the HTML file directly in the browser
- Ensure you're accessing via `http://localhost:8000`

### Port Already in Use?
```bash
# Try a different port
python server.py --port 8001
```

## 🌍 Live Demo

The website is designed to showcase the Eco-Explorer project and provide an interactive way to learn about conservation through educational gaming, with a special focus on Brazil's iconic jaguar.
