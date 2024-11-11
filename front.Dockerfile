# Stage 1: Build the Angular app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Install dependencies and build the Angular app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Use a lightweight Node.js server to serve the app
FROM node:18-alpine

# Install http-server globally
RUN npm install -g http-server

# Copy built files from the previous stage
COPY --from=build /app/dist/viz-dev-front /app

# Expose port 8080 for http-server
EXPOSE 8080

# Start the server
CMD ["http-server", "/app", "-p", "8080"]

