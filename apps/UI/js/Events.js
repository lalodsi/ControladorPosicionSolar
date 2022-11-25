const arduino = require('./ArduinoSerial.js');
const electron = require('electron')
const {SerialPort} = require('serialport');

const ipcMain = electron.ipcMain;

const eventNames = {
    test: 'synchronous-message',
    estadoArduino: 'arduinoConnectionState',
    versionSoftwareArduino: 'arduinoSoftwareTest',
    definirConexion: 'connect-to-arduino',
    monitorear: "startSendingData",
    intercambiarDatos: "data",
    enviarPalabra: "sendString",
    cambiarFechaYHora: "setDate",
    cambiarPosicion: "setPosition",
    cambiarOrientacion: "setOrientation",
    menuArduino: "MenuArduino",
    getPorts: "getPorts"
}


function appEvents() {
    /**
     * event para comenzar la conexión
     */
     const Arduino = new arduino();

    ipcMain.on(eventNames.test, (event, arg) => {
        console.log(arg);
        event.returnValue = "pong"
    })
    ipcMain.on(eventNames.getPorts, async (event, arg) => {
        const ports = await SerialPort.list()
        event.returnValue = ports
    })
    ipcMain.on(eventNames.definirConexion, (event, arg) => {
        if (arg.connect) {
            const port = arg.port;
            Arduino.init(port, ipcMain, eventNames.definirConexion);
        } else {
            Arduino.disconnect();
        }
        event.returnValue = {
            isConnected: true,
            error: false,
            message: ""
        }
    })
    ipcMain.on(eventNames.versionSoftwareArduino, data => {
        console.log("Comprobando el software cargado en el arduino");
        console.log(data.testing);
        if (data.testing) {
            setTimeout(()=> arduino.sendData("probar"), 1000 );
        }
    })
    // event para envío de palabras al arduino
    ipcMain.on( eventNames.enviarPalabra, data => {
        console.log(data.message);
        arduino.sendData(data.word);
    })
    /**
     * events para actualización de datos
     */
    ipcMain.on( eventNames.cambiarOrientacion, data =>{
        console.log(`Se cambiará la orientación a ${data.orientacion} grados`);
        arduino.sendData("orientation");
        setTimeout(() => arduino.sendData(`${data.orientacion}\n`), 1000);
    } );
    ipcMain.on( eventNames.cambiarFechaYHora, data =>{
        console.log(`Se cambiará la fecha y hora a ${data.fecha}, ${data.hora}`);
        arduino.sendData("date");
        setTimeout(() => arduino.sendData(`${data.fecha},${data.hora}`), 1000);
    } );
    ipcMain.on( eventNames.cambiarPosicion, data =>{
        console.log(`Se cambiará la posición a ${data.latitud}, ${data.longitud}`);
        arduino.sendData("position");
        // arduino.sendData(`${data.latitud},${data.longitud}`);
        setTimeout(() => arduino.sendData(`${data.latitud},${data.longitud}`), 1000);
    } );
    ipcMain.on(
        "monitorSerial",
        data => arduino.monitorSerialConnected = data.connected
        );

}

module.exports = {
    appEvents,
    eventNames
}