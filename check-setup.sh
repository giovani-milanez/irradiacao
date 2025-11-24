#!/bin/bash

# Pre-flight checks before running init-letsencrypt.sh

echo "==================================="
echo "SSL Certificate Setup Pre-flight Check"
echo "==================================="
echo ""

# Check if Docker is installed
echo "1. Checking Docker..."
if command -v docker &> /dev/null; then
    echo "   ✓ Docker is installed: $(docker --version)"
else
    echo "   ✗ Docker is NOT installed"
    exit 1
fi

# Check if Docker Compose is available
echo ""
echo "2. Checking Docker Compose..."
if docker compose version &> /dev/null; then
    echo "   ✓ Docker Compose is available: $(docker compose version)"
else
    echo "   ✗ Docker Compose is NOT available"
    exit 1
fi

# Check if containers are running
echo ""
echo "3. Checking running containers..."
docker compose ps

# Check DNS resolution
echo ""
echo "4. Checking DNS resolution for irradiacao.heliogabriel.com..."
DOMAIN_IP=$(dig +short irradiacao.heliogabriel.com | tail -n1)
if [ -z "$DOMAIN_IP" ]; then
    echo "   ✗ Domain does not resolve"
else
    echo "   ✓ Domain resolves to: $DOMAIN_IP"
fi

# Check server's public IP
echo ""
echo "5. Checking server's public IP..."
SERVER_IP=$(curl -s ifconfig.me || curl -s icanhazip.com || echo "Unable to detect")
echo "   Server public IP: $SERVER_IP"

if [ "$DOMAIN_IP" = "$SERVER_IP" ]; then
    echo "   ✓ Domain points to this server"
elif [ -n "$DOMAIN_IP" ]; then
    echo "   ✗ Domain points to $DOMAIN_IP but server IP is $SERVER_IP"
    echo "   Please update your DNS records"
else
    echo "   ! Unable to verify DNS configuration"
fi

# Check if port 80 is accessible
echo ""
echo "6. Checking if port 80 is listening..."
if netstat -tuln 2>/dev/null | grep -q ':80 ' || ss -tuln 2>/dev/null | grep -q ':80 '; then
    echo "   ✓ Port 80 is listening"
else
    echo "   ! Port 80 is not listening (this is OK if nginx isn't started yet)"
fi

# Check if port 443 is accessible
echo ""
echo "7. Checking if port 443 is listening..."
if netstat -tuln 2>/dev/null | grep -q ':443 ' || ss -tuln 2>/dev/null | grep -q ':443 '; then
    echo "   ✓ Port 443 is listening"
else
    echo "   ! Port 443 is not listening (this is OK if nginx isn't started yet)"
fi

# Check firewall rules
echo ""
echo "8. Checking local firewall (iptables)..."
if command -v iptables &> /dev/null; then
    RULES=$(sudo iptables -L -n 2>/dev/null | grep -E '(80|443)' || echo "none")
    if [ "$RULES" = "none" ]; then
        echo "   ✓ No blocking iptables rules found for ports 80/443"
    else
        echo "   ! Firewall rules found:"
        echo "$RULES" | sed 's/^/     /'
    fi
else
    echo "   ! iptables not available"
fi

echo ""
echo "==================================="
echo "Pre-flight Check Complete"
echo "==================================="
echo ""
echo "IMPORTANT: Make sure your AWS Security Group allows:"
echo "  - Inbound TCP port 80 from 0.0.0.0/0"
echo "  - Inbound TCP port 443 from 0.0.0.0/0"
echo ""
echo "If all checks pass, you can now run:"
echo "  ./init-letsencrypt.sh"

