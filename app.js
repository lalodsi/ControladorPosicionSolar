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
        if (data.testing) {
            arduino.sendData("probar");
        }
    })
    socket.on(servidor.sockets.monitorear, data => {
        if (data.comenzar) {
            // arduino.receiveData(socket, data.comenzar);
            console.log("Solicitaste el intercambio de información");
            arduino.sendData("monitorear");
        } else {
            console.log("Haz cancelado el intercambio de información");
            arduino.sendData("salir");
        }
    } )
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

}

module.exports = arduino