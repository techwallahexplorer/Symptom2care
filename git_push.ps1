# Git Push Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pushing to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Add all files
Write-Host "[1/3] Adding files..." -ForegroundColor Yellow
git add .
Write-Host "Done!" -ForegroundColor Green
Write-Host ""

# Commit
Write-Host "[2/3] Committing..." -ForegroundColor Yellow
git commit -m "Fix vercel.json and update project"
Write-Host "Done!" -ForegroundColor Green
Write-Host ""

# Push
Write-Host "[3/3] Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Push Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
