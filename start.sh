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

# Function to create the model with timeout and retry logic
create_model() {
    echo "🔨 Creating rishab-bot model..."
    echo "📁 Checking /root/.ollama/models/ directory contents:"
    ls -la /root/.ollama/models/ || echo "   Directory doesn't exist"
    
    if [ -f "/root/.ollama/models/rishab-bot.Modelfile" ]; then
        echo "✅ Found Modelfile, creating model..."
        
        # Try to create model with timeout and retry logic
        for attempt in 1 2 3; do
            echo "🔄 Attempt $attempt to create model..."
            
            # Set timeout for model creation (10 minutes)
            timeout 600 ollama create rishab-bot -f /root/.ollama/models/rishab-bot.Modelfile
            
            if [ $? -eq 0 ]; then
                echo "✅ rishab-bot model created successfully!"
                return 0
            else
                echo "⚠️  Attempt $attempt failed, retrying in 30 seconds..."
                sleep 30
            fi
        done
        
        echo "❌ Failed to create model after 3 attempts"
        echo "🔄 Trying to use a smaller base model..."
        create_fallback_model
    else
        echo "❌ Modelfile not found at /root/.ollama/models/rishab-bot.Modelfile"
        echo "🔄 Creating fallback model..."
        create_fallback_model
    fi
}

# Function to create a fallback model using a smaller base
create_fallback_model() {
    echo "🔄 Creating fallback model with smaller base..."
    
    # Create a simple Modelfile with a smaller model
    cat > /tmp/fallback.Modelfile << 'EOF'
FROM llama3.2:1b

PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_predict 500

SYSTEM """You are shrub's bot, an AI assistant for Rishab Banthiya's portfolio. 

You can help visitors learn about Rishab's skills, experience, and projects. 
If you don't know something specific about Rishab, suggest they contact him at banthiya.rishab1511@gmail.com or visit his LinkedIn at linkedin.com/in/rishrub.

Keep responses friendly and under 300 words."""
EOF
    
    # Try to create the fallback model
    timeout 300 ollama create rishab-bot -f /tmp/fallback.Modelfile
    
    if [ $? -eq 0 ]; then
        echo "✅ Fallback model created successfully!"
    else
        echo "⚠️  Fallback model creation also failed, but continuing..."
        echo "   AI features may not work properly."
    fi
    
    # Clean up
    rm -f /tmp/fallback.Modelfile
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
