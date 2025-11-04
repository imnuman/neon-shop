# Nginx Configuration for Neon Shop

This directory contains production-ready Nginx configurations for deploying Neon Shop.

## 📁 Files Overview

### Configuration Files

1. **`neon-shop-basic.conf`**
   - Simple HTTP configuration
   - Good for development/testing
   - No SSL, minimal features
   - Quick to set up

2. **`neon-shop-production.conf`**
   - Full production configuration
   - HTTPS with SSL/TLS best practices
   - Security headers (HSTS, CSP, etc.)
   - Rate limiting to prevent abuse
   - Static asset caching
   - Gzip compression
   - Optimized proxy settings

3. **`conf.d/nginx.conf`**
   - Configuration for Docker container setup
   - Uses Docker service names (app:3000)
   - Includes both HTTP and HTTPS options
   - Commented sections for easy customization

### Setup Scripts

4. **`setup-nginx.sh`**
   - Automated installation script
   - Installs Nginx and Certbot
   - Configures SSL with Let's Encrypt
   - Sets up firewall rules
   - Makes setup process simple

### Docker Setup

5. **`docker-compose-with-nginx.yml`**
   - Complete stack with Nginx container
   - Includes app, database, and Nginx
   - Certbot container for SSL renewal
   - Everything runs in Docker

## 🚀 Quick Start

### Option 1: System Nginx (Recommended)

Install Nginx directly on your Ubuntu server:

```bash
# Navigate to nginx directory
cd nginx

# Run automated setup script
sudo ./setup-nginx.sh
```

The script will:
- Install Nginx and dependencies
- Configure your domain
- Set up SSL with Let's Encrypt
- Configure firewall
- Start services

### Option 2: Docker Container

Run Nginx in a Docker container:

```bash
# From project root
docker compose -f nginx/docker-compose-with-nginx.yml up -d
```

## 📋 Configuration Comparison

| Feature | Basic | Production | Docker |
|---------|-------|------------|--------|
| **SSL/HTTPS** | ❌ | ✅ | ✅ (manual setup) |
| **Rate Limiting** | ❌ | ✅ | ✅ |
| **Security Headers** | ❌ | ✅ | ✅ |
| **Caching** | ❌ | ✅ | ⚠️ (basic) |
| **Gzip Compression** | ❌ | ✅ | ✅ |
| **Load Balancing** | ❌ | ✅ Ready | ✅ Ready |
| **Health Checks** | ✅ | ✅ | ✅ |

## 🔧 Manual Installation

### Step 1: Install Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

### Step 2: Choose Configuration

Copy the appropriate config file:

```bash
# For basic setup
sudo cp neon-shop-basic.conf /etc/nginx/sites-available/neon-shop

# OR for production
sudo cp neon-shop-production.conf /etc/nginx/sites-available/neon-shop
```

### Step 3: Update Domain

Edit the configuration file:

```bash
sudo nano /etc/nginx/sites-available/neon-shop
```

Replace `yourdomain.com` with your actual domain.

### Step 4: Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/neon-shop /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 5: Set Up SSL (Production Only)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## 🐳 Docker Container Setup

### Prerequisites

- Docker and Docker Compose installed
- SSL certificates (if using HTTPS)

### Setup Steps

1. **Prepare SSL certificates** (if using HTTPS)
   ```bash
   # Place your SSL certificates in nginx/ssl/
   mkdir -p nginx/ssl/live/yourdomain.com/
   # Copy fullchain.pem, privkey.pem, chain.pem
   ```

2. **Update configuration**
   ```bash
   # Edit nginx/conf.d/nginx.conf
   nano nginx/conf.d/nginx.conf

   # Update server_name with your domain
   # Uncomment HTTPS server block if using SSL
   ```

3. **Start services**
   ```bash
   docker compose -f nginx/docker-compose-with-nginx.yml up -d
   ```

4. **Check status**
   ```bash
   docker compose -f nginx/docker-compose-with-nginx.yml ps
   docker compose -f nginx/docker-compose-with-nginx.yml logs nginx
   ```

## 🔒 Security Features

### Production Configuration Includes:

