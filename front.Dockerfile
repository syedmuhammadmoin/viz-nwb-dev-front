# Stage 1: Build the Angular app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code and build the app with limited memory usage
COPY . .
RUN node --max_old_space_size=2048 node_modules/@angular/cli/bin/ng build --configuration=production

# Stage 2: Use a lightweight server to serve the app
FROM node:18-alpine

# Install http-server globally
RUN npm install -g http-server

# Copy the built files from the previous stage
COPY --from=build /app/dist/ /app

# Expose port 8080 for http-server
EXPOSE 8080

# Start the server
CMD ["http-server", "/app", "-p", "8080"]

