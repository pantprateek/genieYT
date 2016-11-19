##Summary##
This is a  project for voice  based Youtube Player. 
This project uses Youtube player at the client and can playback online youtube video.Video is streamed using nodejs script **httpserver.js** .
You need to say a command for the desired video to watch; say keyword "play" before the content you wish to watch .

##Improvements##
For suggestions or improvements,please do mail me at prateek1510@gmail.com.

##Prerequisites##
(1)A recent version of the **Chrome browser** supporting "webkitSpeechRecognition" .
(2)npm should be installed.

##Installation and Running##
1. Download the contents of this repo.
2. Run **npm install** from source root of **genieYT**
3. Run node httpserver.js

##Usage##
Connect to http://localhost:5000 .You will see the webpage .When you utter a command "play < your request >" ,same video will be played.
Make sure your microphone is connected and is working well.

You can control your video playback by saying appropriate commands in your microphone.Command is displayed at the bottom of the video window.
(1)"zoom" to zoom in and out 
(2)"play <command for video to be played>"
(3)"stop" to pause the playback
(4)"resume" to resume the  video.
(5)"back" to move backwards 
(6)"forward" to move forward



