# 🚀 Quick Start Guide

## How to Run the Website

Good news! **The website is already running!** 🎉

### Current Status:
✅ Development server is running at: **http://localhost:5173**

### To View the Website:

1. **Open your web browser** (Chrome, Firefox, Safari, or Edge)

2. **Go to this URL:**
   ```
   http://localhost:5173
   ```

3. **That's it!** You should see the home page with the colorful gradient background and cursor trail effect.

---

## If You Need to Start/Stop the Server

### To STOP the server:
- Go to the terminal where it's running
- Press `Ctrl + C` (or `Cmd + C` on Mac)

### To START the server again:

1. Open Terminal/Command Prompt

2. Navigate to the project folder:
   ```bash
   cd "/Users/himanshiibm/Desktop/Poster share/patterns-cohort-showcase"
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. You'll see output like:
   ```
   VITE v8.0.10  ready in 644 ms
   ➜  Local:   http://localhost:5173/
   ```

5. Open http://localhost:5173 in your browser

---

## Project Structure (Main Files)

```
patterns-cohort-showcase/
├── index.html              ← Entry HTML file
├── src/
│   ├── main.jsx           ← Main JavaScript entry point
│   ├── App.jsx            ← Main App component with routing
│   └── pages/             ← All page components
│       ├── Home.jsx       ← Home page (cursor trail)
│       ├── TheGlowUp.jsx  ← Glow Up page (spotlight)
│       ├── Learnings.jsx  ← Learnings page (doodles)
│       └── PictureBoard.jsx ← Picture Board (webcam)
```

**Main Entry Point:** `src/main.jsx` → renders `App.jsx` → which contains all routes

---

## Navigation

Once the website is open, you can navigate using:

1. **Top Navigation Bar** - Click on any menu item:
   - "home (but make it ✨fancy✨)"
   - "the glow up 💡"
   - "what i actually learned 🧠"
   - "our vibe check 📸"

2. **Direct URLs:**
   - Home: http://localhost:5173/
   - Glow Up: http://localhost:5173/glow-up
   - Learnings: http://localhost:5173/learnings
   - Picture Board: http://localhost:5173/picture-board

---

## Troubleshooting

### "Cannot GET /" or blank page?
- Make sure the dev server is running (check terminal)
- Try refreshing the page (Cmd/Ctrl + R)
- Clear browser cache and reload

### Port 5173 already in use?
- Stop any other Vite projects running
- Or the server will automatically use a different port (check terminal output)

### Changes not showing?
- Vite has hot reload - changes should appear automatically
- If not, refresh the browser

### Need to install dependencies?
If you just cloned/downloaded the project:
```bash
cd patterns-cohort-showcase
npm install
npm run dev
```

---

## What to Test

1. **Home Page:**
   - Move your cursor around → see colorful particles
   - Scroll down to see info cards
   - Click "let's goooo 🚀" button

2. **The Glow Up Page:**
   - Move cursor to reveal content (spotlight effect)
   - Read the before/after comparison

3. **Learnings Page:**
   - Watch floating doodles in background
   - Click on any learning card to expand it
   - Scroll through all 8 topics

4. **Picture Board:**
   - Click "📷 Take a Selfie" to use webcam
   - Click "📁 Upload Photo" to add from files
   - View your picture gallery

---

## Need Help?

- Check README.md for full documentation
- Check DEPLOYMENT.md for deployment instructions
- The dev server terminal shows any errors

---

**Enjoy your creative website! 🎨✨**