# Use Node LTS
FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend source code
COPY . .

# Build frontend
RUN npm run build

# Install serve to serve static files
RUN npm install -g serve

# Expose frontend port
EXPOSE 5173

# Start frontend
CMD ["serve", "-s", "dist", "-l", "5173"]
