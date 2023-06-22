const ArduinoSerial = require('./js/ArduinoSerial.js');
const {Server, startWindow} = require('./js/Server.js');
const electron = require('electron');
const { utils, writeFile, readFile, read} = require('xlsx');

console.clear();

// Requerir child_process
var exec = require('child_process').exec;
const arduino = new ArduinoSerial();
const servidor = new Server();

servidor.start()
servidor.socket(sockets)
startWindow();

function sockets(socket) {
    /**
     * Socket para comenzar la conexión
     */
    socket.on(servidor.sockets.iniciarConexion, data => {
        if (data.connect) {
            const port = data.port;
            arduino.init(port, socket, servidor);
        } else {
            arduino.disconnect(socket, servidor);
        }
    })
    socket.on(servidor.sockets.versionSoftwareArduino, data => {
        console.log("Comprobando el software cargado en el arduino");
        console.log(data.testing);
        if (data.testing) {
            setTimeout(()=> arduino.sendData("probar"), 1000 );
        }
    })
    // Socket para envío de palabras al arduino
    socket.on( servidor.sockets.enviarPalabra, data => {
        console.log(data.message);
        arduino.sendData(data.word);
    })
    /**
     * Sockets para actualización de datos
     */
    socket.on( servidor.sockets.cambiarOrientacion, data =>{
        console.log(`Se cambiará la orientación a ${data.orientacion} grados`);
        arduino.sendData("orientation");
        setTimeout(() => arduino.sendData(`${data.orientacion}\n`), 1000);
    } );
    socket.on( servidor.sockets.cambiarFechaYHora, data =>{
        console.log(`Se cambiará la fecha y hora a ${data.fecha}, ${data.hora}`);
        arduino.sendData("date");
        setTimeout(() => arduino.sendData(`${data.fecha},${data.hora}`), 1000);
    } );
    socket.on( servidor.sockets.cambiarPosicion, data =>{
        console.log(`Se cambiará la posición a ${data.latitud}, ${data.longitud}`);
        arduino.sendData("position");
        // arduino.sendData(`${data.latitud},${data.longitud}`);
        setTimeout(() => arduino.sendData(`${data.latitud},${data.longitud}`), 1000);
    } );
    socket.on(
        "monitorSerial",
        data => arduino.monitorSerialConnected = data.connected
        );

}

module.exports = arduino