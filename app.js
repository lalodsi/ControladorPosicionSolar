const ArduinoSerial = require('./js/ArduinoSerial.js');
const Server = require('./js/Server.js')
console.clear()

// Requerir child_process
var exec = require('child_process').exec;
const arduino = new ArduinoSerial();
const Servidor = new Server();

Servidor.start()
Servidor.socket(sockets)
Servidor.setApi(arduino)

function sockets(socket) {
    socket.on('connect-to-arduino', data => {
        if (data.connect) {
            const port = data.port
            arduino.init(port, socket, collectData)
        } else {
            arduino.disconnect()
            socket.emit('arduinoConnectionState', {isConnected: false})
        }
    })
}

function collectData(data) {
    console.log('Recibiendo datos: '+ data.toString());
}

module.exports = arduino