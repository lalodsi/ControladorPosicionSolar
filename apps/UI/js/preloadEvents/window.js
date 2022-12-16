const { contextBridge, ipcRenderer } = require('electron');

const closeApp = () => ipcRenderer.send('closeApp', true);
const minimizeApp = () => ipcRenderer.send('minimizeApp', true);

module.exports = {
    closeApp,
    minimizeApp
}