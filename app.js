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

chat.on('connection', function(client) {
	
	client.on('join', function(nickname) {
		chatlog.forEach(function(message) {
			client.emit('message', message);
		});
		users.push(nickname);
		client.nickname = nickname;
		client.typingTimeout = false;
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

	client.on('start typing', function() {
		if (!client.isTyping) {
			client.isTyping = true;
			client.broadcast.emit('startTyping', client.nickname);
		};
		if (client.typingTimeout != false) clearTimeout(client.typingTimeout);
	    client.typingTimeout = setTimeout(function() {
	    	client.isTyping = false;
			client.typingTimeout = false;
			console.log(client.nickname + ' stop typing');
			client.broadcast.emit('stopTyping', client.nickname);
	    }, 1500);
		console.log(client.nickname + ' start typing');
	});

	client.on('stop typing', function(){
		client.isTyping = false;
		client.typingTimeout = false;
		console.log(client.nickname + ' stop typing');
		client.broadcast.emit('stopTyping', client.nickname);
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});