const administrador = new HTMLManager()
const socket = io()
// const { io } = require("socket.io-client");

administrador.init()
administrador.onPressArduino(socket)

socket.on('connect', ()=>{
    console.log(socket.id);
})