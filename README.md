# Project Setup and Deployment Guide

# This guide provides step-by-step instructions for setting up and deploying the project using Docker.

# Prerequisites

# Before you begin, ensure you have the following installed on your machine:
# - Docker: https://docs.docker.com/get-docker/
# - Git: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

# Cloning the Repository

# 1. Open your terminal.
# 2. Clone the repository by running the following command:
# git clone <repository-url>
# cd <repository-name>

# Project Configuration

# 1. Create a .env file in the root directory of the project with the following content:
# PORT=3000
# TELEGRAM_BOT_TOKEN=6772463405:AAGlbQ8ioOXC70kmg8JaVgbkDBnKVzroIr0
# ELEVENLABS_API_KEY=sk_3736e15242349f48799a2a9a8d10346e0cfaa6d9bdb09191
# CLOUDINARY_API_NAME=dn7gjjo2z
# CLOUDINARY_API_KEY=673516527583583
# CLOUDINARY_API_SECRET=2Jw7QQNWBfmoMA-Gm20qo30mLsI
# NODE_ENV=production

# Docker Setup and Deployment

# Build the Docker image by running the following command in the terminal:
# docker build -t my-node-app .

# Run the Docker container with the following command:
# docker run -d -p 3000:3000 --env-file .env my-node-app

# This will start the application in a Docker container and expose it on port 3000.