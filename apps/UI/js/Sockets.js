const arduino = require('./ArduinoSerial.js');

const socketsNames = {
    estadoArduino: 'arduinoConnectionState',
    versionSoftwareArduino: 'arduinoSoftwareTest',
    iniciarConexion: 'connect-to-arduino',
    monitorear: "startSendingData",
    intercambiarDatos: "data",
    enviarPalabra: "sendString",
    cambiarFechaYHora: "setDate",
    cambiarPosicion: "setPosition",
    cambiarOrientacion: "setOrientation",
    menuArduino: "MenuArduino"
}


function sockets(socket) {
    /**
     * Socket para comenzar la conexión
     */
    socket.on(socketsNames.iniciarConexion, data => {
        if (data.connect) {
            const port = data.port;
            arduino.init(port, socket, servidor);
        } else {
            arduino.disconnect(socket, servidor);
        }
    })
    socket.on(socketsNames.versionSoftwareArduino, data => {
        console.log("Comprobando el software cargado en el arduino");
        console.log(data.testing);
        if (data.testing) {
            setTimeout(()=> arduino.sendData("probar"), 1000 );
        }
    })
    // Socket para envío de palabras al arduino
    socket.on( socketsNames.enviarPalabra, data => {
        console.log(data.message);
        arduino.sendData(data.word);
    })
    /**
     * Sockets para actualización de datos
     */
    socket.on( socketsNames.cambiarOrientacion, data =>{
        console.log(`Se cambiará la orientación a ${data.orientacion} grados`);
        arduino.sendData("orientation");
        setTimeout(() => arduino.sendData(`${data.orientacion}\n`), 1000);
    } );
    socket.on( socketsNames.cambiarFechaYHora, data =>{
        console.log(`Se cambiará la fecha y hora a ${data.fecha}, ${data.hora}`);
        arduino.sendData("date");
        setTimeout(() => arduino.sendData(`${data.fecha},${data.hora}`), 1000);
    } );
    socket.on( socketsNames.cambiarPosicion, data =>{
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

module.exports = sockets;