const { contextBridge, ipcRenderer } = require('electron');
const ArduinoSerial = require('./ArduinoSerial');
const preloadEvents = require('./preloadEvents');

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
  ...preloadEvents
})