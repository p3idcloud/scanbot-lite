#!/bin/bash

# Get the current IP address
CURRENT_IP=$(ipconfig getifaddr en0)

# Define the base URL pattern
BASE_URL="BASE_URL=http://$CURRENT_IP:8000/"
FRONTEND_URL="FRONTEND_URL=http://$CURRENT_IP:3000/"

# Define the .env.development file path
ENV_BACKEND_FILE="./backend/.env.development"
ENV_FRONTEND_FILE="./frontend/.env.development"

# Check if the file exists
if [[ -f "$ENV_BACKEND_FILE" ]]; then
  # Update the BASE_URL line in the .env.development file
  # Use sed to replace the BASE_URL line with the new IP address
  sed -i.bak "s|^BASE_URL=.*|$BASE_URL|" "$ENV_BACKEND_FILE"
  sed -i.bak "s|^FRONTEND_URL=.*|$FRONTEND_URL|" "$ENV_BACKEND_FILE"

  # Check if sed was successful
  if [[ $? -eq 0 ]]; then
    echo "Successfully updated BASE_URL to $BASE_URL in $ENV_BACKEND_FILE"
  else
    echo "Failed to update BASE_URL in $ENV_BACKEND_FILE"
  fi

  # Optionally, remove the backup file created by sed
  rm "$ENV_BACKEND_FILE.bak"
else
  echo "$ENV_BACKEND_FILE does not exist."
fi



# Define the base URL pattern
BACKEND_URL="BACKEND_URL=http://$CURRENT_IP:8000/"
NEXT_PUBLIC_BACKEND_URL="NEXT_PUBLIC_BACKEND_URL=http://$CURRENT_IP:8000/"

# Check if the file exists
if [[ -f "$ENV_FRONTEND_FILE" ]]; then
  # Update the BASE_URL line in the .env.development file
  # Use sed to replace the BASE_URL line with the new IP address
  sed -i.bak "s|^FRONTEND_URL=.*|$FRONTEND_URL|" "$ENV_FRONTEND_FILE"
  sed -i.bak "s|^BASE_URL=.*|$BASE_URL|" "$ENV_FRONTEND_FILE"
  sed -i.bak "s|^BACKEND_URL=.*|$BACKEND_URL|" "$ENV_FRONTEND_FILE"
  sed -i.bak "s|^NEXT_PUBLIC_BACKEND_URL=.*|$NEXT_PUBLIC_BACKEND_URL|" "$ENV_FRONTEND_FILE"

  # Check if sed was successful
  if [[ $? -eq 0 ]]; then
    echo "Successfully updated BASE_URL to $BASE_URL in $ENV_FRONTEND_FILE"
  else
    echo "Failed to update BASE_URL in $ENV_FRONTEND_FILE"
  fi

  # Optionally, remove the backup file created by sed
  rm "$ENV_FRONTEND_FILE.bak"
else
  echo "$ENV_FRONTEND_FILE does not exist."
fi

#!/bin/bash

# Navigate to the backend directory and run yarn dev
echo "Starting backend..."
cd backend || { echo "Backend directory not found!"; exit 1; }
yarn dev &

# Navigate to the frontend directory and run yarn dev
echo "Starting frontend..."
cd ../frontend || { echo "Frontend directory not found!"; exit 1; }
yarn dev &

# Wait for all background jobs to finish
wait

echo "Scanbotlite are running at http://$CURRENT_IP:3000/"