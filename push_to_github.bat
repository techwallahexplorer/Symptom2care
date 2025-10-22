@echo off
echo ========================================
echo Pushing Symptom2Care to GitHub
echo ========================================

REM Configure Git user
git config user.email "urjagjeetsingh@gmail.com"
git config user.name "techwallahexplorer"

REM Commit all files
git commit -m "Initial commit: Symptom2Care Web App"

REM Add remote repository
git remote add origin https://github.com/techwallahexplorer/Symptom2care.git

REM Push to GitHub
git branch -M main
git push -u origin main

echo ========================================
echo Push complete!
echo ========================================
pause
