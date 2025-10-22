@echo off
echo ========================================
echo Pushing ALL Files to GitHub
echo Repository: https://github.com/techwallahexplorer/Symptom2care
echo Status: Private Repository
echo ========================================
echo.

REM Configure Git user
echo [1/6] Configuring Git user...
git config user.email "urjagjeetsingh@gmail.com"
git config user.name "techwallahexplorer"
echo Done!
echo.

REM Add all files
echo [2/6] Adding all files...
git add .
echo Done!
echo.

REM Commit all files
echo [3/6] Committing files...
git commit -m "Complete Symptom2Care project with all features"
echo Done!
echo.

REM Add remote (if not exists)
echo [4/6] Adding remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/techwallahexplorer/Symptom2care.git
echo Done!
echo.

REM Set main branch
echo [5/6] Setting main branch...
git branch -M main
echo Done!
echo.

REM Push to GitHub
echo [6/6] Pushing to GitHub...
echo.
echo You may be prompted for authentication:
echo - Username: techwallahexplorer
echo - Password: Use Personal Access Token (not your GitHub password)
echo.
git push -u origin main --force
echo.

echo ========================================
echo Push Complete!
echo ========================================
echo.
echo Your project is now on GitHub:
echo https://github.com/techwallahexplorer/Symptom2care
echo.
pause
