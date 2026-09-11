# C6 Group – VPS Deployment Guide

## One-Command Deployment

Run on a fresh Ubuntu 24.04 VPS:

    bash <(curl -fsSL https://raw.githubusercontent.com/HloniHypnotiseMe/C6-Group-Final-Website/main/deploy/deploy.sh)

## Manual Steps

1. SSH into the server
2. Clone the repo to /opt/c6group
3. Copy deploy/.env.example to .env and fill in credentials
4. Run: docker-compose up -d
5. Import n8n workflows from n8n-workflows/
6. Configure Cloudflare DNS to point to server IP
7. Enable HTTPS with Certbot

## Access Points

- n8n: http://SERVER_IP:5678
- Qdrant: http://SERVER_IP:6333/dashboard
- API: http://SERVER_IP:5000
