##################
# Basic commands #
##################

.PHONY: build tag login push

build:
	docker build -t e2e-chrome .
tag:
	docker tag e2e-chrome $(DOCKER_USERNAME)/e2e-chrome
login:
	echo "$DOCKER_USERNAME" |docker login -u "$(DOCKER_USERNAME)" -p "$(DOCKER_PASSWORD)"
push:
	docker push $(DOCKER_USERNAME)/e2e-chrome
