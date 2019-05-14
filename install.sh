#!/bin/bash
set -e -u
echo "Install dependencies for $TRAVIS_OS_NAME"

chmod +x ./install-safari.sh
chmod +x ./run_tests.sh
if [ $TRAVIS_OS_NAME == "osx" ]; then
  sudo Xvfb :99 -ac -screen 0 1920x1080x16
  echo "ok"
  bash ./install-safari.sh
fi
if [ $TRAVIS_OS_NAME == "linux" ]; then
  sh -e /etc/init.d/xvfb start
  then sleep 3
fi
if [ $TRAVIS_BUILD_STAGE_NAME == "Chrome" ]; then export browser=chrome; fi
if [ $TRAVIS_BUILD_STAGE_NAME == "Firefox" ]; then export browser=firefox; fi
if [ $TRAVIS_BUILD_STAGE_NAME == "Safari" ]; then export browser=safari; fi
ls ~/Library/Safari