const html = new HTMLManager();
const socket = io();

html.defineSocket(socket);
html.init();
html.onPressArduino();

html.botonStart(false)
socket.on('connect', ()=>{
    console.log(socket.id);
})

socket.on('arduinoConnectionState', data => {
    html.botonStart(data.isConnected)
    if (data.isConnected) {
        html.ocultarTodoExcepto(2, ".Contenido_Estado")
    } else {
        html.ocultarTodoExcepto(0, ".Contenido_Estado")
    }
})

socket.on('send-receive', html.asignaDatos)

html.forms(socket);