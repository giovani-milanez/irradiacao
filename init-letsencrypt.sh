#!/bin/bash

# Initialize Let's Encrypt certificate for irradiacao.heliogabriel.com

if ! [ -x "$(command -v docker)" ]; then
  echo 'Error: docker is not installed.' >&2
  exit 1
fi

domains=(irradiacao.heliogabriel.com)
rsa_key_size=4096
email="irradiacao@heliogabriel.com"
staging=0 # Set to 1 if you're testing your setup to avoid hitting request limits

echo "### Ensuring backend services are running ..."
docker compose up -d db goapp nextapp

echo "### Waiting for backend services to be ready ..."
sleep 10

echo "### Stopping any running web container ..."
docker compose stop web 2>/dev/null || true
docker compose rm -f web 2>/dev/null || true

echo "### Switching to temporary nginx config (no SSL) ..."
# Backup the current config and use the init config
if [ ! -f ./nginx/nginx.conf.backup ]; then
  cp ./nginx/nginx.conf ./nginx/nginx.conf.backup
fi
cp ./nginx/nginx-init.conf ./nginx/nginx.conf

echo "### Recreating nginx container with temporary config ..."
docker compose up -d --force-recreate web

echo "### Waiting for nginx to be ready ..."
sleep 8

echo "### Checking nginx status ..."
docker compose ps web
docker compose logs --tail=20 web

echo "### Testing if nginx is accessible ..."
docker compose exec web curl -s http://localhost/.well-known/acme-challenge/test || echo "Note: Test request to nginx completed"
echo

echo "### Requesting Let's Encrypt certificate for $domains ..."
# Join $domains to -d args
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Select appropriate email arg
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

docker compose run --rm certbot certonly --webroot -w /tmp/acme-challenge \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal

if [ $? -eq 0 ]; then
  echo ""
  echo "### Certificate obtained successfully!"
  echo "### Restoring SSL nginx config ..."
  cp ./nginx/nginx.conf.backup ./nginx/nginx.conf
  
  echo "### Recreating nginx with SSL config ..."
  docker compose stop web
  docker compose up -d --force-recreate web
  
  echo "### Waiting for nginx to start with SSL ..."
  sleep 5
  
  echo "### Checking nginx status ..."
  docker compose ps web
  docker compose logs --tail=10 web
  
  echo ""
  echo "=========================================="
  echo "✓ Setup complete! Your site should now be accessible via HTTPS."
  echo "✓ Visit: https://irradiacao.heliogabriel.com"
  echo "=========================================="
else
  echo ""
  echo "### Certificate request failed!"
  echo "### Restoring original nginx config ..."
  cp ./nginx/nginx.conf.backup ./nginx/nginx.conf
  docker compose up -d --force-recreate web 2>/dev/null || true
  echo "### Please check the error messages above and try again."
  exit 1
fi

