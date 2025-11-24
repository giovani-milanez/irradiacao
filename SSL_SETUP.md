# SSL Certificate Setup with Let's Encrypt

This project uses Let's Encrypt certificates via Certbot for HTTPS support on `irradiacao.heliogabriel.com`.

## Initial Setup

### Prerequisites
- Domain `irradiacao.heliogabriel.com` must point to your server's IP address
- Ports 80 and 443 must be open and accessible from the internet
- Docker and Docker Compose must be installed

### Steps to Get Your First Certificate

1. **Make the initialization script executable:**
   ```bash
   chmod +x init-letsencrypt.sh
   ```

2. **Run the initialization script:**
   ```bash
   ./init-letsencrypt.sh
   ```

   This script will:
   - Create a temporary self-signed certificate
   - Start nginx with the dummy certificate
   - Request a real certificate from Let's Encrypt
   - Reload nginx with the real certificate

3. **Verify HTTPS is working:**
   Visit https://irradiacao.heliogabriel.com in your browser

## Certificate Renewal

Let's Encrypt certificates expire after 90 days. You have two options for renewal:

### Option 1: Manual Renewal
Run the renewal script whenever needed (recommended to run every 60 days):
```bash
chmod +x renew-certificates.sh
./renew-certificates.sh
```

### Option 2: Automatic Renewal with Cron
Set up a cron job to automatically renew certificates:

1. Edit your crontab:
   ```bash
   crontab -e
   ```

2. Add this line to check for renewal twice daily at 2:30 AM and 2:30 PM:
   ```
   30 2,14 * * * cd /home/giovani/dev/git/irradiacao && ./renew-certificates.sh >> /var/log/certbot-renew.log 2>&1
   ```

## Updating the Certbot Configuration

The certbot service in `compose.yaml` is currently set to use staging mode for testing. Once you've verified everything works:

1. Edit `compose.yaml`
2. Find the certbot service command
3. Remove `--staging` from the command to get production certificates
4. Run `docker compose up -d certbot` to apply changes

### Current Certbot Command (Staging):
```yaml
command: certonly --webroot --webroot-path=/tmp/acme-challenge --email irradiacao@heliogabriel.com --agree-tos --no-eff-email --staging -d irradiacao.heliogabriel.com
```

### Production Certbot Command (after testing):
```yaml
command: certonly --webroot --webroot-path=/tmp/acme-challenge --email irradiacao@heliogabriel.com --agree-tos --no-eff-email -d irradiacao.heliogabriel.com
```

## Troubleshooting

### Certificate not found error
If nginx fails to start due to missing certificates, run `./init-letsencrypt.sh` to generate them.

### Rate limiting errors
If you hit Let's Encrypt rate limits, wait a few hours and try again. Use `--staging` flag for testing to avoid limits.

### Port 80 or 443 already in use
Make sure no other services are using these ports:
```bash
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

### Checking certificate expiration
```bash
docker compose run --rm certbot certificates
```

## Security Notes

- Certificates are stored in Docker volumes: `certbot-etc` and `certbot-var`
- The nginx configuration already includes strong SSL settings (TLS 1.2+, secure ciphers)
- Consider backing up the `certbot-etc` volume regularly

