#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Copy dist contents to root for GitHub Pages
echo "Copying build files to root..."
cp -r dist/* .

# Add and commit changes
echo "Committing changes..."
git add .
git commit -m "Deploy to GitHub Pages"

# Push to main branch
echo "Pushing to GitHub..."
git push origin main

echo "Deployment complete! Your site should be available at:"
echo "https://rishabbanthiya.github.io/rishabbanthiya.github.io/"