const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    SerialPort = require("serialport");

app.use(express.static('../public'));

app.closePort = () => {
    if (app.arduinoSerialPort && app.arduinoSerialPort.isOpen) {
        app.arduinoSerialPort.close();
    }
}

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
        app.closePort();
        app.arduinoSerialPort = new SerialPort(port.path, {  
            bauDrate: 9600
        }).setEncoding('utf8');
           
        // Abir puerto
        app.arduinoSerialPort.on('open', () => {
            socket.emit('portConnected', port);

            // Preguntar por el tipo de teclado
            app.arduinoSerialPort.write("who are you?");
        });

        // Mensaje desde arduino
        app.arduinoSerialPort.on('readable', () => {
            let data = app.arduinoSerialPort.read().split('\n');
            data.forEach(d => socket.emit('fromArduino', d.split(':').map(d => d.trim())));
        });

        // Al desconectar el puerto
        app.arduinoSerialPort.on('close', () => {
            socket.emit('disconnect');
        });

        // Al producir un error
        app.arduinoSerialPort.on('error', () => {
            socket.emit('error');
        });
    });

    socket.on('getKeyCodes', () => {
        // Pedir los codigos de teclas configurados
        app.arduinoSerialPort.write("get");
    });

    socket.on('enableTestMode', () => {
        // Activar el modo de pruebas para probar los interruptores
        app.arduinoSerialPort.write("modoTest:true");
    });

    socket.on('disableTestMode', () => {
        // Desactivar el modo de pruebas para probar los interruptores
        app.arduinoSerialPort.write("modoTest:false");
    });

    socket.on('putKeyCode', (position, keycode) => {
        app.arduinoSerialPort.write("put:"+position+":"+keycode);
    });

    // Cuando desconecta
    socket.on('disconnect', () => {
        app.closePort();
    });
});

server.listen(80, '0.0.0.0', () => {
    console.log('Servidor iniciado', 'http://localhost');
});