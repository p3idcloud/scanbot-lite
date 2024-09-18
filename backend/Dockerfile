# Backend Dockerfile (backend/Dockerfile)
# Step 1: Use an official Node.js image as the base image
FROM node:18-alpine

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Step 4: Install dependencies using yarn
RUN yarn install --frozen-lockfile

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Expose the port the app runs on (adjust if using a different port)
EXPOSE 8000

# Step 7: Run the Express.js app
CMD ["yarn", "start"]