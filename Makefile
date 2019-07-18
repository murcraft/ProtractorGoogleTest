IMAGE_NAME=e2e-chrome

build:
^Idocker build -t $(IMAGE_NAME) .
tag:
^Idocker tag e2e-chrome $(DOCKER_USERNAME)/$(IMAGE_NAME)
login:
^Iecho "$DOCKER_USERNAME" |docker login -u "$(DOCKER_USERNAME)" -p "$(DOCKER_PASSWORD)"

push:
^Idocker push $(DOCKER_USERNAME)/$(IMAGE_NAME)

.PHONY: build tag login push