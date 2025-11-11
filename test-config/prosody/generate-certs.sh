#!/bin/bash
# Generate self-signed certificates for testing

set -e

CERT_DIR="$(dirname "$0")/certs"
mkdir -p "$CERT_DIR"

echo "Generating self-signed certificate for localhost..."

openssl req -new -x509 -days 3650 -nodes \
    -out "$CERT_DIR/localhost.crt" \
    -keyout "$CERT_DIR/localhost.key" \
    -subj "/C=US/ST=Test/L=Test/O=Discordant Test/CN=localhost"

chmod 644 "$CERT_DIR/localhost.crt"
chmod 600 "$CERT_DIR/localhost.key"

echo "✓ Certificates generated in $CERT_DIR"
