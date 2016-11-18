/*
  Web Server (HTTP) for voice based youtube player 
  -----------------------------------------------------------------------

  This file instansiates a Web Server that serves up the player.html page performing
  speech to text conversion.The results are then returned to this server via  a websocket connection (socket.io).
  This file searches the youtube video based on the speech and returns the videoid to the client and client does the playback.
  Fill in cmdstr for the actions you want to support for the player.e.g some actions like 
  "room" is also added for "zoom" as speech recoginition logic may detect it this way.
  Run this Webserver with the command "node httpserver.js".To play anything from internet user have to say "play <whatever****>".
*/

// Dependancies and declarations
var express = require('express');
var app = express();
var fs = require('fs');

var server = require('http').createServer( handler);
var io = require('socket.io').listen(server);
var path = require('path');
var log = true;

var fs = require('fs'),
    url = require('url'),
    path = require('path');


var cmdstr = "back play stop top bak zoom room forward mute unmute resume";
var arrayString= cmdstr.split(" ");
var updatelist;
// Handles socket.io communication
io.on('connection', function(socket){

  // Commands received from HTML page
  socket.on('command', function(msg){
  updatelist=false; 
    // Log command if desired
    if (Boolean(log)){
      console.log('Received Command from HTML page .',msg);
    }
  if(msg!=null || msg!='')
  {  
     for(var i=0;i<=arrayString.length -1;i++)
     {
        var tomatch = arrayString[i];
        var result=msg.toLowerCase().indexOf(tomatch);
       if(result >= 0)
       {  
         if(tomatch=="play"){ 
            var playstring = null;
            playstring=msg.replace('play',''); 
            playlist(playstring);
           }
           else
            io.sockets.emit('new-message', tomatch);
           break;
       } 
     }
          msg=null;
  }
      
  });
});


var indexPage;
fs.readFile(path.resolve(__dirname,"player.html"), function (err, data) {
    if (err) {
        throw err;
    }
    indexPage = data;    
});

function startsWith(str, prefix) {
    return str.lastIndexOf(prefix, 0) === 0;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

var vidlist=[];
function playlist(playstring) {

    var google = require('googleapis'),
    youtubeV3 = google.youtube( { version: 'v3', auth: 'AIzaSyDP_E9nceLg-D_CpvTLadfWsc3DWVxiLq0' } );

   var request =  youtubeV3.search.list({
    part: 'snippet',
    type: 'video',
    orderby: 'published',
    q: playstring,
    maxResults: 1,
    order: 'date',
    safeSearch: 'moderate',
    videoEmbeddable: true
   }, (err,response) => {
    console.log(err); 
    for (var i=0; i<response.items.length;i++)
    {
      //store each JSON value in a variable
      var publishedAt=response.items[i].snippet.publishedAt;
      var channelId=response.items[i].snippet.channelId;
      var title=response.items[i].snippet.title;
      var description=response.items[i].snippet.description;
      var videoID=response.items[i].id.videoId;
      vidlist[i]=videoID;
    }
        if(err==null)
           io.sockets.emit('new-message', "play");  
  }); 
            
        
}
 
// create http server
function handler(req, res) {
    
    var reqResource = url.parse(req.url).pathname;
    console.log("Resource: " + reqResource);

    if(reqResource == "/"){
    
        console.log(req.headers)
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(indexPage);
        res.end();

    }
   else if(reqResource == "/list")
   {
        
        var jbuff=[]; 
    	res.writeHead(200, {'Content-Type': 'application/json'}); 
        jbuff=JSON.stringify(vidlist);
        console.log("video id is ",jbuff); 
        res.write(jbuff);
        res.end();
      
   }
  else if(reqResource == "/genie.png")
  {
       console.log(req.headers)
       var img = fs.readFileSync('./images/genie.png');
       res.writeHead(200, {'Content-Type': 'image/png' });
       res.end(img, 'binary');
  }
  else  if(reqResource == "/favicon.ico")
  {
    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end();

  }

};

server.listen(5000,function(){
       console.log('HTTP listening on *:5000');
});




