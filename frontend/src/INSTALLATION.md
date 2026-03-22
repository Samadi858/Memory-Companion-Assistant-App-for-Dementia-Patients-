# 📦 Installation Instructions

## Step-by-Step Setup Guide

### 1️⃣ Extract the ZIP File

Unzip the downloaded file to your desired location:
```
C:\Projects\dementia-care-system\
```
or
```
~/Projects/dementia-care-system/
```

### 2️⃣ Open in VS Code

1. Open Visual Studio Code
2. File → Open Folder
3. Navigate to the extracted folder
4. Click "Select Folder"

### 3️⃣ Open Terminal in VS Code

- **Windows**: Press `` Ctrl + ` `` (backtick)
- **Mac**: Press `` Cmd + ` ``
- Or: View → Terminal

### 4️⃣ Install Dependencies

In the terminal, run:
```bash
npm install
```

⏱️ **This will take 2-3 minutes.** You'll see a progress bar.

**Expected output:**
```
added 234 packages in 2m
```

### 5️⃣ Start Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 823 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### 6️⃣ Open in Browser

1. Hold `Ctrl` (Windows) or `Cmd` (Mac)
2. Click on `http://localhost:5173/`
3. Or manually open your browser and go to: `http://localhost:5173`

🎉 **You should now see the Dementia Care System running!**

---

## 🐛 Troubleshooting

### Issue: "npm: command not found"

**Solution:** Install Node.js from https://nodejs.org/

1. Download LTS version (recommended)
2. Run installer
3. Restart VS Code
4. Try again

### Issue: Port 5173 already in use

**Solution:** Either:
1. Stop other Vite projects, or
2. Vite will automatically use port 5174

### Issue: Module not found errors

**Solution:** Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Tailwind styles not showing

**Solution:** Make sure you're using Tailwind v4:
```bash
npm install tailwindcss@next @tailwindcss/vite@next
```

---

## ⚡ Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 📂 File Structure Verification

After installation, your folder should look like:

```
dementia-care-system/
├── node_modules/          ✅ Created after npm install
├── src/
│   ├── components/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🎯 Next Steps

1. ✅ Project is running
2. 📖 Read `README.md` for features
3. 🎨 Customize family members, medications, etc.
4. 🚀 Deploy to production (see README.md)

---

## 💡 Tips

- **Hot Reload**: Edit any file and see changes instantly
- **Console**: Press `F12` to open browser developer tools
- **Errors**: Check both terminal and browser console for errors
- **Stop Server**: Press `Ctrl+C` in terminal

---

## 📞 Still Having Issues?

1. Check Node.js version: `node --version` (should be 18+)
2. Check npm version: `npm --version` (should be 9+)
3. Clear cache: `npm cache clean --force`
4. Reinstall: `rm -rf node_modules && npm install`

---

**Happy coding! 🎉**
