const socket = io();
const html = new HTMLManager(socket);

html.botonConectarConArduino();

html.activarBotonComenzar(false)
socket.on('connect', ()=>{
    console.log(socket.id);
})

socket.on('arduinoConnectionState', data => {
    html.activarBotonComenzar(data.isConnected)
    if (data.isConnected) {
        html.ocultarTodoExcepto(2, ".Contenido_Estado")
    } else {
        html.ocultarTodoExcepto(0, ".Contenido_Estado")
    }
})

socket.on('data', html.asignaDatos)

html.activarForms();