const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    SerialPort = require("serialport"),
    Readline = require('@serialport/parser-readline');

app.use(express.static('../public'));

io.on('connection', (socket) => {
    

    // Listado de puertos
    socket.on('getPortsList', () => {
        var portsList = [];
        SerialPort.list().then(ports => {
            let portsList = [];
            ports.forEach((port) => {
                if (port.manufacturer) {
                    portsList.push(port);
                }
            });

            socket.emit('portsList', portsList);
        });
    });

    // Seleccion de puerto
    socket.on('selectPort', port => {

        // Puerto serial
        app.arduinoSerialPort = new SerialPort(port.path, {  
            bauDrate: 9600
        }).setEncoding('utf8');
           
        // Abir puerto
        app.arduinoSerialPort.on('open', () => {

            // Preguntar por el tipo de teclado
            app.arduinoSerialPort.write("who are you?");
            socket.emit('portConnected', port);
        });

        // Mensaje desde arduino
        app.arduinoSerialPort.on('readable', () => {
            let data = app.arduinoSerialPort.read().split('\n');
            data.forEach(d => socket.emit('fromArduino', d.split(':').map(d => d.trim())));
        });
    });

    socket.on('getKeyCodes', () => {
        // Pedir los codigos de teclas configurados
        app.arduinoSerialPort.write("get");
    });

    socket.on('putKeyCode', (position, keycode) => {
        app.arduinoSerialPort.write("put:"+position+":"+keycode);
    });

    // Cuando desconecta
    socket.on('disconnect', () => {
        if (app.arduinoSerialPort && app.arduinoSerialPort.isOpen) {
            app.arduinoSerialPort.close();
        }
    });
});

server.listen(80, '0.0.0.0', () => {
    console.log('Servidor iniciado', 'http://localhost');
});