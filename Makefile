.PHONY: build run-chrome

build:
  docker build -t e2e-chrome .

tag:
  docker tag e2e-chrome perch1234/e2e-chrome

login:
  echo "$DOCKER_USERNAME" |docker login -u "$(DOCKER_USERNAME)" -p "$(DOCKER_PASSWORD)"

push:
  docker push $(DOCKER_USERNAME)/e2e-chrome

run-chrome: mkdir allure-results
    ls
    chmod -R a=rwx $(pwd)
    echo "$DOCKER_USERNAME" |docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"
    echo "Build docker container"
	docker run -i -d \
	--rm \
	--net=host \
	--privileged \
	-v /dev/shm:/dev/shm \
	-v $(pwd)/allure-results:/tests/allure-results \
	-v $(pwd)/artifacts:/tests/artifacts \
	-e suite=suite1 -e maxinstances=$maxinstances \
	-e logLevel=$logLevel \
	--name e2e $DOCKER_USERNAME/e2e-chrome:latest \
    docker exec -it e2e bash -c 'xvfb-run -a node conf-flake.js || if [$? != 0]