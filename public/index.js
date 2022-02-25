const html = new HTMLManager();
const socket = io();

html.defineSocket(socket);
html.init();
html.onPressArduino();

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

html.forms(socket);