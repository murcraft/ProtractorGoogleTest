#!/bin/bash
set -e -u

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then

    # Install some custom requirements on macOS
     echo "Install MAC OS display values"
     brew /sbin/start-stop-daemon --start --quiet --pidfile /tmp/custom_xvfb_99.pid --make-pidfile --background --exec /usr/bin/Xvfb -- :99 -ac -screen 0 1920x1080x16
else
     echo "Install Linux display values"
    /sbin/start-stop-daemon --start --quiet --pidfile /tmp/custom_xvfb_99.pid --make-pidfile --background --exec /usr/bin/Xvfb -- :99 -ac -screen 0 1920x1080x16
fi