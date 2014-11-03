var app = require('express')();
var http = require('http').Server(app);
var chat = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname+'/index.html');
});
chat.on('connection', function(client){
	
	console.log('a user connected');
	client.broadcast.emit('chat message', 'a user connected');
	
	client.on('disconnect', function(){
		console.log('a user disconnected');
		client.broadcast.emit('chat message', 'a user disconnected');
	});
	
	client.on('chat messages', function(msg){
		console.log('message: ' + msg);
		chat.emit('chat message', msg);
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

/*
TODO: Homework


Here are some ideas to improve the application:

Broadcast a message to connected users when someone connects or disconnects
Add support for nicknames
Don’t send the same message to the user that sent it himself. Instead, append the message directly as soon as he presses enter.
Add “{user} is typing” functionality
Show who’s online
Add private messaging
Share your improvements!
*/