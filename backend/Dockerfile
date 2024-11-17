# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Expose the port your backend runs on (e.g., 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]

