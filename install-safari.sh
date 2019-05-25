#!/usr/bin/env bash

SAFARI_NAME="Safari"
SAFARI_SHORT_NAME="Safari"

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
sudo safaridriver --enable --diagnose