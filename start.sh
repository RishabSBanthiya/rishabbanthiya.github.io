#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting Portfolio with Ollama AI..."

# Function to check if Ollama is ready
wait_for_ollama() {
    echo "⏳ Waiting for Ollama to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
            echo "✅ Ollama is ready!"
            return 0
        fi
        echo "   Attempt $i/30 - Ollama not ready yet..."
        sleep 2
    done
    echo "❌ Ollama failed to start within 60 seconds"
    return 1
}

# Function to check if model exists
check_model() {
    echo "🔍 Checking if rishab-bot model exists..."
    if curl -s http://localhost:11434/api/tags | grep -q "rishab-bot"; then
        echo "✅ rishab-bot model found!"
        return 0
    else
        echo "⚠️  rishab-bot model not found, creating it..."
        return 1
    fi
}

# Function to create the model
create_model() {
    echo "🔨 Creating rishab-bot model..."
    echo "📁 Checking /tmp/ollama-models/ directory contents:"
    ls -la /tmp/ollama-models/ || echo "   Directory doesn't exist"
    
    if [ -f "/tmp/ollama-models/rishab-bot.Modelfile" ]; then
        echo "✅ Found Modelfile, creating model..."
        ollama create rishab-bot -f /tmp/ollama-models/rishab-bot.Modelfile
        echo "✅ rishab-bot model created successfully!"
    else
        echo "❌ Modelfile not found at /tmp/ollama-models/rishab-bot.Modelfile"
        echo "   This might cause issues with the AI feature."
    fi
}

# Start Ollama in background
echo "🦙 Starting Ollama server..."
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama to be ready
if ! wait_for_ollama; then
    echo "❌ Failed to start Ollama. Exiting..."
    kill $OLLAMA_PID 2>/dev/null || true
    exit 1
fi

# Check and create model if needed
if ! check_model; then
    create_model
fi

# Start nginx in foreground
echo "🌐 Starting nginx web server..."
echo "✅ Portfolio is ready at http://localhost"
echo "🤖 AI features powered by Ollama"
echo "📊 Health check available at http://localhost/health"

# Start nginx (this will run in foreground and keep container alive)
exec nginx -g "daemon off;"
