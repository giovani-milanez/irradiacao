#!/bin/bash

# Renew Let's Encrypt certificates

echo "### Renewing certificates ..."
docker compose run --rm certbot renew

echo "### Reloading nginx ..."
docker compose exec web nginx -s reload

echo "### Certificate renewal complete!"

