const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('channel', function(msg){
        io.emit('channel', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});