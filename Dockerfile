# Stage 1: Build stage
FROM node:20 AS build

RUN apt-get update

# Set the working directory
WORKDIR /app

ARG DATABASE_URL

ENV DATABASE_URL=${DATABASE_URL}

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Copy the Prisma schema file to the production stage
COPY prisma ./prisma/

# Install Prisma globally (if needed)
RUN npm install -g prisma

# Install dependencies
RUN npm install

# uninstall the current bcrypt modules
RUN npm uninstall bcrypt

# install the bcrypt modules for the machine
RUN npm install bcrypt

# Copy the entire application
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:20 AS production

# Set the working directory
WORKDIR /app

# Copy the built artifacts from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

RUN apt-get update

# uninstall the current bcrypt modules
RUN npm uninstall bcrypt

# install the bcrypt modules for the machine
RUN npm install bcrypt

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD ["npm", "run", "start:prod"]