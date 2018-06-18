var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
app.set('port', process.env.PORT || 80);
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = app.get('port');

mongoose.connect('mongodb://localhost/elmikarbordi', function() {
    console.log('!connect to mongodb!');
});


var dashboard = require('./routes/chat');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use('/chat', dashboard);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.send('index');
});

app.use(express.static('public'));

server.listen(port, function() {
    console.log("Server listening on localhost");
});

var usernames = {};
var rooms = [];

io.sockets.on('connection', function(socket) {

    socket.on('adduser', function(data) {
        var username = data.username;
        var room = data.room;

        if (rooms.indexOf(room) != -1) {
            socket.username = username;
            socket.room = room;
            usernames[username] = username;
            socket.join(room);
            socket.emit('updatechat', 'SERVER', 'شما متصل شده اید. گفتگو را شروع کنید');
            socket.broadcast.to(room).emit('updatechat', 'SERVER', socket.username + ' به این چت متصل شد');
        } else {
            socket.emit('updatechat', 'SERVER', 'لطفا آیدی معتبر وارد کنید');
        }
    });

    socket.on('createroom', function(data) {
        var new_room = ("" + Math.random()).substring(2, 12)
        rooms.push(new_room);
        socket.emit('updatechat', 'SERVER', 'چت شما آماده است ، فردی را با استفاده از این آیدی دعوت کنید:' + '  ' + new_room);
        // socket.emit('updatechat', 'SERVER', window.location.href + new_room)
        socket.emit('roomcreated', data);
    });

    socket.on('sendchat', function(data) {
        io.sockets.in(socket.room).emit('updatechat', socket.username, data);
    });

    socket.on('disconnect', function() {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        if (socket.username !== undefined) {
            socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' از این چت رفت ');
            socket.leave(socket.room);
        }
    });
});
