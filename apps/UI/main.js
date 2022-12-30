// Electron
const { app : electronApp, BrowserWindow, ipcMain } = require("electron");
const ArduinoSerial = require('./js/ArduinoSerial.js');
const path = require("path");
const { setBehindEvents } = require('./js/BehindEvents.js')

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 700,
        frame: false,
        titleBarStyle: 'hidden',
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, './js/preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
            devTools: true,
        }
    })
    ipcMain.on('closeApp', ()=> {
        win.close();
    })
    ipcMain.on('minimizeApp', ()=> {
        console.log("Minimizando App desde server");
        win.minimize();
    })
    setBehindEvents(win)
    win.loadURL(`http://localhost:3000`);
};

console.clear();

// Iniciar Electron

electronApp.whenReady().then(createWindow)

electronApp.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electronApp.quit();
    }
})

electronApp.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow(port)
    }
})