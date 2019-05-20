#!/usr/bin/env bash
set -e -u
echo "Preinstall packages"

if [ $TRAVIS_OS_NAME == "osx" ]; then
  brew update
  brew cask reinstall xquartz
  brew install tcl-tk
  brew link --overwrite --force tcl-tk
  brew unlink tcl-tk
fi

if [ $TRAVIS_OS_NAME == "linux" ]; then
  /sbin/start-stop-daemon --start --quiet --pidfile /tmp/custom_xvfb_99.pid --make-pidfile --background --exec /usr/bin/Xvfb -- :99 -screen 0 1920x1080x16
fi