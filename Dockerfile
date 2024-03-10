# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the Docker image
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the image
COPY package*.json ./
COPY . .

# Copy the rest of the application's code into the image
# Install the application's dependencies inside the Docker image

RUN npm install -g npm@latest
RUN npm install
RUN npm install --include=optional sharp
RUN npm install --os=linux --cpu=x64 sharp
RUN npm install slugify
RUN npm install dotenv

# Expose port 3000 for the Express server
EXPOSE 3000

# Start the application
CMD [ "npm", "start:dev" ]