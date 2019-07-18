IMAGE_NAME=e2e-chrome

build:
    docker build -t $(IMAGE_NAME) .

tag:
    docker tag e2e-chrome $(DOCKER_USERNAME)/$(IMAGE_NAME)

login:
    echo "$DOCKER_USERNAME" |docker login -u "$(DOCKER_USERNAME)" -p "$(DOCKER_PASSWORD)"

push:
    docker push $(DOCKER_USERNAME)/$(IMAGE_NAME)