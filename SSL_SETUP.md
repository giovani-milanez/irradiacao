# SSL Certificate Setup with Let's Encrypt

This project uses Let's Encrypt certificates via Certbot for HTTPS support on `irradiacao.heliogabriel.com`.

## Initial Setup

### Prerequisites
- Domain `irradiacao.heliogabriel.com` must point to your server's IP address
- **Ports 80 and 443 must be open in your AWS Security Group:**
  - Port 80 (HTTP): Required for Let's Encrypt validation
  - Port 443 (HTTPS): Required for HTTPS traffic
- Docker and Docker Compose must be installed

### AWS Security Group Configuration
Before running the setup, ensure your EC2 instance's security group allows inbound traffic:
```
Type: HTTP
Protocol: TCP
Port: 80
Source: 0.0.0.0/0 (Anywhere)

Type: HTTPS
Protocol: TCP
Port: 443
Source: 0.0.0.0/0 (Anywhere)
```

### Steps to Get Your First Certificate

1. **First, run the diagnostic script to verify your setup:**
   ```bash
   ./check-setup.sh
   ```
   
   This will verify:
   - Docker and Docker Compose are installed
   - DNS is pointing to your server
   - Ports are properly configured
   - No firewall issues

2. **If all checks pass, run the initialization script on your EC2 instance:**
   ```bash
   ./init-letsencrypt.sh
   ```

   This script will:
   - Switch nginx to a temporary HTTP-only configuration
   - Start nginx without SSL requirements
   - Request a real certificate from Let's Encrypt using webroot validation
   - Switch back to the SSL configuration
   - Restart nginx with HTTPS enabled

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

### Connection Refused Error
If you see "Connection refused" during certificate acquisition:
1. Check that port 80 is open in your AWS Security Group
2. Verify nginx is running: `docker compose ps`
3. Test local access: `curl http://localhost/.well-known/acme-challenge/test`
4. Check nginx logs: `docker compose logs web`

### Timeout During Connect
If Let's Encrypt reports timeout errors:
1. Verify your domain DNS is pointing to your EC2 instance public IP
2. Check AWS Security Group allows inbound traffic on port 80 from anywhere (0.0.0.0/0)
3. Ensure no firewall rules on the EC2 instance are blocking port 80:
   ```bash
   sudo iptables -L -n | grep 80
   ```

### Certificate not found error
If nginx fails to start due to missing certificates, run `./init-letsencrypt.sh` to generate them.

### Rate limiting errors
If you hit Let's Encrypt rate limits, wait a few hours and try again. Use staging mode (edit `staging=1` in the script) for testing to avoid limits.

### Port 80 or 443 already in use
Make sure no other services are using these ports:
```bash
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```
On your EC2 instance, stop any conflicting services:
```bash
sudo systemctl stop apache2  # If Apache is installed
sudo systemctl stop nginx    # If system nginx is installed
```

### Checking certificate expiration
```bash
docker compose run --rm certbot certificates
```

### Domain not resolving
Verify your domain resolves to your EC2 public IP:
```bash
dig irradiacao.heliogabriel.com +short
curl -I http://irradiacao.heliogabriel.com
```

## Security Notes

- Certificates are stored in Docker volumes: `certbot-etc` and `certbot-var`
- The nginx configuration already includes strong SSL settings (TLS 1.2+, secure ciphers)
- Consider backing up the `certbot-etc` volume regularly

