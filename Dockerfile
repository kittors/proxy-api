# Dockerfile

# Use an official Node.js runtime as a parent image
# Using Alpine Linux variant for smaller image size
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Install pnpm globally (needed if not included in the base image)
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install app dependencies using pnpm --frozen-lockfile is recommended for CI/CD and Docker builds
# It ensures that the exact versions from the lock file are installed.
RUN pnpm install --frozen-lockfile

# Bundle app source inside Docker image
COPY . .

# The application listens on the port defined by APP_PORT environment variable.
# EXPOSE just documents this, the actual mapping happens in docker-compose.yml
# We expose the default port here for documentation purposes.
EXPOSE 3000

# Define the command to run your app using pnpm
CMD [ "pnpm", "start" ]