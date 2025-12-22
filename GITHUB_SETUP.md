# GitHub Repository Setup Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the repository details:
   - **Repository name**: `cross-niche-intelligence` (or your preferred name)
   - **Description**: "Tech • Security • Gaming Intelligence Platform"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 2: Link Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/cross-niche-intelligence.git

# Or if you prefer SSH (requires SSH key setup):
# git remote add origin git@github.com:YOUR_USERNAME/cross-niche-intelligence.git

# Rename branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

## Step 3: Verify Git Configuration

Make sure your git is configured with your email:

```bash
# Check current email
git config --global user.email

# Set email if not configured (use your GitHub email)
git config --global user.email "your-email@example.com"

# Verify name
git config --global user.name
```

## Step 4: Authentication

### Option A: Personal Access Token (Recommended)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token"**
3. Select scopes: `repo` (full control of private repositories)
4. Copy the token
5. When pushing, use the token as password:
   - Username: Your GitHub username
   - Password: The token you just created

### Option B: GitHub CLI

```bash
# Install GitHub CLI (if not installed)
# Windows: winget install GitHub.cli
# Mac: brew install gh
# Linux: See https://github.com/cli/cli/blob/trunk/docs/install_linux.md

# Authenticate
gh auth login

# Follow the prompts to authenticate
```

### Option C: SSH Keys

1. Generate SSH key:
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

2. Add SSH key to GitHub:
   - Copy the public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub Settings → SSH and GPG keys → New SSH key
   - Paste the key and save

## Step 5: Push Your Code

```bash
# Check status
git status

# Add all files (if not already added)
git add .

# Commit changes
git commit -m "Initial commit: The Grid Nexus platform"

# Push to GitHub
git push -u origin main
```

## Step 6: Verify on GitHub

1. Go to your repository on GitHub
2. Verify all files are present
3. Check that README.md displays correctly
4. Verify .gitignore is working (node_modules should not be visible)

## Troubleshooting

### If push fails with authentication error:

```bash
# Update remote URL to use token
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/cross-niche-intelligence.git

# Or use SSH
git remote set-url origin git@github.com:YOUR_USERNAME/cross-niche-intelligence.git
```

### If you get "branch main has no upstream branch":

```bash
git push --set-upstream origin main
```

### To check remote configuration:

```bash
git remote -v
```

## Next Steps

After pushing to GitHub:

1. **Add Repository Topics**: Go to repository settings and add topics like:
   - `react`
   - `typescript`
   - `cybersecurity`
   - `gaming`
   - `tech-news`

2. **Enable GitHub Pages** (optional):
   - Go to Settings → Pages
   - Select source branch: `main`
   - Select folder: `/docs` or `/dist`

3. **Set up GitHub Actions** (optional):
   - Create `.github/workflows/ci.yml` for automated testing
   - Create `.github/workflows/deploy.yml` for automated deployment

4. **Add Collaborators**:
   - Go to Settings → Collaborators
   - Add team members by username or email

5. **Protect Main Branch**:
   - Go to Settings → Branches
   - Add branch protection rules
   - Require pull request reviews

## Repository Settings

Recommended settings:
- ✅ Issues enabled
- ✅ Projects enabled
- ✅ Wiki disabled (unless needed)
- ✅ Discussions enabled (for community)
- ✅ Allow merge commits
- ✅ Allow squash merging
- ✅ Allow rebase merging

---

**Need Help?** Open an issue on GitHub or check [GitHub Documentation](https://docs.github.com)

