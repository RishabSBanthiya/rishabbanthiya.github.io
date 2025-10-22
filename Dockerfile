# Multi-stage build for Ollama + Frontend deployment
FROM node:18-alpine AS frontend-builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

# Copy source files
COPY src/ ./src/
COPY public/ ./public/
COPY index.html.template ./index.html
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./

# Build the frontend
RUN npm run build

# Production stage with Ollama
FROM ollama/ollama:latest

# Install nginx and other dependencies
RUN apt-get update && \
    apt-get install -y nginx curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy Ollama model files
COPY ollama-models/ /tmp/ollama-models/

# Create startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose ports
EXPOSE 80 11434

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Override the default entrypoint and start our script
ENTRYPOINT []
CMD ["/bin/bash", "/start.sh"]
