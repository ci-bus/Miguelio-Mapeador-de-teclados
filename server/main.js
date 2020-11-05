var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    SerialPort = require("serialport");

app.use(express.static('../public'));

io.on('connection', (socket) => {
    

    // Listado de puertos
    socket.on('getPortsList', () => {
        var portsList = [];
        SerialPort.list().then(ports => {
            let portsList = [];
            ports.forEach((port) => {
                if (port.manufacturer) {
                    portsList.push({
                        name: port.manufacturer,
                        port: port.path
                    });
                }
            });

            socket.emit('portsList', portsList);
        });
    });


    // Cuando desconecta
    socket.on('disconnect', () => {
        /*
        // Emite el cliente para ser eliminado en el front
        socket.broadcast.emit('del-client', socket.id);
        // Elimina al cliente
        clients.deleteClient(socket.id);
        console.log(`Conectados ${Object.entries(clients.getClients()).length} clientes`);
        */
    });
});

server.listen(80, '0.0.0.0', () => {
    console.log('Servidor iniciado', 'http://localhost');
});