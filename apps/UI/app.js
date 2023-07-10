const ArduinoSerial = require('./js/ArduinoSerial.js');
const {Server, startWindow} = require('./js/Server.js');
const electron = require('electron');
const fs = require('fs');

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
        setTimeout(()=>{
            if (!arduino.isApproved && arduino.isConnected) {
                socket.emit(servidor.sockets.versionSoftwareArduino, 
                    {
                        hasTheProgram: false,
                        message: "El dispositivo no tiene el software adecuado"
                    });    
                console.log(arduino.mensajes.checkingFailed);
                arduino.disconnect(socket, servidor, false, "");
            }
        }, 5000);
    })
    // Socket para envío de palabras al arduino
    socket.on( servidor.sockets.enviarPalabra, data => {
        console.log(data.message);
        arduino.sendData(data.word);
    })
    // Socket para exportación de información
    socket.on( servidor.sockets.exportData, NoData => {
        const data = arduino.data;
        console.log("Datos que tiene guardado el arduino");
        console.log(data);

        const stringified = JSON.stringify(data);
        const now = new Date();
        const fileName = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}-Data.json`;
        fs.writeFileSync('./dataSaved/' + fileName, stringified);
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
        console.log("Mostrar datos desde Server");
        console.log(data);
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