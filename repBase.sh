#!/bin/bash

# Find all files in the directory and replace %PUBLIC_URL% with an empty string
find "$1" -type f -exec perl -pi -e 's/%PUBLIC_URL%//g' {} +

echo "Replacement completed."
