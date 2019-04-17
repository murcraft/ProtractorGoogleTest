-- Set alternative drive name to use as downloads folder here
set dlFolder to convertHome("/artifacts/temporary")

tell application "Finder"
     if exists [POSIX file dlFolder] then
          -- Do Nothing and use the folder
     else
          -- set dlFolder to default home directory
          set dlFolder to (POSIX path of (path to home folder as text)) & "Downloads"
     end if
end tell

-- get current path from safari plist
set currentpath to convertHome(do shell script "defaults read com.apple.Safari DownloadsPath")

-- change path only if the current setting does not match the input path (there is something to change)
if (currentpath as text) is not equal to (dlFolder as text) then
     -- if Safari is running, change settings through Safari's preferences
     if appIsRunning("Safari") then
          -- determine the frontmost application to restore when script is done
          set frontApp to path to frontmost application as text
          -- copy the download folder path to the clipboard
          set the clipboard to dlFolder as text
          activate application "Safari"
          tell application "System Events" to tell application process "Safari"

               -- open the preferences or bring to front (window 1)
               keystroke "," using {command down}
               delay 1 -- pauses in window display may result in an error, so we wait a second

               -- Change to the General tab
               click button "General" of tool bar 1 of window 1

               -- Change download location to Other
               tell pop up button "Save downloaded files to:" of group 1 of group 1 of window "General"
                    click
                    click menu item "Other..." of menu 1 -- three dots is an ellipsis, not three periods
               end tell

               -- Open the "go to folder" dialogue box
               keystroke "g" using {shift down, command down}

               -- Paste the folder path into the location field
               tell window "Go To Folder"
                    keystroke "v" using {command down}
                    keystroke return
               end tell
               click button "Select" of sheet 1 of window "General"

               -- close the preferences
               keystroke "w" using {command down}
          end tell
          -- restore frontmost application after job is complete
          tell application frontApp to activate
     else
          -- if Safari is NOT running, then use the defaults command to change the preferences
          do shell script ("defaults write com.apple.Safari DownloadsPath " & dlFolder)
     end if
end if

-- Function to convert home path references to full paths
on convertHome(currentpath)
     if currentpath contains "~/" then
          set oldDelimiter to AppleScript's text item delimiters
          set AppleScript's text item delimiters to {"~/"}
          set textPath to every text item of currentpath
          set AppleScript's text item delimiters to oldDelimiter
          set currentpath to POSIX path of (path to home folder as text) & item 2 in textPath
     end if
     return currentpath
end convertHome

-- Function to check if application "appName" is running (in this case, used for Safari)
on appIsRunning(appName)
     tell application "System Events" to (name of processes) contains appName
end appIsRunning