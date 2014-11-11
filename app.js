var app = require('express')();
var http = require('http').Server(app);
var chat = require('socket.io')(http);
var users = [], chatlog = [];
var storeMessages = function(message){
	chatlog.push(message);
	if (chatlog.length > 10) {
		messages.shift();
	}
};

app.get('/', function(req, res){
	res.sendFile(__dirname+'/index.html');
});

chat.on('connection', function(client){
	
	
	
	client.on('join', function(nickname) {
		chatlog.forEach(function(message) {
			client.emit('message', message);
		});
		users.push(nickname);
		client.nickname = nickname;
		//client.broadcast.emit('message', nickname + ' connected');
		chat.emit('message', nickname + ' connected');
		storeMessages(nickname + ' connected');
		console.log(nickname + ' connected');
	});
	client.on('disconnect', function() {
		if (client.nickname) {
			console.log(client.nickname + ' disconnected');
			client.broadcast.emit(client.nickname + ' disconnected');
		}else {
			console.log('a user disconnected');
			client.broadcast.emit('message', 'a user disconnected');
		}
	});
	
	client.on('new message', function(message) {
		var fullMessage = client.nickname + ' sayed: ' + message;
		console.log(fullMessage);
		chat.emit('message', fullMessage);
		storeMessages(fullMessage);
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