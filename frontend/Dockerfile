# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Expose the port your frontend runs on (e.g., 4200)
EXPOSE 4200

# Start the application
CMD ["npm", "run", "start", "--", "--host=0.0.0.0", "--disable-host-check"]
