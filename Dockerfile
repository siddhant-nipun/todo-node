# Use the official Node Image
FROM node:alpine3.17

# Create and change to the app directory
WORKDIR /app

# Copy local code to the container image
COPY . .

# Install dependencies
RUN npm install
# Create build
RUN npm run build

# ENV PORT=8080

EXPOSE 5000

# Run the app
CMD [ "npm","start" ]
