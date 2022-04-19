const ArduinoSerial = require('./js/ArduinoSerial.js');
const Server = require('./js/Server.js');
console.clear()

// Requerir child_process
var exec = require('child_process').exec;
const arduino = new ArduinoSerial();
const servidor = new Server();

servidor.start()
servidor.socket(sockets)

function sockets(socket) {
    socket.on(servidor.sockets.iniciarConexion, data => {
        if (data.connect) {
            const port = data.port;
            arduino.init(port, socket, servidor);
        } else {
            arduino.disconnect();
            socket.emit(servidor.sockets.estadoArduino, {isConnected: false});
        }
    })
    socket.on(servidor.sockets.comenzarRecepcionDeDatos, data => {
        arduino.receiveData(socket, data.comenzar);
        if (data.comenzar) {
            console.log("Solicitaste el intercambio de información");
        } else {
            console.log("Haz cancelado el intercambio de información");
        }
    } )
}

module.exports = arduino