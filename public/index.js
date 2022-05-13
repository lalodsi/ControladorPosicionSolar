const socket = io();
const dom = new DOM(socket);

dom.botonConectarConArduino();
dom.activarBotonComenzar("desactivado")

// Gráficas a generar
const graficaSensores = new graficas("Sensores");
const representacion3D = new graficas("robot3d");

// Conexión entre servidor y cliente
socket.on('connect', ()=>{
    console.log(socket.id);
})
// Conexión entre servidor y arduino
socket.on('arduinoConnectionState', data => {
    dom.activarBotonComenzar( data.isConnected? "start" : "desactivado" )
    if (data.isConnected) {
        dom.ocultarTodoExcepto(2, ".Contenido_Estado");
        dom.desvanecerFondo();
    } else {
        dom.ocultarTodoExcepto(0, ".Contenido_Estado");
        dom.reaparecerFondo();
    }
})
// Tratamiento de datos en modo monitoreo
socket.on('data', data => {
    dom.asignaDatos(data);
    graficaSensores.draw("sensores", data);
    representacion3D.draw3d("robot3d", data);
});