- **SSL/TLS**: TLS 1.2 and 1.3 only with strong ciphers
- **HSTS**: HTTP Strict Transport Security
- **CSP**: Content Security Policy headers
- **XSS Protection**: X-XSS-Protection headers
- **Clickjacking**: X-Frame-Options SAMEORIGIN
- **MIME Sniffing**: X-Content-Type-Options nosniff
- **Rate Limiting**:
  - General: 10 requests/second
  - API: 30 requests/second
  - Quotes: 5 requests/second
- **Hidden Files**: Blocks access to .env, .git, etc.

## ⚡ Performance Features

### Caching Strategy

1. **Static Assets** (`/_next/static/`): 1 year cache
2. **Images** (`/_next/image`): 7 days cache
3. **Public Files**: 30 days cache
4. **API Endpoints**: No caching

### Compression

- Gzip compression enabled
- Compression level: 6
- Compressed types: HTML, CSS, JS, JSON, SVG

### Proxy Optimization

- Keep-alive connections
- Buffering enabled
- Optimized timeouts
- Connection pooling

## 🔍 Monitoring

### Check Nginx Status

```bash
sudo systemctl status nginx
```

### View Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/neon-shop-access.log

# Error logs
sudo tail -f /var/log/nginx/neon-shop-error.log

# Filter by status code
grep "HTTP/1.1\" 500" /var/log/nginx/neon-shop-access.log
```

### Test Health Endpoint

```bash
curl http://localhost/api/health
curl https://yourdomain.com/api/health
```

### Check Cache Status

Look for `X-Cache-Status` header:

```bash
curl -I https://yourdomain.com/_next/static/somefile.js
```

## 🛠️ Troubleshooting

### Configuration Test Failed

```bash
# Check for syntax errors
sudo nginx -t

# Common issues:
# - Missing semicolons
# - Incorrect file paths
# - Invalid directives
```

### SSL Certificate Issues

```bash
# Check certificate expiry
sudo certbot certificates

# Manually renew
sudo certbot renew

# Check certificate files
sudo ls -la /etc/letsencrypt/live/yourdomain.com/
```

### Port Already in Use

```bash
# Check what's using port 80/443
sudo lsof -i :80
sudo lsof -i :443

# Stop Apache if installed
sudo systemctl stop apache2
sudo systemctl disable apache2
```

### Permission Denied

```bash
# Fix ownership
sudo chown -R www-data:www-data /var/cache/nginx/neon-shop

# Fix permissions
sudo chmod 755 /var/cache/nginx/neon-shop
```

### High CPU Usage

Check rate limiting is working:

```bash
# View rate limit rejections
grep "limiting requests" /var/log/nginx/neon-shop-error.log

# Adjust rate limits in config if needed
```

## 📊 Load Balancing

To add multiple app servers, edit the upstream block:

```nginx
upstream neon_shop_backend {
    # Add multiple servers
    server localhost:3000 max_fails=3 fail_timeout=30s;
    server localhost:3001 max_fails=3 fail_timeout=30s;
    server localhost:3002 max_fails=3 fail_timeout=30s;

    # Load balancing method (default is round-robin)
    # least_conn;  # Use least connections
    # ip_hash;     # Sticky sessions based on client IP

    keepalive 32;
}
```

## 🔄 Updates and Maintenance

### Update Configuration

```bash
# Edit config
sudo nano /etc/nginx/sites-available/neon-shop

# Test changes
sudo nginx -t

# Apply changes
sudo systemctl reload nginx
```

### Nginx Updates

```bash
# Update Nginx
sudo apt update
sudo apt upgrade nginx

# Restart after major updates
sudo systemctl restart nginx
```

### Clean Cache

```bash
# Clear Nginx cache
sudo rm -rf /var/cache/nginx/neon-shop/*

# Reload Nginx
sudo systemctl reload nginx
```

## 📚 Additional Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Nginx Performance Tuning](https://www.nginx.com/blog/tuning-nginx/)

## 🆘 Getting Help

If you encounter issues:

1. Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
2. Test configuration: `sudo nginx -t`
3. Check service status: `sudo systemctl status nginx`
4. Verify ports are open: `sudo netstat -tlnp | grep nginx`
5. Review firewall rules: `sudo ufw status`

---

**Last Updated**: January 2025
