@echo off
echo Adding changes to git...
git add .

echo Committing changes...
set /p message="Enter commit message: "
git commit -m "%message%"

echo Pushing to GitHub...
git push origin main

echo Git update complete!
pause