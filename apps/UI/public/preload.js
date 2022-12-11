const { contextBridge, ipcRenderer } = require('electron');
const ArduinoSerial = require('../js/ArduinoSerial');
// const { eventNames } = require('../js/Events');

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

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

contextBridge.exposeInMainWorld('electronAPI', {
    closeApp: () => ipcRenderer.send('closeApp', true),
    minimizeApp: () => ipcRenderer.send('minimizeApp', true),
    pingPong: (message) => {
      const result = ipcRenderer.sendSync(eventNames.test, 'ping')
      if (message) {
        console.log(`${result} con el mensaje: ${message}`);
      } else {
        console.log(result);
      }
    },
    getPorts: () => ipcRenderer.sendSync(eventNames.getPorts, true),
    connect: (data) => {
      return ipcRenderer.send(eventNames.definirConexion, data)
    },
    setConnectionListener: (callback) => ipcRenderer.on(eventNames.definirConexion, callback)
})