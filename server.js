var app = require('express').createServer();
app.listen(4000);

var webRTC = require('webrtc.io').listen(app);

app.get('/examples/index-chat.html', function(req, res) {
	res.sendfile(__dirname + '/examples/index-chat.html');
});
app.get('/examples/index-test.html', function(req, res) {
	res.sendfile(__dirname + '/examples/index-test.html');
});
app.get('/examples/style.css', function(req, res) {
	res.sendfile(__dirname + '/examples/style.css');
});
app.get('/examples/webrtc.io.js', function(req, res) {
	res.sendfile(__dirname + '/node_modules/webrtc.io/node_modules/webrtc.io-client/lib/webrtc.io.js');
});


webRTC.rtc.on('connect', function(rtc) {
	//Client connected
	console.log('client connected')
});

webRTC.rtc.on('send answer', function(rtc) {
 	//answer sent
});

webRTC.rtc.on('disconnect', function(rtc) {
	console.log('client disconnected')
	//Client disconnect 
});

webRTC.rtc.on('chat_msg', function(data, socket){
  var roomList = webRTC.rtc.rooms[data.room] || [];

  for (var i = 0; i < roomList.length; i++) {
    var socketId = roomList[i];

    if (socketId !== socket.id) {
      var soc = webRTC.rtc.getSocket(socketId);

      if (soc) {
        soc.send(JSON.stringify({
          "eventName": "receive_chat_msg",
          "data": {
            "messages": data.messages,
            "color": data.color
          }
        }), function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  }
});
