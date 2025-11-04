#!/bin/bash

###############################################################################
# Nginx Setup Script for Neon Shop
# This script automates the installation and configuration of Nginx
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[i]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script as root or with sudo"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         Neon Shop - Nginx Setup Script                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Get domain name from user
print_info "Configuration Setup"
read -p "Enter your domain name (e.g., example.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    print_error "Domain name cannot be empty"
    exit 1
fi

# Ask for email for Let's Encrypt
read -p "Enter your email for Let's Encrypt SSL: " EMAIL

if [ -z "$EMAIL" ]; then
    print_error "Email cannot be empty"
    exit 1
fi

# Ask for configuration type
echo ""
print_info "Select Nginx configuration type:"
echo "  1) Basic (HTTP only, no SSL)"
echo "  2) Production (HTTPS with SSL, caching, security headers)"
read -p "Enter your choice [1-2]: " CONFIG_TYPE

# Install Nginx
print_info "Installing Nginx..."
apt update
apt install -y nginx

print_message "Nginx installed successfully"

# Install Certbot for SSL (if production)
if [ "$CONFIG_TYPE" = "2" ]; then
    print_info "Installing Certbot for SSL..."
    apt install -y certbot python3-certbot-nginx
    print_message "Certbot installed successfully"
fi

# Create necessary directories
print_info "Creating directories..."
mkdir -p /var/www/certbot
mkdir -p /var/cache/nginx/neon-shop
mkdir -p /var/log/nginx
chown -R www-data:www-data /var/cache/nginx/neon-shop
print_message "Directories created"

# Determine which config to use
if [ "$CONFIG_TYPE" = "1" ]; then
    CONFIG_FILE="neon-shop-basic.conf"
else
    CONFIG_FILE="neon-shop-production.conf"
fi

# Copy configuration file
print_info "Copying Nginx configuration..."
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

if [ ! -f "$SCRIPT_DIR/$CONFIG_FILE" ]; then
    print_error "Configuration file not found: $SCRIPT_DIR/$CONFIG_FILE"
    exit 1
fi

# Replace domain placeholder
cp "$SCRIPT_DIR/$CONFIG_FILE" "/etc/nginx/sites-available/neon-shop"
sed -i "s/yourdomain.com/$DOMAIN/g" /etc/nginx/sites-available/neon-shop

print_message "Configuration file copied and updated"

# Create symbolic link
print_info "Enabling site..."
ln -sf /etc/nginx/sites-available/neon-shop /etc/nginx/sites-enabled/neon-shop

# Remove default site if exists
if [ -f /etc/nginx/sites-enabled/default ]; then
    print_info "Removing default Nginx site..."
    rm /etc/nginx/sites-enabled/default
fi

# Test Nginx configuration
print_info "Testing Nginx configuration..."
if nginx -t; then
    print_message "Nginx configuration is valid"
else
    print_error "Nginx configuration test failed"
    exit 1
fi

# Reload Nginx
print_info "Reloading Nginx..."
systemctl reload nginx
print_message "Nginx reloaded successfully"

# Set up SSL with Let's Encrypt (if production)
if [ "$CONFIG_TYPE" = "2" ]; then
    echo ""
    print_info "Setting up SSL certificate with Let's Encrypt..."
    print_warning "Make sure your domain DNS is pointing to this server!"
    read -p "Press Enter to continue with SSL setup, or Ctrl+C to cancel..."

    # First, temporarily use basic config for Let's Encrypt challenge
    cp "$SCRIPT_DIR/neon-shop-basic.conf" "/etc/nginx/sites-available/neon-shop-temp"
    sed -i "s/yourdomain.com/$DOMAIN/g" /etc/nginx/sites-available/neon-shop-temp
    ln -sf /etc/nginx/sites-available/neon-shop-temp /etc/nginx/sites-enabled/neon-shop
    systemctl reload nginx

    # Obtain certificate
    if certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "$EMAIL" --redirect; then
        print_message "SSL certificate obtained successfully"

        # Now apply the production config
        ln -sf /etc/nginx/sites-available/neon-shop /etc/nginx/sites-enabled/neon-shop
        systemctl reload nginx

        # Set up auto-renewal
        print_info "Setting up SSL certificate auto-renewal..."
        if ! crontab -l | grep -q certbot; then
            (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -
            print_message "Auto-renewal configured"
        else
            print_warning "Certbot cron job already exists"
        fi
    else
        print_error "Failed to obtain SSL certificate"
        print_warning "You can try manually with: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
        # Fallback to basic config
        cp "$SCRIPT_DIR/neon-shop-basic.conf" "/etc/nginx/sites-available/neon-shop"
        sed -i "s/yourdomain.com/$DOMAIN/g" /etc/nginx/sites-available/neon-shop
        ln -sf /etc/nginx/sites-available/neon-shop /etc/nginx/sites-enabled/neon-shop
        systemctl reload nginx
    fi

    # Generate DH parameters for better security (optional but recommended)
    if [ ! -f /etc/nginx/dhparam.pem ]; then
        print_info "Generating Diffie-Hellman parameters (this may take a few minutes)..."
        openssl dhparam -out /etc/nginx/dhparam.pem 2048
        print_message "DH parameters generated"

        # Uncomment dhparam line in config
        sed -i 's/# ssl_dhparam/ssl_dhparam/' /etc/nginx/sites-available/neon-shop
        systemctl reload nginx
    fi
fi

# Configure firewall
print_info "Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 'Nginx Full'
    ufw allow 'OpenSSH'
    print_message "Firewall rules added"
else
    print_warning "UFW not found, skipping firewall configuration"
fi

# Enable Nginx to start on boot
print_info "Enabling Nginx service..."
systemctl enable nginx
print_message "Nginx service enabled"

# Final status check
echo ""
print_info "Checking Nginx status..."
systemctl status nginx --no-pager || true

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              Setup Completed Successfully!                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
print_message "Nginx is now configured and running"
print_message "Domain: $DOMAIN"

if [ "$CONFIG_TYPE" = "2" ]; then
    print_message "SSL: Enabled with Let's Encrypt"
    print_message "Your site should be accessible at: https://$DOMAIN"
else
    print_message "SSL: Not configured (using HTTP)"
    print_message "Your site should be accessible at: http://$DOMAIN"
fi

echo ""
print_info "Useful commands:"
echo "  - Check Nginx status: systemctl status nginx"
echo "  - Reload Nginx: systemctl reload nginx"
echo "  - Test config: nginx -t"
echo "  - View logs: tail -f /var/log/nginx/neon-shop-access.log"
echo "  - Renew SSL: certbot renew"
echo ""

print_warning "Don't forget to:"
echo "  1. Point your domain's DNS to this server's IP"
echo "  2. Ensure your Next.js app is running (docker-compose up -d)"
echo "  3. Update NEXT_PUBLIC_APP_URL in .env to https://$DOMAIN"
echo ""
