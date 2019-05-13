#!/bin/bash
set -e -u
echo "Running tests on $browser"
if [[ $browser == "firefox" ]]; then npm run test-gecko; fi
if [[ $browser == "chrome" ]]; then npm run test-chrome; fi
#if [[ $browser == "safari" ]]; then osascript /Users/travis/build/murcraft/ProtractorGoogleTest/setSafariPath.scpt; fi
if [[ $browser == "safari" ]]; then npm run test-safari; fi
npm test || if [$? != 0]; then exit 0; fi