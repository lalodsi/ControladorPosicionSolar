const socketIo = require("socket.io")
const express = require('express');
const routerApi = require('./routes')

class Server{

    constructor(){
        this.http = require('http')
        this.app = express();
        this.server = this.http.createServer(this.app);
        // Socket IO
        this.io = socketIo(this.server);

        this.app.use(express.json())
    }

    /**
     * Despliega el servidor y envía la carpeta public al cliente que se conecte
     */
    start = function() {
        this.app.set('port', process.env.PORT || 3000)
        this.server.listen(this.app.get('port'), ()=>{
            console.log('Servidor conectado en el puerto: ' + this.app.get('port'));
        })
        // Enviar la carpeta public al servidor
        this.app.use(express.static('public'))
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

    /**
     * Establece la restAPI
     */
    setApi = function (arduino) {
        routerApi(this.app, arduino)
    }

}

module.exports = Server