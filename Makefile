IMAGE_NAME=e2e-chrome

build:
\tdocker build -t $(IMAGE_NAME) .
tag:
\tdocker tag e2e-chrome $(DOCKER_USERNAME)/$(IMAGE_NAME)
login:
\techo "$DOCKER_USERNAME" |docker login -u "$(DOCKER_USERNAME)" -p "$(DOCKER_PASSWORD)"

push:
\tdocker push $(DOCKER_USERNAME)/$(IMAGE_NAME)

.PHONY: build tag login push