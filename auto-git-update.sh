#!/bin/bash

echo "Adding changes to git..."
git add .

echo "Enter commit message:"
read message
git commit -m "$message"

echo "Pushing to GitHub..."
git push origin main

echo "Git update complete!"