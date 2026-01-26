# 🚀 GitHub Setup Instructions

## Step 1: Create Repository on GitHub
1. Go to https://github.com
2. Click "New repository"
3. Repository name: `multilingual-mandi-assistant`
4. Description: `🌾 AI-powered multilingual mandi assistant for Indian farmers with live price discovery and smart bargaining`
5. Make it **Public**
6. **Don't** initialize with README
7. Click "Create repository"

## Step 2: Get Personal Access Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control of private repositories)
4. Click "Generate token"
5. **Copy the token** (you won't see it again!)

## Step 3: Update Remote URL
Replace YOUR_USERNAME and YOUR_TOKEN with your actual values:

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/multilingual-mandi-assistant.git
```

## Step 4: Push to GitHub
```bash
git push -u origin main
```

## Alternative: Use GitHub Desktop
1. Download GitHub Desktop from https://desktop.github.com/
2. Sign in with your GitHub account
3. File → Add Local Repository → Select your project folder
4. Publish repository to GitHub

## Your Repository URL will be:
https://github.com/YOUR_USERNAME/multilingual-mandi-assistant

## Ready for Deployment:
- Vercel: Connect GitHub repo for auto-deploy
- Netlify: Import from GitHub
- Railway: Deploy from GitHub

🎉 Your Multilingual Mandi Assistant is ready to showcase!