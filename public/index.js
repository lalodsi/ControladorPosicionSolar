const socket = io();
const dom = new DOM(socket);

// Gráficas a generar
const graficaSensores = new graficas("Sensores");
const representacion3D = new graficas("robot3d");

// Conexión entre servidor y cliente
socket.on('connect', ()=>{
    console.log(socket.id);
})
socket.on('disconnect', ()=>{
    console.log("Desconectado");
})
socket.on('arduinoSoftwareTest', data => {
    if (data.hasTheProgram) {
        console.log("Verificación de software aceptada");
        dom.eliminarMenuVerificacion();
        dom.desvanecerFondo();
    }
    else{
        console.log("Software incorrecto");
        dom.ocultarTodoExcepto(0, ".Contenido_Estado");
        dom.eliminarMenuVerificacion();
        dom.reaparecerMenuConexion();
        setTimeout(()=>dom.errorAlIntentarConectar(data.message), 500);
    }
})
// Conexión entre servidor y arduino
socket.on('arduinoConnectionState', data => {
    dom.enviarPalabraVerificacion();
    dom.activarBotonComenzar( data.isConnected? "start" : "desactivado" )
    if (data.isConnected) {
        dom.ocultarTodoExcepto(2, ".Contenido_Estado");
        dom.desvanecerMenuConexion();
        dom.aparecerMenuVerificacion();
    } else {
        if (data.error) {
            dom.ocultarTodoExcepto(0, ".Contenido_Estado");
            dom.errorAlIntentarConectar(data.message);
        }
        else{
            dom.ocultarTodoExcepto(0, ".Contenido_Estado");
        }
    }
})
// Tratamiento de datos en modo monitoreo
socket.on('data', data => {
    dom.asignaDatosSensores(data);
    graficaSensores.draw("sensores", data);
    representacion3D.draw3d("robot3d", data);
    graficaSensores.analisisANOVA(data, dom);
});
// Informacion de puertos
socket.on("ports", data => {
    console.log(data);
});


