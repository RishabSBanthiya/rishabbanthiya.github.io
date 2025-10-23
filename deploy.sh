#!/bin/bash

# Simple deployment script for GitHub Pages
# This script builds the project and copies files to root for branch-based deployment

echo "🚀 Building portfolio for GitHub Pages deployment..."

# Build the project
echo "📦 Building project..."
cp index.html.template index.html
npm run build

# Copy built files to root
echo "📋 Copying built files to root..."
cp -r dist/* .

# Clean up temporary files
echo "🧹 Cleaning up..."
rm index.html

# Show what was deployed
echo "✅ Deployment ready! Files in root:"
ls -la | grep -E "\.(html|js|css)$" | head -5

echo ""
echo "📝 Next steps:"
echo "1. git add ."
echo "2. git commit -m 'deploy: update site'"
echo "3. git push origin main"
echo ""
echo "🌐 Your site will be available at:"
echo "   https://rishabbanthiya.github.io"
echo "   https://rishab-banthiya.com"
