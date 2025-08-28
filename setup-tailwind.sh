#!/bin/bash

# Script to download and setup Tailwind CSS standalone CLI

# Detect OS and architecture
OS=$(uname -s)
ARCH=$(uname -m)

# Set the download URL based on OS and architecture
URL="https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-macos-arm64"

echo "Downloading Tailwind CSS standalone CLI..."
echo "URL: $URL"
curl -sLO "$URL"
mv tailwindcss-macos-arm64 tailwindcss

# Make it executable
chmod +x tailwindcss

echo "Tailwind CSS standalone CLI downloaded successfully!"
echo ""
echo "Usage:"
echo "  Build CSS: ./tailwindcss -c assets/tailwind.config.js -i assets/css/input.css -o assets/css/output.css --watch"
echo "  Minified build: ./tailwindcss -c assets/tailwind.config.js -i assets/css/input.css -o assets/css/output.css --minify"