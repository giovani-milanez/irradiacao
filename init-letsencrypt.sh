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

echo "### Stopping any running web container ..."
docker compose stop web
docker compose rm -f web

echo "### Switching to temporary nginx config (no SSL) ..."
# Backup the current config and use the init config
cp ./nginx/nginx.conf ./nginx/nginx.conf.backup
cp ./nginx/nginx-init.conf ./nginx/nginx.conf

echo "### Starting nginx with temporary config ..."
docker compose up -d web

echo "### Waiting for nginx to be ready ..."
sleep 5

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
  echo "### Certificate obtained successfully!"
  echo "### Restoring SSL nginx config ..."
  mv ./nginx/nginx.conf.backup ./nginx/nginx.conf
  
  echo "### Restarting nginx with SSL config ..."
  docker compose stop web
  docker compose up -d web
  
  echo "### Setup complete! Your site should now be accessible via HTTPS."
else
  echo "### Certificate request failed!"
  echo "### Restoring original nginx config ..."
  mv ./nginx/nginx.conf.backup ./nginx/nginx.conf
  echo "### Please check the error messages above and try again."
  exit 1
fi

