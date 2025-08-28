#!/bin/bash

# Build script for Tailwind CSS

echo "Building Tailwind CSS..."

# Check if tailwindcss binary exists
if [ ! -f "./tailwindcss" ]; then
    echo "Tailwind CSS binary not found. Running setup..."
    ./setup-tailwind.sh
fi

# Build CSS with Tailwind
./tailwindcss -c assets/tailwind.config.js -i assets/css/input.css -o assets/css/output.css --minify

echo "Build complete! Output saved to assets/css/output.css"