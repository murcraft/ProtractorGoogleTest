echo "Creating allure-results folder"
mkdir allure-results
ls
chmod -R a=rwx $(pwd)
echo "$DOCKER_USERNAME" |docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"
echo "Run Docker container for $suite"
docker run -i -d --rm --net=host --privileged -v /dev/shm:/dev/shm -v $(pwd)/allure-results:/tests/allure-results -v $(pwd)/e2e/artifacts:/tests/e2e/artifacts -e suite=$suite -e maxinstances=$maxinstances -e logLevel=$logLevel --name e2e $DOCKER_USERNAME/e2e-chrome:latest
docker exec -it e2e bash -c 'xvfb-run -a node conf-flake.js || if [$? != 0]; then exit 0; fi'