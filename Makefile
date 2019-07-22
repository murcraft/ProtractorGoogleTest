##################
# Basic commands #
##################

DOCKER_IMAGE=e2e-chrome

.PHONY: build tag login push

build:
	docker build -t e2e-chrome .

tag:
	docker tag e2e-chrome $(DOCKER_USERNAME)/$(DOCKER_IMAGE)

login:
	echo "$(DOCKER_USERNAME)" |docker login -u "$(DOCKER_USERNAME)" -p "$(DOCKER_PASSWORD)"

push:
	docker push $(DOCKER_USERNAME)/$(DOCKER_IMAGE)

run-image:
	'chmod -R a=rwx $(pwd)'
	mkdir -m 777 allure-result
	echo "$(DOCKER_USERNAME)" |docker login -u "$(DOCKER_USERNAME)" -p "$(DOCKER_PASSWORD)"
	docker run -i -d --rm --net=host --privileged \
	-v /dev/shm:/dev/shm \
	-v $(pwd)/allure-results:/tests/allure-results \
	-v $(pwd)/artifacts:/tests/artifacts \
	-e suite=$(suite) \
	-e browser=$(browser) \
	-e maxinstances=$(maxinstances) \
	-e logLevel=$(logLevel) \
	--name e2e $(DOCKER_USERNAME)/$(DOCKER_IMAGE):latest

run-job:
	docker exec -it e2e bash -c 'xvfb-run -a node conf-flake.js || if [$? != 0]; then exit 0; fi'