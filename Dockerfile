# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Ollama + Nginx + Frontend
FROM debian:bullseye-slim AS final

# Install Ollama, Nginx, and dependencies
RUN apt-get update && apt-get install -y curl nginx && \
    curl -fsSL https://ollama.ai/install.sh | sh && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy frontend
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy configs and scripts
COPY nginx.conf /etc/nginx/nginx.conf
COPY ollama-models/ /root/.ollama/models/
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Ports
EXPOSE 80 11434

# Health check
HEALTHCHECK CMD curl -f http://localhost:11434/api/version || exit 1

ENTRYPOINT ["/bin/bash", "/start.sh"]