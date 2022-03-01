const ArduinoSerial = require('./js/ArduinoSerial.js');
const Server = require('./js/Server.js');
const isOdd = require("is-odd");
console.clear()

// Requerir child_process
var exec = require('child_process').exec;
const arduino = new ArduinoSerial();
const servidor = new Server();

servidor.start()
servidor.socket(sockets)
servidor.setApi(arduino)

function sockets(socket) {
    socket.on(servidor.sockets.iniciarConexion, data => {
        if (data.connect) {
            const port = data.port;
            arduino.init(port, socket, collectData, servidor);
        } else {
            arduino.disconnect();
            socket.emit(servidor.sockets.estadoArduino, {isConnected: false});
        }
    })
}

function collectData(data, socket) {
    let arrayFinal = [];
    const datosEnteros = data.toString();
    const datosLimpios = datosEnteros.trim();
    const grupoDatos = datosLimpios.split(",");
    grupoDatos.forEach(element => {
        element.split("=").forEach( (dato, index) => {
            if (isOdd(index)) {
                arrayFinal.push(dato.trim());
            }
        } )
    });
    // Enviar datos al servidor por web sockets
    socket.emit(servidor.sockets.intercambiar, arrayFinal)
}
// let datosArduino = collectData(data)

module.exports = arduino