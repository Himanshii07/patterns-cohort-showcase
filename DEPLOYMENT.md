# Deployment Guide 🚀

## Quick Deploy to Vercel (Recommended)

### Option 1: Using Vercel CLI

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from the project directory:
```bash
cd patterns-cohort-showcase
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? Press enter (or customize)
   - Directory? Press enter (current directory)
   - Override settings? **N**

5. Your site will be deployed! 🎉

### Option 2: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Vercel will auto-detect Vite configuration
5. Click "Deploy"
6. Done! ✨

## Deploy to Netlify

### Option 1: Drag & Drop

1. Build the project:
```bash
npm run build
```

2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist` folder to the deploy area
4. Your site is live! 🎊

### Option 2: Using Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login:
```bash
netlify login
```

3. Deploy:
```bash
netlify deploy --prod
```

4. Select the `dist` folder when prompted

## Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Update `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/patterns-cohort-showcase",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/patterns-cohort-showcase/'
})
```

4. Deploy:
```bash
npm run deploy
```

## Important Notes

### Webcam Feature
- Requires HTTPS in production (all platforms above provide this)
- Will work on localhost during development
- Users need to grant camera permissions

### LocalStorage
- Pictures are stored in browser's localStorage
- Limited to ~5-10MB depending on browser
- Clearing browser data will delete pictures
- Consider adding a download feature for important pictures

### Environment Variables
If you add any environment variables in the future:

**Vercel:**
- Add in Project Settings → Environment Variables

**Netlify:**
- Add in Site Settings → Build & Deploy → Environment

**GitHub Pages:**
- Not recommended for sensitive data (static hosting)

## Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Test navigation between pages
- [ ] Test cursor effects (Home & Glow Up pages)
- [ ] Test webcam functionality (Picture Board)
- [ ] Test file upload (Picture Board)
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Check console for errors
- [ ] Verify all animations work
- [ ] Test localStorage persistence

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records

## Troubleshooting

### Build Fails
- Check Node.js version (should be 16+)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for any console errors

### Routing Issues (404 on refresh)
- Ensure `vercel.json` is present for Vercel
- For Netlify, create `_redirects` file in public folder:
  ```
  /*    /index.html   200
  ```

### Webcam Not Working
- Ensure site is served over HTTPS
- Check browser permissions
- Test on different browsers

## Performance Tips

1. **Image Optimization**: If adding more images, use WebP format
2. **Code Splitting**: Already handled by Vite
3. **Lazy Loading**: Consider for future enhancements
4. **CDN**: Vercel and Netlify provide this automatically

## Monitoring

### Vercel Analytics
- Enable in Project Settings → Analytics
- Track page views, performance, etc.

### Netlify Analytics
- Enable in Site Settings → Analytics
- Paid feature but provides detailed insights

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Vite Docs: https://vitejs.dev/guide/

---

Happy Deploying! 🚀✨