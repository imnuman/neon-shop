# Neon Shop - Ubuntu Server Setup Guide

Complete step-by-step guide to deploy Neon Shop on your Ubuntu server.

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Ubuntu Server (20.04 LTS or later)
- ✅ SSH access to your server
- ✅ Root or sudo privileges
- ✅ A domain name (optional but recommended for SSL)

---

## 🚀 Step-by-Step Setup

### Step 1: Update System

First, update your system packages:

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install Docker and Docker Compose

```bash
# Install prerequisites
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
docker --version
docker compose version

# Add your user to docker group (to run without sudo)
sudo usermod -aG docker $USER

# Apply group changes (you may need to log out and back in)
newgrp docker

# Test Docker
docker run hello-world
```

### Step 3: Install Git

```bash
sudo apt install -y git
git --version
```

### Step 4: Clone the Repository

```bash
# Navigate to your preferred directory (e.g., /opt or /home/username)
cd /opt

# Clone the repository (replace with your actual repo URL)
sudo git clone https://github.com/imnuman/neon-shop.git

# Change ownership to your user
sudo chown -R $USER:$USER neon-shop

# Navigate to project directory
cd neon-shop
```

### Step 5: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit the environment file
nano .env
```

**Update these values in `.env`:**

```env
# Database Configuration
POSTGRES_USER=neonshop_user
POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD_HERE    # Change this!
POSTGRES_DB=neonshop
POSTGRES_PORT=5432

# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://YOUR_SERVER_IP:3000  # Change to your domain later
APP_PORT=3000

# Note: If you have a domain, use:
# NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**To save and exit nano:**
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

**Important Security Note:**
- Generate a strong password for `POSTGRES_PASSWORD`
- You can use this command to generate one:
```bash
openssl rand -base64 32
```

### Step 6: Start the Application

```bash
# Build Docker images
docker compose build

# Start services in detached mode
docker compose up -d

# Check if services are running
docker compose ps
```

You should see two services running:
- `neon-shop-db` (PostgreSQL)
- `neon-shop-app` (Next.js application)

### Step 7: Verify Installation

```bash
# Check application logs
docker compose logs app

# You should see: "Migration completed successfully"
# and "Server started on port 3000"

# Check database logs
docker compose logs db

# Test the application
curl http://localhost:3000/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"...","database":"connected"}
```

