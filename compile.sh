#!/bin/bash

# Compile latest version
npm run build

# Read the version number from the manifest.json file
version=$(grep -o -E '"version": *"[^"]*"' dist/manifest.json | awk -F'"' '{print $4}')

# Construct the filename
file_name="push-button-publishing-$version.zip"

# Compile the distribution:
cd dist && zip -r ../archives/$file_name ./* -x .* && cd ..

echo
echo "Version compiled: $file_name"
echo