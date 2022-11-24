const { contextBridge, ipcRenderer } = require('electron');
const ArduinoSerial = require('../js/ArduinoSerial');
const { eventNames } = require('../js/Events');

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
      const result = ipcRenderer.sendSync('synchronous-message', 'ping')
      if (message) {
        console.log(`${result} con el mensaje: ${message}`);
      } else {
        console.log(result);
      }
    },
    getPorts: () => ipcRenderer.sendSync('getPorts', true),
    connect: (data) => {
      // console.log(data);
      ipcRenderer.sendSync(eventNames.iniciarConexion, data)
    }
})