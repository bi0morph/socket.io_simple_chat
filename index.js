var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname+'/index.html');
});
io.on('connection', function(socket){
	console.log('a user connected');
	socket.broadcast.emit('hi');
	socket.on('disconect', function(){
		console.log('user disconected');
	});
	socket.on('chat messages', function(msg){
		console.log('message: ' + msg);
		io.emit('chat message', msg);
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