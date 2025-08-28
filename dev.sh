#!/bin/bash

# Development script for Tailwind CSS with watch mode

echo "Starting Tailwind CSS in watch mode..."

# Check if tailwindcss binary exists
if [ ! -f "./tailwindcss" ]; then
    echo "Tailwind CSS binary not found. Running setup..."
    ./setup-tailwind.sh
fi

# Run Tailwind in watch mode
./tailwindcss -c assets/tailwind.config.js -i assets/css/input.css -o assets/css/output.css --watch