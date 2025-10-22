#!/bin/bash

# Ollama installation script with retry logic and fallback methods
set -e

echo "Starting Ollama installation..."

# Function to install Ollama via official script
install_ollama_official() {
    echo "Attempting to install Ollama via official script..."
    curl -fsSL --connect-timeout 30 --max-time 300 https://ollama.ai/install.sh | sh
}

# Function to install Ollama manually (fallback)
install_ollama_manual() {
    echo "Installing Ollama manually..."
    
    # Detect architecture
    ARCH=$(uname -m)
    case $ARCH in
        x86_64) ARCH="amd64" ;;
        aarch64) ARCH="arm64" ;;
        armv7l) ARCH="arm" ;;
        *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
    esac
    
    # Download and install Ollama binary
    OLLAMA_VERSION="0.1.30"  # Update this to latest version as needed
    DOWNLOAD_URL="https://github.com/ollama/ollama/releases/download/v${OLLAMA_VERSION}/ollama-linux-${ARCH}"
    
    echo "Downloading Ollama binary from: $DOWNLOAD_URL"
    curl -L --connect-timeout 30 --max-time 300 "$DOWNLOAD_URL" -o /usr/local/bin/ollama
    chmod +x /usr/local/bin/ollama
    
    # Create ollama user
    useradd -r -s /bin/false -m -d /usr/share/ollama ollama
    
    # Create systemd service
    cat > /etc/systemd/system/ollama.service << EOF
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=ollama
Group=ollama
Restart=always
RestartSec=3
Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

[Install]
WantedBy=default.target
EOF
    
    # Enable service
    systemctl enable ollama
}

# Try official installation first, then fallback to manual
for attempt in 1 2 3; do
    echo "Installation attempt $attempt..."
    
    if install_ollama_official; then
        echo "Ollama installed successfully via official script"
        break
    else
        echo "Official installation failed on attempt $attempt"
        if [ $attempt -eq 3 ]; then
            echo "All official installation attempts failed, trying manual installation..."
            install_ollama_manual
        else
            echo "Waiting 10 seconds before retry..."
            sleep 10
        fi
    fi
done

# Verify installation
echo "Verifying Ollama installation..."
if ollama --version; then
    echo "Ollama installation verified successfully"
else
    echo "Ollama installation verification failed"
    exit 1
fi

echo "Ollama installation completed successfully"
