# Frontend Dockerfile (frontend/Dockerfile)
FROM node:18-alpine

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and yarn.lock to the working directory
# COPY package.json yarn.lock ./
COPY package.json ./

# Step 4: Install dependencies using yarn
# RUN yarn install --frozen-lockfile
RUN yarn install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the Next.js app for production
RUN yarn build

# Step 7: Expose the port the app runs on
EXPOSE 3000

# Step 8: Run the Next.js application in production mode
CMD ["yarn", "start"]