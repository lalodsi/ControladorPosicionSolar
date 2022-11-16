// Electron
const { app : electronApp, BrowserWindow, ipcMain } = require("electron");
const ArduinoSerial = require('./js/ArduinoSerial.js');
const path = require("path");

// Servidor
const socketIo = require('socket.io');
const http = require('http');
const express = require('express');
const sockets = require('./js/Sockets');
const routerApi = require("./js/routes");

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 700,
        frame: false,
        titleBarStyle: 'hidden',
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, './public/preload.js'),
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
    win.loadURL(`http://localhost:3000`);
};

electronApp.whenReady().then(createWindow)

electronApp.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electronApp.quit();
    }
})

electronApp.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

console.clear();

// Iniciar Servidor

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(express.json())

// Start
app.set('port', process.env.port || 4001);
const port = app.get('port');
server.listen(port, () => {
    console.log('Servidor conectado en el puerto: ' + port);
});

routerApi(app);

io.on('connection', socket => {
    console.log('Tenemos una nueva conexión, Id: '+ socket.id);
    sockets(socket);
})