const { ipcRenderer } = require('electron');
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
// Obtiene los puertos disponibles en la computadora
const getPorts = () => ipcRenderer.sendSync(eventNames.getPorts, true)
/**
 * Conecta y desconecta el arduino
 * @param {object} data 
 * @returns 
 */
const setConnection = (data) => {
    return ipcRenderer.sendSync(eventNames.definirConexion, data)
};
/**
 * Event listenes, cuando ocurra el evento, se llama al callback
 * @param {(event, args) => void} callback funcion a llamar con los parametros deseados.
 * @returns void
 */
const setConnectionListener = (callback) => ipcRenderer.on(eventNames.definirConexion, callback)

module.exports = {
    pingPong,
    getPorts,
    setConnection,
    setConnectionListener
}