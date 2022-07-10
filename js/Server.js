const socketIo = require("socket.io")
const express = require('express');
const routerApi = require("./routes");
const { BrowserWindow, app } = require('electron');
const windowApp = require('electron').app;

class Server{
    sockets = {
        estadoArduino: 'arduinoConnectionState',
        versionSoftwareArduino: 'arduinoSoftwareTest',
        iniciarConexion: 'connect-to-arduino',
        monitorear: "startSendingData",
        intercambiarDatos: "data",
        enviarPalabra: "sendString",
        cambiarFechaYHora: "setDate",
        cambiarPosicion: "setPosition",
        cambiarOrientacion: "setOrientation",
    }

    constructor(){
        this.http = require('http')
        this.app = express();
        this.server = this.http.createServer(this.app); 
        // Socket IO
        this.io = socketIo(this.server);

        this.app.use(express.json())
    }

    /**
     * Despliega el servidor, envía la carpeta public al cliente que se conecte
     * y crea la ventana desde donde se mostrará el enlace
     */
    start = function() {

        const createWindow = (port) => {
            const win = new BrowserWindow({
                width: 1200,
                height: 700
            })
            
            win.loadURL(`http://localhost:${port}`);
        };

        this.app.set('port', process.env.PORT || 3000)
        const port = this.app.get('port');
        this.server.listen(port, ()=>{
            console.log('Servidor conectado en el puerto: ' + port);
        })
        // Enviar la carpeta public al servidor
        this.app.use(express.static('public'));
        // Crear la ventana
        windowApp.whenReady().then(() => {
            createWindow(port);

            app.on('activate', () => {
                if (BrowserWindow.getAllWindows().length === 0) createWindow()
              }) 
        });
        // Close windows i
        windowApp.on('window-all-closed', () => {
            if (process.platform !== 'darwin') windowApp.quit();
        })

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

module.exports = Server