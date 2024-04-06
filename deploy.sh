#!/bin/bash

# set -x  # Enable printing of commands


# rm old repo
cd ~/app
rm -rf bookipedia

# Clone the new repository
git clone https://github.com/mhmadalaa/bookipedia

# copy .env file
cp .env bookipedia/

# Get a list of all Docker containers
containers=$(docker ps -a -q)

# If the list is not empty, stop all containers
if [ -n "$containers" ]; then
    docker stop $containers
fi

# Remove all containers
docker rm $(docker ps -a -q)

# Remove all images
docker rmi $(docker images -q)

# Get a list of all Docker containers
containers=$(docker ps -a -q)

# If the list is not empty, stop and remove all containers
if [ -n "$containers" ]; then
    docker stop $containers
    docker rm $containers
fi

# Get a list of all Docker images
images=$(docker images -q)

# If the list is not empty, remove all images
if [ -n "$images" ]; then
    docker rmi $images
fi

#  build new container 
cd bookipedia
docker-compose build && docker-compose up -d
# successfull message
echo "deployed"

# chmod +x deploy.sh
# ./deploy.sh
