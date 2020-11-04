var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

app.use(express.static('../public'));

server.listen(80, '0.0.0.0', () => {
    console.log('Servidor iniciado');
});