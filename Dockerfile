# Use official Node.js LTS image
FROM node:18-alpine
LABEL authors="oskarwong"

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy rest of the application code
COPY . .

# Set production env
ENV NODE_ENV=production

# Expose the port your app runs on
EXPOSE 3080

# Start the application
CMD ["npm", "start"]
