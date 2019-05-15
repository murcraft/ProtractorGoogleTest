#!/usr/bin/env bash
set -x
set -e

if [ $BROWSER == "safari" ] && [ $BVER == "unstable" ]; then
  # This is quite dangerous, it is scraping the safari download website for the URL. If the format
  # of the website changes then it won't work anymore. We should add safari to
  # browsers.contralis.info instead
  TARGET_URL=`curl https://developer.apple.com/safari/download/ | sed -nE 's/.*href="(.*\.dmg)">.*macOS 10.12.*/\1/p'`
  #TARGET_URL=`curl https://secure-appldnld.apple.com/STP/041-58764-20190501-d28417f0-1e4c-4abb-9cdf-b469cf8c1b48/SafariTechnologyPreview.dmg`
  TARGET_VERSION=`curl https://developer.apple.com/safari/download/ | sed -nE 's/.*>([0-9]+)<\/p>.*$/\1/p'`
else
  TARGET_BROWSER=`curl -H 'Accept: text/csv' https://browser-version-api.herokuapp.com/$PLATFORM/$BROWSER/$BVER`
  TARGET_URL=`echo $TARGET_BROWSER | cut -d',' -f7`
  TARGET_VERSION=`echo $TARGET_BROWSER | cut -d',' -f5`
fi

# Install Safari or Safari Technology Preview
# Arguments: $1=target URL

# Download and install Safari Tech Preview
if [ $BVER == "unstable" ] && [ ! -f "/Applications/Safari Technology Preview.app/Contents/MacOS/Safari Technology Preview" ]; then
  curl -L $1 > SDP.dmg
  hdiutil attach SDP.dmg
  sudo installer -pkg /Volumes/Safari\ Technology\ Preview/Safari\ Technology\ Preview.pkg -target /
fi
# Safari stable is already installed, no need to do anything

# If we're running on Travis
if [ ! -z $TRAVIS ]; then
  # Download and install Soundflower to get audio output devices otherwise we get crashes
  # https://bugs.webkit.org/show_bug.cgi?id=172794
  curl -L https://github.com/mattingalls/Soundflower/releases/download/2.0b2/Soundflower-2.0b2.dmg > Soundflower.dmg
  hdiutil attach Soundflower.dmg
  sudo installer -pkg /Volumes/Soundflower-2.0b2/Soundflower.pkg -target /
fi

if [ $BVER == "unstable" ]; then
  SAFARI_NAME="Safari Technology Preview"
  SAFARI_SHORT_NAME="SafariTechnologyPreview"
else
  SAFARI_NAME="Safari"
  SAFARI_SHORT_NAME="Safari"
fi

# Launch and kill Safari so that we can start to override the settings
open -a "$SAFARI_NAME"
sleep 2
killall "$SAFARI_NAME"

# Tell Safari not to restore the browser windows when it is relaunched
defaults write com.apple.$SAFARI_SHORT_NAME ApplePersistenceIgnoreState YES

# Turn on fake devices
defaults write com.apple.$SAFARI_SHORT_NAME WebKitMockCaptureDevicesEnabled 1
defaults write com.apple.$SAFARI_SHORT_NAME com.apple.Safari.ContentPageGroupIdentifier.WebKit2MockCaptureDevicesEnabled 1

# Allow insecure domains
defaults write com.apple.$SAFARI_SHORT_NAME WebKitMediaCaptureRequiresSecureConnection 0
defaults write com.apple.$SAFARI_SHORT_NAME com.apple.Safari.ContentPageGroupIdentifier.WebKit2MediaCaptureRequiresSecureConnection 0

# Turn off popup blocking
defaults write com.apple.$SAFARI_SHORT_NAME WebKitJavaScriptCanOpenWindowsAutomatically -bool true
defaults write com.apple.$SAFARI_SHORT_NAME com.apple.Safari.ContentPageGroupIdentifier.WebKit2JavaScriptCanOpenWindowsAutomatically -bool true

# Turn on Allow Remote Automation. This only works in Mac OS 10.12.6+
sudo safaridriver --enable

# determine the script path
# ref: http://stackoverflow.com/questions/4774054/reliable-way-for-a-bash-script-to-get-the-full-path-to-itself
pushd `dirname $0` > /dev/null
SCRIPTPATH=`pwd -P`
popd > /dev/null

# Allow device access
# This UserMediaPermissions.plist file allows 127.0.0.1 and localhost. To add other domains
# you need to run Safari Technology Preview on your system, visit the domain you want to allow
# and call navigator.mediaDevices.getUserMedia. When prompted allow access to devices allow access
# then click on the red camera in the URL bar and choose "Always Allow".
# Finally copy the `~/Library/SafariTechnologyPreview/UserMediaPermissions.plist` file into the
# same directory on Travis.
cp $SCRIPTPATH/UserMediaPermissions.plist ~/Library/$SAFARI_SHORT_NAME/