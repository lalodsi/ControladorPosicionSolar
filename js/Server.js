const socketIo = require("socket.io")
const express = require('express');
// const ArduinoSerial = require('./js/ArduinoSerial.js');

class Server{

    constructor(){
        this.http = require('http')
        // this.{ Server } = require("socket.io")
        this.app = express();
        this.server = this.http.createServer(this.app);
        this.io = new socketIo.Server(this.server);
        // let arduino = new ArduinoSerial()
    }

    init = function () {
    }

    connect = function() {
        // Activa el servidor
        this.server.listen(3000, ()=>{
            console.log('Server on port 3000');
        })
        // Enviar la carpeta public al servidor
        this.app.use(express.static('public'))
    }

    socket = function() {
        return this.io
    }

}

module.exports = Server