const express = require('express');
const http = require('http')
// const { Server } = require("socket.io")
const socketIo = require("socket.io")

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server);

const ArduinoSerial = require('./js/ArduinoSerial.js');
// const HTMLManager = require('./js/HTMLManager.js');



// let administrador = new HTMLManager()
let arduino = new ArduinoSerial()


// Activa el servidor
server.listen(3000, ()=>{
    console.log('Server on port 3000');
})
// Avisar cuando un usuario este conectado
io.on('connection', function(socket) {
    console.log('Nuevo usuario Conectado');
})
// Enviar la carpeta public al servidor
app.use(express.static('public'))
// Conexion con Arduino
arduino.init()
arduino.openPort()
arduino.receiveData(function(datos) {
    io.emit('arduino:data', {
        value: datos
    })
})
