# Project Setup and Deployment Guide

This guide provides step-by-step instructions for setting up and deploying the project using Docker.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Docker](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Cloning the Repository

1. Open your terminal.
2. Clone the repository by running the following command:

    ```bash
    git clone <repository-url>
    ```

3. Navigate to the project directory:

    ```bash
    cd <repository-name>
    ```

## Project Configuration

1. Create a `.env` file in the root directory of the project with the following content:

    ```env
    PORT=3000
    TELEGRAM_BOT_TOKEN=<token>
    ELEVENLABS_API_KEY=<api_key>
    CLOUDINARY_API_NAME=<key>
    CLOUDINARY_API_KEY=<key>
    CLOUDINARY_API_SECRET=<key>
    NODE_ENV=production
    ```

Replace `<repository-url>` and `<repository-name>` with the appropriate values for your repository.

## Docker Setup and Deployment

1. Build the Docker image by running the following command in the terminal:

    ```bash
    docker build -t my-node-app .
    ```

2. Run the Docker container with the following command:

    ```bash
    docker run -d -p 3000:3000 --env-file .env my-node-app
    ```

This will start the application in a Docker container and expose it on port 3000.

## Dockerfile

The `Dockerfile` used for building the image is as follows:

    ```Dockerfile
    # Use the official Node.js 18 image as the base image
    FROM node:18

    # Set the working directory inside the container
    WORKDIR /usr/src/app

    # Copy package.json and package-lock.json to the container
    COPY package*.json ./

    # Install project dependencies
    RUN npm install

    # Copy the rest of the application code to the container
    COPY . .

    # Copy the .env file to the container
    COPY .env ./

    # Build the application
    RUN npm run build

    # Expose port 3000 to the host
    EXPOSE 3000

    # Command to run the application
    CMD [ "npm", "run", "start:prod" ]
    ```

## Accessing the Application

Once the Docker container is running, you can access the application in your web browser at `http://localhost:3000`.

## Troubleshooting

If you encounter any issues, check the container logs with the following command:

```bash
docker logs <container-id>
