# Neon Shop - Docker Deployment Guide

This guide explains how to deploy Neon Shop on your Ubuntu server using Docker.

## 📋 Prerequisites

### Required Software
- **Ubuntu Server** (20.04 LTS or later recommended)
- **Docker** (20.10+)
- **Docker Compose** (2.0+)
- **Git**

### Server Requirements
- **CPU**: 2+ cores recommended
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 20GB minimum
- **Ports**: 3000 (app), 5432 (database - optional if exposing)

---

## 🚀 Quick Start

### 1. Install Docker and Docker Compose

```bash
# Update package index
sudo apt update

# Install required packages
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

# Add current user to docker group (optional - to run without sudo)
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Clone the Repository

```bash
# Clone your repository
git clone https://github.com/yourusername/neon-shop.git
cd neon-shop
```

### 3. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit the environment file
nano .env
```

**Required variables to configure:**

```env
# Database Configuration
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=neonshop

# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
APP_PORT=3000
```

**Important**: Change default passwords and use strong passwords in production!

### 4. Build and Start the Application

```bash
# Build the Docker images
docker compose build

# Start the services
docker compose up -d

# Check if services are running
docker compose ps
```

### 5. Initialize the Database

The database migrations run automatically when the app starts. To verify:

```bash
# Check app logs
docker compose logs app

# You should see "Migration completed successfully"
```

### 6. Access Your Application

Open your browser and navigate to:
- **Application**: `http://your-server-ip:3000`
- **Landing Page**: `http://your-server-ip:3000/`
- **Configurator**: `http://your-server-ip:3000/configurator`
- **Admin Dashboard**: `http://your-server-ip:3000/quotes` (TODO: Add auth)

---

## 🔧 Docker Commands Reference

### Service Management

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Restart all services
docker compose restart

# Stop services and remove volumes (WARNING: deletes database)
docker compose down -v

# View service status
docker compose ps

# View service logs
docker compose logs

# Follow logs in real-time
docker compose logs -f

# View logs for specific service
docker compose logs app
docker compose logs db
```

### Database Operations

```bash
# Access PostgreSQL shell
docker compose exec db psql -U postgres -d neonshop

# Create database backup
docker compose exec db pg_dump -U postgres neonshop > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database from backup
docker compose exec -T db psql -U postgres -d neonshop < backup_20250101_120000.sql

# Run Prisma migrations manually
docker compose exec app npx prisma migrate deploy

# Generate Prisma client
docker compose exec app npx prisma generate

# Access Prisma Studio (for database management)
docker compose exec app npx prisma studio
```

### Application Operations

```bash
# Rebuild app after code changes
docker compose build app
docker compose up -d app

# Execute command inside app container
docker compose exec app sh

# View real-time app logs
docker compose logs -f app

# Restart only the app service
docker compose restart app
```

---

## 🌐 Production Deployment with Nginx

We provide production-ready Nginx configurations in the `nginx/` directory with:
- ✅ SSL/TLS with Let's Encrypt
- ✅ Security headers (HSTS, CSP, XSS protection)
- ✅ Rate limiting
- ✅ Static asset caching
- ✅ Gzip compression
- ✅ Load balancing ready

### Quick Setup with Automated Script

The easiest way to set up Nginx:

```bash
# Navigate to nginx directory
cd nginx

# Run automated setup script
sudo ./setup-nginx.sh
```

The script will:
1. Install Nginx and Certbot
2. Configure your domain
3. Set up SSL with Let's Encrypt
4. Configure firewall rules
5. Start and enable services

**For detailed Nginx documentation, see [`nginx/README.md`](nginx/README.md)**

### Manual Setup Options

#### Option 1: Basic HTTP Setup (Development)

```bash
# Copy basic configuration
sudo cp nginx/neon-shop-basic.conf /etc/nginx/sites-available/neon-shop

# Update domain name
sudo sed -i 's/yourdomain.com/your-actual-domain.com/g' /etc/nginx/sites-available/neon-shop

# Enable site
sudo ln -s /etc/nginx/sites-available/neon-shop /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default site
sudo nginx -t
sudo systemctl reload nginx
```

#### Option 2: Production Setup with SSL

```bash
# Install dependencies
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# Copy production configuration
sudo cp nginx/neon-shop-production.conf /etc/nginx/sites-available/neon-shop

# Update domain name
sudo sed -i 's/yourdomain.com/your-actual-domain.com/g' /etc/nginx/sites-available/neon-shop

# Enable site
sudo ln -s /etc/nginx/sites-available/neon-shop /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t
sudo systemctl reload nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-actual-domain.com -d www.your-actual-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

#### Option 3: Docker Container Setup

Run Nginx as a Docker container:

```bash
# Use the alternative docker-compose file with Nginx container
docker compose -f nginx/docker-compose-with-nginx.yml up -d

# View logs
docker compose -f nginx/docker-compose-with-nginx.yml logs nginx
```

### Update Environment Variables

Update `.env` with your domain:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

Restart the app:

```bash
docker compose restart app
```

### Configuration Files Available

