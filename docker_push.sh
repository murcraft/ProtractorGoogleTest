#!/bin/bash
echo "$DOCKER_USERNAME" |docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"
docker build -t e2e-chrome .
docker images
docker tag e2e-chrome $DOCKER_USERNAME/e2e-chrome
docker push $DOCKER_USERNAME/e2e-chrome