# IBM Patterns Cohort Showcase ✨

A creative, interactive website showcasing learnings from the IBM Patterns Cohort. Built with React, featuring Gen Z vibes, sarcastic humor, and lots of interactive elements!

## 🎨 Features

### 🏠 Home Page
- **Cursor Trail Effect**: Move your cursor to create colorful particle trails
- **Glitch Text Animation**: Eye-catching title with glitch effects
- **Info Cards**: Overview of key learnings with hover animations
- **Responsive Design**: Looks great on all devices

### 💡 The Glow Up Page
- **Spotlight Effect**: Dark page that lights up around your cursor
- **Before/After Comparison**: Humorous take on the learning journey
- **Transformation Grid**: Key areas of growth
- **Inspirational Quotes**: With Gen Z translations

### 🧠 Learnings Page
- **Floating Doodles**: Animated emojis floating in the background
- **Interactive Cards**: Click to reveal detailed information
- **Keyword Tags**: Quick overview of each topic
- **Key Takeaways**: TL;DR section for the busy folks

### 📸 Picture Board
- **Webcam Integration**: Take selfies directly in the browser
- **File Upload**: Upload photos from your device
- **Local Storage**: All pictures saved in your browser (privacy-first!)
- **Picture Gallery**: Beautiful grid layout with hover effects
- **Delete Functionality**: Remove individual pictures or clear all

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd patterns-cohort-showcase
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Built With

- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Canvas API** - Interactive effects
- **MediaDevices API** - Webcam functionality
- **LocalStorage API** - Picture persistence

## 📱 Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

**Note**: Webcam feature requires HTTPS in production or localhost in development.

## 🎯 Key Learnings Covered

- **IBM Framework**: PDLC, EDT, and the IBM way
- **TTV (Time To Value)**: Speed meets impact
- **Carbon Design System**: IBM's design language
- **Accessibility**: Building for everyone
- **Outcome vs Output**: Focus on what matters
- **Storytelling**: Making data meaningful
- **Hills Statement**: Goal-setting the IBM way
- **Gen Z Collaboration**: Working with the squad

## 🎨 Interactive Features

1. **Cursor Trail** (Home): Creates colorful particles following your cursor
2. **Spotlight Effect** (Glow Up): Reveals content as you move your cursor
3. **Floating Doodles** (Learnings): Animated emojis in the background
4. **Clickable Cards** (Learnings): Expand to show more details
5. **Webcam Capture** (Picture Board): Take photos directly in browser
6. **Hover Animations**: Throughout the site for better UX

## 📝 Project Structure

```
patterns-cohort-showcase/
├── src/
│   ├── pages/
│   │   ├── Home.jsx & Home.css
│   │   ├── TheGlowUp.jsx & TheGlowUp.css
│   │   ├── Learnings.jsx & Learnings.css
│   │   └── PictureBoard.jsx & PictureBoard.css
│   ├── App.jsx & App.css
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
└── README.md
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify

### Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
"homepage": "https://yourusername.github.io/patterns-cohort-showcase",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. Deploy:
```bash
npm run deploy
```

## 🎭 Gen Z Language Guide

- **ngl** = not gonna lie
- **fr** = for real
- **lowkey** = kind of/sort of
- **highkey** = very much/definitely
- **slaps/fire** = really good
- **mid** = mediocre
- **no cap** = no lie/for real
- **bussin** = really good
- **vibe check** = checking the mood/atmosphere

## 🤝 Contributing

This is a personal project showcasing learnings from the IBM Patterns Cohort. Feel free to fork and create your own version!

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- IBM Patterns Cohort team for the amazing learning experience
- All the Gen Z folks who made it fun
- Coffee, for obvious reasons ☕

## 📧 Contact

Created with 💜 by a Gen Z developer who learned that IBM actually knows what they're doing

---

**Note**: This website uses localStorage for the Picture Board feature. Pictures are stored locally in your browser and are not uploaded to any server. Clear your browser data = goodbye pictures! 📸

## 🐛 Known Issues

- Picture Board images are stored in localStorage (limited to ~5-10MB depending on browser)
- Webcam requires HTTPS in production
- Some animations may be reduced if user has "prefers-reduced-motion" enabled (accessibility feature)

## 🔮 Future Enhancements

- [ ] Backend integration for persistent picture storage
- [ ] Social sharing features
- [ ] More interactive animations
- [ ] Dark/light mode toggle
- [ ] Export pictures as ZIP
- [ ] Add filters to webcam
- [ ] Collaborative picture board

---

Made with ✨ and a lot of caffeine during the IBM Patterns Cohort