### Step 8: Configure Firewall

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH (IMPORTANT - don't lock yourself out!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow app port (if not using Nginx)
sudo ufw allow 3000/tcp

# Check firewall status
sudo ufw status
```

### Step 9: Access Your Application

**Without Nginx (Testing):**
```
http://YOUR_SERVER_IP:3000
```

**Important:** Replace `YOUR_SERVER_IP` with your actual server IP address.

Test these URLs:
- Landing page: `http://YOUR_SERVER_IP:3000/`
- Configurator: `http://YOUR_SERVER_IP:3000/configurator`
- Dashboard: `http://YOUR_SERVER_IP:3000/dashboard`
- Admin: `http://YOUR_SERVER_IP:3000/quotes`
- Health check: `http://YOUR_SERVER_IP:3000/api/health`

---

## 🌐 Step 10: Set Up Nginx (Recommended for Production)

### Option A: Automated Setup (Easiest)

```bash
# Navigate to nginx directory
cd /opt/neon-shop/nginx

# Run automated setup script
sudo ./setup-nginx.sh
```

The script will ask you:
1. Your domain name
2. Your email for SSL certificate
3. Configuration type (choose 2 for production)

That's it! The script handles everything automatically.

### Option B: Manual Setup

If you prefer manual setup:

```bash
# Install Nginx and Certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# Copy production configuration
sudo cp /opt/neon-shop/nginx/neon-shop-production.conf /etc/nginx/sites-available/neon-shop

# Update domain name (replace yourdomain.com with your actual domain)
sudo sed -i 's/yourdomain.com/YOUR_DOMAIN.com/g' /etc/nginx/sites-available/neon-shop

# Enable site
sudo ln -s /etc/nginx/sites-available/neon-shop /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx

# Obtain SSL certificate
sudo certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Update Environment Variables for Domain

```bash
# Navigate back to project directory
cd /opt/neon-shop

# Edit .env file
nano .env

# Change NEXT_PUBLIC_APP_URL to:
# NEXT_PUBLIC_APP_URL=https://YOUR_DOMAIN.com

# Save and exit (Ctrl+X, Y, Enter)

# Restart the app
docker compose restart app
```

---

## ✅ Verification Checklist

After setup, verify everything is working:

- [ ] Docker is installed: `docker --version`
- [ ] Docker Compose is installed: `docker compose version`
- [ ] Services are running: `docker compose ps`
- [ ] Database is connected: `curl http://localhost:3000/api/health`
- [ ] Application is accessible: Open browser to `http://YOUR_SERVER_IP:3000`
- [ ] Firewall is configured: `sudo ufw status`
- [ ] Nginx is running (if installed): `sudo systemctl status nginx`
- [ ] SSL is working (if configured): Visit `https://yourdomain.com`

---

## 🔧 Useful Commands

### Docker Management

```bash
# View running containers
docker compose ps

# View logs (all services)
docker compose logs

# View logs (specific service)
docker compose logs app
docker compose logs db

# Follow logs in real-time
docker compose logs -f app

# Restart services
docker compose restart

# Stop services
docker compose down

# Stop and remove all data (WARNING: deletes database!)
docker compose down -v

# Rebuild after code changes
docker compose build
docker compose up -d
```

### Application Management

```bash
# Check application status
curl http://localhost:3000/api/health

# Restart just the app
docker compose restart app

# View app container shell
docker compose exec app sh

# Run Prisma commands
docker compose exec app npx prisma migrate deploy
docker compose exec app npx prisma generate
docker compose exec app npx prisma studio
```

### Database Management

```bash
# Access PostgreSQL shell
docker compose exec db psql -U neonshop_user -d neonshop

# Create database backup
docker compose exec db pg_dump -U neonshop_user neonshop > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database from backup
docker compose exec -T db psql -U neonshop_user -d neonshop < backup_20250104_120000.sql

# View database logs
docker compose logs db
```

### Nginx Management (if installed)

```bash
# Check Nginx status
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx

# Reload configuration (no downtime)
sudo systemctl reload nginx

# Test configuration
sudo nginx -t

# View access logs
sudo tail -f /var/log/nginx/neon-shop-access.log

# View error logs
sudo tail -f /var/log/nginx/neon-shop-error.log

# Check SSL certificate
sudo certbot certificates

# Manually renew SSL
sudo certbot renew
```

### System Monitoring

```bash
# Check disk usage
df -h

# Check Docker disk usage
docker system df

# Clean up Docker resources
docker system prune -a

# Check memory usage
free -h

# Check running processes
top

# Check port usage
sudo netstat -tlnp | grep -E ':(80|443|3000|5432)'
```

---

## 🐛 Troubleshooting

### Issue: Can't access the application

**Solution 1: Check if services are running**
```bash
docker compose ps
```

**Solution 2: Check firewall**
```bash
sudo ufw status
# Make sure port 3000 (or 80/443) is allowed
```

**Solution 3: Check logs**
```bash
docker compose logs app
```

### Issue: Database connection error

**Solution:**
```bash
# Check database is running
docker compose ps db

# Check database logs
docker compose logs db

# Verify DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Restart services
docker compose restart
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Find what's using the port
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Or change the port in .env
nano .env
# Change APP_PORT=3000 to APP_PORT=3001
docker compose down
docker compose up -d
```

### Issue: Permission denied errors

**Solution:**
```bash
# Fix ownership
sudo chown -R $USER:$USER /opt/neon-shop

# Fix Docker socket permissions
sudo chmod 666 /var/run/docker.sock

# Or add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Issue: Nginx configuration test fails

**Solution:**
```bash
# Test configuration
sudo nginx -t

# Check for syntax errors in the output
# Common issues:
# - Missing semicolons
# - Wrong file paths
# - Duplicate server names

# View detailed error
sudo nginx -T
```

### Issue: SSL certificate fails

**Solution:**
```bash
# Make sure DNS is pointing to your server
# Check with:
dig YOUR_DOMAIN.com

# Make sure port 80 is accessible
curl http://YOUR_DOMAIN.com

# Try obtaining certificate manually
sudo certbot certonly --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com

# Check Certbot logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

### Issue: Out of disk space

**Solution:**
```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a --volumes

# Remove old logs
sudo journalctl --vacuum-time=3d

# Clean apt cache
sudo apt clean
```

---

## 🔄 Updating the Application

When you need to update the application with new code:

```bash
# Navigate to project directory
cd /opt/neon-shop

# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose build
docker compose up -d

# Check logs
docker compose logs -f app
```

---

## 📦 Database Backup Automation

Create an automated backup script:

```bash
# Create backup directory
mkdir -p /opt/neon-shop/backups

# Create backup script
nano /opt/neon-shop/backup.sh
```

Paste this content:

```bash
#!/bin/bash
BACKUP_DIR="/opt/neon-shop/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
cd /opt/neon-shop
docker compose exec -T db pg_dump -U neonshop_user neonshop > "$BACKUP_DIR/backup_$DATE.sql"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql"
```

Make it executable:

```bash
chmod +x /opt/neon-shop/backup.sh
```

Set up daily backup (runs at 2 AM):

```bash
# Edit crontab
crontab -e

# Add this line:
0 2 * * * /opt/neon-shop/backup.sh >> /opt/neon-shop/backups/backup.log 2>&1
```

---

## 🔐 Security Checklist

- [ ] Changed default database password in `.env`
- [ ] Secured `.env` file: `chmod 600 .env`
- [ ] UFW firewall enabled and configured
- [ ] SSL certificate installed (if using domain)
- [ ] Regular backups configured
- [ ] Fail2ban installed (optional): `sudo apt install fail2ban`
- [ ] Keep system updated: `sudo apt update && sudo apt upgrade`
- [ ] Strong SSH configuration (disable password auth, use keys)
- [ ] Database port (5432) not exposed externally
- [ ] Docker socket secured

---

## 📊 Performance Optimization

### Enable Swap (if low memory)

```bash
# Create 2GB swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Docker Resource Limits

Edit `docker-compose.yml`:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

---

## 🆘 Getting Help

If you encounter issues:

1. **Check logs**: `docker compose logs -f`
2. **Check service status**: `docker compose ps`
3. **Test health endpoint**: `curl http://localhost:3000/api/health`
4. **Review firewall**: `sudo ufw status`
5. **Check disk space**: `df -h`
6. **Review documentation**:
   - `DEPLOYMENT.md` - Docker deployment guide
   - `nginx/README.md` - Nginx configuration guide
   - `workflow.md` - Development workflow

---

## 📞 Quick Reference

### Important Files
- `.env` - Environment variables
- `docker-compose.yml` - Docker services configuration
- `DEPLOYMENT.md` - Detailed deployment guide
- `nginx/` - Nginx configuration files

### Important URLs (replace with your domain/IP)
- Application: `http://YOUR_SERVER_IP:3000`
- Health Check: `http://YOUR_SERVER_IP:3000/api/health`
- Configurator: `http://YOUR_SERVER_IP:3000/configurator`
- Admin: `http://YOUR_SERVER_IP:3000/quotes`

### Default Credentials
- Database User: Set in `.env` as `POSTGRES_USER`
- Database Password: Set in `.env` as `POSTGRES_PASSWORD`
- Database Name: Set in `.env` as `POSTGRES_DB`

---

**Setup completed! Your Neon Shop is now running! 🎉**

For questions or issues, refer to the troubleshooting section or check the logs.

---

**Last Updated**: January 2025
