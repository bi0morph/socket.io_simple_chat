var app = require('express')();
var http = require('http').Server(app);
var chat = require('socket.io')(http);
var users = [];
var storeMessages = function(message){
	clientRedis.lpush("messages", message, function(err, reply) {
		clientRedis.ltrim("messages", 0, 9);
	});
};
var redis = require('redis');
var clientRedis = redis.createClient();


app.get('/', function(req, res){
	res.sendFile(__dirname+'/index.html');
});

chat.on('connection', function(client){
	
	client.on('join', function(nickname) {
		clientRedis.lrange("messages", 0, -1, function(err, messages) {
			messages = messages.reverse();
			messages.forEach(function(message) {
				client.emit('message', message);
			});
		});
		
		users.push(nickname);
		client.nickname = nickname;
		chat.emit('message', nickname + ' connected');
		storeMessages(nickname + ' connected');
		console.log(nickname + ' connected');
	});
	client.on('disconnect', function() {
		if (client.nickname) {
			console.log(client.nickname + ' disconnected');
			storeMessages(client.nickname + ' disconnected');
			client.broadcast.emit(client.nickname + ' disconnected');
		}else {
			console.log('a user disconnected');
			storeMessages('a user disconnected');
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