#!/bin/bash

echo "🚀 Starting manual deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Copy built files to root
echo "📁 Copying built files to root..."
cp -r dist/* .

# Add and commit changes
echo "💾 Committing changes..."
git add .
git commit -m "Deploy: $(date)"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Deployment complete!"
echo "🌐 Your site should be available at: https://rishabbanthiya.github.io/rishabbanthiya.github.io/"