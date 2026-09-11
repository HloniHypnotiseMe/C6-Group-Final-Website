#!/bin/bash
set -e
echo "C6 Group Deployment Starting"
apt update && apt upgrade -y
apt install -y curl git docker.io docker-compose postgresql ufw
ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw allow 5678
ufw --force enable
systemctl enable docker && systemctl start docker
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2:1b &
cd /opt
git clone https://github.com/HloniHypnotiseMe/C6-Group-Final-Website.git c6group
cd c6group
cp deploy/.env.example .env
echo "Edit /opt/c6group/.env then run docker-compose up -d"
