const socketIo = require("socket.io")
const express = require('express');
const routerApi = require("./routes");
const { BrowserWindow, app, ipcMain } = require('electron');
const path = require("path");
const windowApp = require('electron').app;

class Server{

    /**
     * Despliega el servidor, envía la carpeta public al cliente que se conecte
     * y crea la ventana desde donde se mostrará el enlace
     */
    start = function() {
        console.clear();
        this.app.set('port', process.env.PORT || 3000)
        const port = this.app.get('port');
        this.server.listen(port, ()=>{
            console.log('Servidor conectado en el puerto: ' + port);
        })
        // Enviar la carpeta public al servidor
        this.app.use(express.static('public'));

        routerApi(this.app);
    }

    /**
     * Establece un websocket
     * @param {function} callback funcion a ejecutar cuando se conecte el socket
     */
    socket = function(callback) {
        this.io.on('connection', (socket)=>{
            console.log('Tenemos una nueva conexión, Id: '+ socket.id);
            callback(socket);
        })
    }

}

function startWindow() {
    const createWindow = (port) => {
        const win = new BrowserWindow({
            width: 1200,
            height: 700,
            frame: false,
            titleBarStyle: 'hidden',
            resizable: false,
            webPreferences: {
                preload: path.join(__dirname, '../public/preload.js'),
                nodeIntegration: true, 
                contextIsolation: true,
                devTools: true,
            }
        })
        ipcMain.on('closeApp', ()=> {
            win.close();
        })
        ipcMain.on('minimizeApp', ()=> {
            win.minimize();
        })
        
        win.loadURL(`http://localhost:${port}`);
    };

    // Crear la ventana
    windowApp.whenReady().then(() => {
        createWindow('3000');

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow('3000')
          }) 
    });
    // Close windows i
    windowApp.on('window-all-closed', () => {
        if (process.platform !== 'darwin') windowApp.quit();
    })
    return createWindow;
}

module.exports = {Server, startWindow};