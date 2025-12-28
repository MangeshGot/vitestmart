# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm install --prefix client
RUN npm install --prefix server

# Copy application files
COPY client ./client
COPY server ./server

# Build the client
RUN npm run build --prefix client

# Move built files to server public folder
RUN mkdir -p server/public && cp -r client/dist/* server/public/

# Expose port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start the server
CMD ["node", "server/server.js"]
