#!/bin/bash

# Navigate to the backend directory and run yarn install
echo "Installing dependencies in the backend..."
cd backend || { echo "Backend directory not found"; exit 1; }
yarn install

# Navigate to the frontend directory and run yarn install
echo "Installing dependencies in the frontend..."
cd ../frontend || { echo "Frontend directory not found"; exit 1; }
yarn install

echo "All dependencies installed successfully."