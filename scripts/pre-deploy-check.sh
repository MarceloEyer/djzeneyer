#!/bin/bash
# Pre-deploy check script for DJ Zen Eyer

echo "Starting pre-deploy checks..."

echo "Checking lint..."
if ! npm run lint; then
    echo "Lint failed. Aborting."
    exit 1
fi

echo "Checking TypeScript..."
if ! npm run type-check; then
    echo "Type check failed. Aborting."
    exit 1
fi

echo "Synchronizing AI context..."
if ! npm run context:sync; then
    echo "Context sync failed. Aborting."
    exit 1
fi

echo "Checking UTF-8 content integrity..."
if ! npm run utf8:check; then
    echo "UTF-8/mojibake check failed. Aborting."
    exit 1
fi

if [ ! -f "public/robots.txt" ]; then
    echo "Warning: public/robots.txt was not found."
fi

if [ ! -f "public/sitemap.xml" ]; then
    echo "Warning: public/sitemap.xml was not found."
fi

if [ ! -f "src/config/routes-slugs.json" ]; then
    echo "src/config/routes-slugs.json was not found. Aborting."
    exit 1
fi

echo "Pre-deploy checks completed successfully."
exit 0
