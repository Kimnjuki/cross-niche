# GitHub Setup Script for The Grid Nexus Platform
# Run this script to set up your GitHub repository

Write-Host "=== The Grid Nexus - GitHub Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if git is configured
$gitEmail = git config --global user.email
$gitName = git config --global user.name

if ([string]::IsNullOrWhiteSpace($gitEmail)) {
    Write-Host "Git email is not configured." -ForegroundColor Yellow
    $email = Read-Host "Enter your GitHub email address"
    git config --global user.email $email
    Write-Host "Git email configured: $email" -ForegroundColor Green
} else {
    Write-Host "Git email: $gitEmail" -ForegroundColor Green
}

if ([string]::IsNullOrWhiteSpace($gitName)) {
    Write-Host "Git name is not configured." -ForegroundColor Yellow
    $name = Read-Host "Enter your name"
    git config --global user.name $name
    Write-Host "Git name configured: $name" -ForegroundColor Green
} else {
    Write-Host "Git name: $gitName" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Create a new repository on GitHub:" -ForegroundColor Yellow
Write-Host "   - Go to https://github.com/new" -ForegroundColor White
Write-Host "   - Repository name: cross-niche-intelligence" -ForegroundColor White
Write-Host "   - Description: Tech • Security • Gaming Intelligence Platform" -ForegroundColor White
Write-Host "   - Choose Public or Private" -ForegroundColor White
Write-Host "   - DO NOT initialize with README, .gitignore, or license" -ForegroundColor White
Write-Host ""
Write-Host "2. After creating the repository, run these commands:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/cross-niche-intelligence.git" -ForegroundColor White
Write-Host "   git branch -M main" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "   (Replace YOUR_USERNAME with your GitHub username)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. For authentication, you'll need a Personal Access Token:" -ForegroundColor Yellow
Write-Host "   - Go to: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "   - Generate new token (classic)" -ForegroundColor White
Write-Host "   - Select 'repo' scope" -ForegroundColor White
Write-Host "   - Use the token as your password when pushing" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see GITHUB_SETUP.md" -ForegroundColor Cyan
Write-Host ""

