# ----------------------------
# Stage 1: Build Stage
# ----------------------------
# Use a standard Node image to install dependencies
FROM node:20 AS build-env

# Set the working directory
WORKDIR /app

# Copy package files first to leverage caching
COPY package*.json ./

# Install dependencies (npm ci is faster and cleaner for builds)
# Note: Since nodemon is in your 'dependencies', it will be installed. 
# Ideally, move dev tools to 'devDependencies' in package.json to save space.
RUN npm ci

# Copy the rest of the application source code
COPY . .

# ----------------------------
# Stage 2: Distroless Runtime Stage
# ----------------------------
# Use the Google distroless image for Node 20
FROM gcr.io/distroless/nodejs20-debian12

# Set the working directory
WORKDIR /app

# Copy the built application and node_modules from the build-env stage
COPY --from=build-env /app /app

# Expose the port your app runs on
EXPOSE 5000

# Start the application
# Note: Distroless sets the entrypoint to 'node' automatically,
# so you only need to provide the file path in CMD.
CMD ["app.js"]