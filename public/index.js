const html = new HTMLManager()
const socket = io()

html.init()
html.onPressArduino(socket)

socket.on('connect', ()=>{
    console.log(socket.id);
})

socket.on('arduinoConnectionState', data => {
    if (data.isConnected) {
        html.ocultarTodoExcepto(2, ".Contenido_Estado")
    } else {
        html.ocultarTodoExcepto(0, ".Contenido_Estado")
    }
})

html.apagar( function () {
    const instruccion = {
        quieresApagar: true
    }
    socket.emit('apagar', instruccion)
})

html.forms();