const { contextBridge, ipcRenderer } = require('electron');
const ArduinoSerial = require('../ArduinoSerial');

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

const pingPong = (message) => {
    const result = ipcRenderer.sendSync(eventNames.test, 'ping')
    if (message) {
      console.log(`${result} con el mensaje: ${message}`);
    } else {
      console.log(result);
    }
  }
const getPorts = () => ipcRenderer.sendSync(eventNames.getPorts, true)
const connect = (data) => {
    return ipcRenderer.send(eventNames.definirConexion, data)
}
const setConnectionListener = (callback) => ipcRenderer.on(eventNames.definirConexion, callback)

module.exports = {
    pingPong,
    getPorts,
    connect,
    setConnectionListener
}