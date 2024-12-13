# Start from an official Node.js image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create uploads directory (needed for storing uploaded files)
RUN mkdir -p uploads

# Expose the port your app runs on
EXPOSE 3030

# Start the application
CMD ["node", "server.js"]
