# Eco-Explorer Website

A professional investor pitch website for Eco-Explorer, an educational simulation game set in Brazil's Itatiaia National Park.

## Project Structure

```
eco-explorer-website/
├── index.html                 # Main website file
├── README.md                  # Project documentation
├── assets/                    # Static assets
│   ├── images/               # Image resources
│   │   ├── hero/            # Hero section images
│   │   ├── sections/        # Section-specific images
│   │   ├── icons/           # Custom icons and logos
│   │   └── backgrounds/     # Background images
│   ├── css/                 # Stylesheets
│   │   ├── main.css         # Main stylesheet
│   │   ├── components.css   # Component-specific styles
│   │   └── responsive.css   # Responsive design styles
│   ├── js/                  # JavaScript files
│   │   ├── main.js          # Main JavaScript functionality
│   │   ├── navigation.js    # Navigation and scroll handling
│   │   └── forms.js         # Form handling and validation
│   └── fonts/               # Custom fonts (if any)
├── docs/                    # Documentation
│   ├── technical/           # Technical documentation
│   ├── design/              # Design system and guidelines
│   └── content/             # Content strategy and copy
├── resources/               # External resources and references
│   ├── research/            # Research materials
│   ├── references/          # Reference materials
│   └── assets/              # External asset references
└── .gitignore              # Git ignore file
```

## Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Navigation**: Intersection Observer for active section highlighting
- **Professional Layout**: Clean, modern design optimized for investor presentations
- **Form Integration**: Netlify form handling for investor inquiries
- **Performance Optimized**: Optimized images and minimal dependencies

## Technologies Used

- HTML5
- CSS3 (Tailwind CSS)
- Vanilla JavaScript
- Netlify Forms
- Responsive Design Principles

## Getting Started

1. Clone the repository
2. Open `index.html` in a web browser
3. For development, use a local server (e.g., `python -m http.server 8000`)

## Deployment

The website is designed to be deployed on Netlify with zero configuration:
- Connect your repository to Netlify
- Deploy automatically on push to main branch
- Forms will work out of the box

## Content Sections

1. **Hero**: Main value proposition and call-to-action
2. **The Game**: Overview of Eco-Explorer gameplay
3. **The World**: Itatiaia National Park background
4. **Gameplay**: Core mechanics and features
5. **Our Vision**: Technical vision and innovation
6. **Endgame**: Long-term engagement and community
7. **Investors**: Contact form for potential partners

## Maintenance

- Update images in `assets/images/`
- Modify styles in `assets/css/`
- Update JavaScript functionality in `assets/js/`
- Keep documentation current in `docs/`

## License

© 2024 Eco-Explorer Game Studios. All Rights Reserved.