| File | Purpose |
|------|---------|
| `nginx/neon-shop-basic.conf` | Simple HTTP setup |
| `nginx/neon-shop-production.conf` | Full production with SSL, caching, security |
| `nginx/conf.d/nginx.conf` | Docker container configuration |
| `nginx/setup-nginx.sh` | Automated installation script |
| `nginx/docker-compose-with-nginx.yml` | Full stack with Nginx container |
| `nginx/README.md` | Comprehensive Nginx documentation |

**📚 For troubleshooting, monitoring, and advanced configuration, see [`nginx/README.md`](nginx/README.md)**

---

## 🔒 Security Best Practices

### 1. Firewall Configuration

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Optional: Allow PostgreSQL only from localhost (if needed externally)
# sudo ufw allow from any to any port 5432 proto tcp

# Check firewall status
sudo ufw status
```

### 2. Secure Database

- **Change default passwords** in `.env`
- **Don't expose PostgreSQL port** externally (remove ports section from docker-compose.yml if not needed)
- **Regular backups**: Set up automated database backups
- **Use strong passwords**: Minimum 16 characters with mixed case, numbers, symbols

### 3. Environment Variables

```bash
# Secure .env file permissions
chmod 600 .env

# Never commit .env to git
# (already in .gitignore)
```

### 4. Keep Docker Updated

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker compose pull
docker compose up -d
```

---

## 📊 Monitoring and Logs

### Application Logs

```bash
# View all logs
docker compose logs

# View app logs only
docker compose logs app -f

# View last 100 lines
docker compose logs --tail=100 app

# Save logs to file
docker compose logs > logs_$(date +%Y%m%d_%H%M%S).txt
```

### Container Health Check

```bash
# Check container health status
docker compose ps

# Inspect container health
docker inspect neon-shop-app | grep -A 10 Health

# Manual health check
curl http://localhost:3000/api/health
```

### Disk Usage

```bash
# Check Docker disk usage
docker system df

# Clean up unused resources
docker system prune -a

# Remove unused volumes
docker volume prune
```

---

## 🔄 Updating the Application

### Standard Update Process

```bash
# Navigate to project directory
cd /path/to/neon-shop

# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose build
docker compose up -d

# Check if services are running
docker compose ps

# View logs
docker compose logs -f app
```

### Zero-Downtime Update (Advanced)

```bash
# Build new image
docker compose build app

# Scale up (run old and new version)
docker compose up -d --scale app=2 --no-recreate

# Wait for new container to be healthy
sleep 30

# Remove old container
docker compose up -d --scale app=1
```

---

## 🐛 Troubleshooting

### Application Won't Start

```bash
# Check logs
docker compose logs app

# Check if database is ready
docker compose ps db

# Restart services
docker compose restart
```

### Database Connection Issues

```bash
# Check database logs
docker compose logs db

# Verify DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Test database connection
docker compose exec db psql -U postgres -d neonshop -c "SELECT 1;"
```

### Port Already in Use

```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Or change APP_PORT in .env
```

### Reset Everything (Fresh Start)

```bash
# Stop and remove everything including volumes
docker compose down -v

# Remove all images
docker compose rm -f

# Rebuild from scratch
docker compose build --no-cache
docker compose up -d
```

### Permission Issues

```bash
# Fix ownership of files
sudo chown -R $USER:$USER .

# Fix Docker socket permissions
sudo chmod 666 /var/run/docker.sock
```

---

## 📦 Backup and Restore

### Automated Backup Script

Create backup script:

```bash
nano backup.sh
```

Add the following:

```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker compose exec -T db pg_dump -U postgres neonshop > "$BACKUP_DIR/db_backup_$DATE.sql"

# Backup environment file
cp .env "$BACKUP_DIR/env_backup_$DATE"

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete

echo "Backup completed: $DATE"
```

Make executable and schedule:

```bash
chmod +x backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line: 0 2 * * * /path/to/neon-shop/backup.sh
```

### Restore from Backup

```bash
# Stop the application
docker compose down

# Start only database
docker compose up -d db

# Wait for database to be ready
sleep 10

# Restore database
docker compose exec -T db psql -U postgres -d neonshop < backup_20250101_120000.sql

# Start application
docker compose up -d
```

---

## 🎯 Performance Optimization

### Docker Resource Limits

Add to `docker-compose.yml` under each service:

```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 2G
    reservations:
      cpus: '1'
      memory: 1G
```

### Enable Docker BuildKit

Add to `.env` or set globally:

```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

### Database Optimization

```sql
-- Connect to database
docker compose exec db psql -U postgres -d neonshop

-- Analyze and optimize
VACUUM ANALYZE;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

---

## 📞 Support and Resources

- **Project Repository**: https://github.com/yourusername/neon-shop
- **Docker Documentation**: https://docs.docker.com
- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs

---

## 📝 Checklist for Production Deployment

- [ ] Update all passwords in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper domain in `NEXT_PUBLIC_APP_URL`
- [ ] Set up Nginx reverse proxy
- [ ] Install SSL certificate (Let's Encrypt)
- [ ] Configure firewall (UFW)
- [ ] Set up automated database backups
- [ ] Configure monitoring and alerting
- [ ] Test application functionality
- [ ] Document custom configurations
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure log rotation

---

**Last Updated**: January 2025
**Maintained By**: Neon Shop Development Team
