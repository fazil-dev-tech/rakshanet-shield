@echo off
echo ========================================================
echo Automatically Preparing and Uploading to Git...
echo ========================================================

:: Initialize repository if not already initialized
if not exist .git (
    echo Initializing new Git repository...
    git init
)

:: Prompt for repository URL
set /p "repo_url=Enter your Git repository URL (e.g. https://github.com/username/repo.git): "

:: Set remote URL
git remote add origin %repo_url%
:: If remote already exists, try to update it just in case
git remote set-url origin %repo_url%

:: Stage all files
echo Staging files...
git add .

:: Commit
echo Committing files...
git commit -m "Initial commit: setup Next.js project and browser extension"

:: Set branch to main and push
echo Pushing to remote...
git branch -M main
git push -u origin main

echo ========================================================
echo Done!
pause
