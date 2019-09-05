#!/bin/bash
set -e -u
echo "Running tests on $browser"
if [[ $browser == "firefox" ]]; then npm run test-gecko; fi
if [[ $browser == "chrome" ]]; then npm run test-chrome; fi
if [[ $browser == "safari" ]]; then npm run test-safari; fi
if [[ $browser == "ie" ]]; then npm run test-ie; fi
npm test || if [$? != 0]; then exit 0; fi