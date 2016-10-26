var express = require('express');

var app = express();
var server = app.listen(8081,'0.0.0.0')
var io = require('socket.io').listen(server);

io.sockets.on('connection',function (socket) {

    socket.on('gonder',function (data) {
        io.emit('alici', data);
    })

});