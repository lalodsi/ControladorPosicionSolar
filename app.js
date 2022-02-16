const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app);
const { Server } = require("socket.io")
const io = new Server(server);


const ArduinoSerial = require('./js/ArduinoSerial.js');
const HTMLManager = require('./js/HTMLManager.js');




let arduino = new ArduinoSerial()


io.on('conection', (socket) => {
    console.log('Usuario Conectado');
})

server.listen(3000, ()=>{
    console.log('Server on port 3000');
})

app.get('/', (req, res, next) => {
    // console.log( __dirname + "\\index.html");
    res.sendFile( __dirname + "/index.html")
})

arduino.init()
arduino.openPort()
arduino.receiveData()