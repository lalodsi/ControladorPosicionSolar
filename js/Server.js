const socketIo = require("socket.io")
const express = require('express');
const routerApi = require('./routes')
// const ArduinoSerial = require('./js/ArduinoSerial.js');

class Server{

    constructor(){
        this.http = require('http')
        this.app = express();
        this.server = this.http.createServer(this.app);
        // Socket IO
        this.io = socketIo(this.server);

        this.app.use(express.json())
    }

    init = function () {
    }

    start = function() {
        this.app.set('port', process.env.PORT || 3000)
        this.server.listen(this.app.get('port'), ()=>{
            console.log('Servidor conectado en el puerto: ' + this.app.get('port'));
        })
        // Enviar la carpeta public al servidor
        this.app.use(express.static('public'))
    }

    socket = function(callback) {
        this.io.on('connection', (socket)=>{
            console.log('Tenemos una nueva conexión, Id: '+ socket.id);
            callback(socket);
        })
    }

    // Api = function () {
    //     routerApi(this.app)
    // }

}

module.exports = Server