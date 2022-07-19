const socket = io();

// Estados de Conexion
let isConnected = false;
let itHasTheProgram = false;

// Inicializando
topBarFunctions();
introduccion();
ocultarTodoExcepto(0, ".principal"); //Cambiar
btnShowContent();
interactuarInputConRuedaDelMouse();
botonComenzarRecepcionDeDatos();
// botonConectarConArduino();
activarBotonComenzar("desactivado");
copiarAlPortapapeles();

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
    itHasTheProgram = data.hasTheProgram;
    if (data.hasTheProgram) {
        console.log("Verificación de software aceptada");
        eliminarMenuVerificacion();
        desvanecerFondo();
    }
    else{
        console.log("Software incorrecto");
        ocultarTodoExcepto(0, ".Contenido_Estado");
        eliminarMenuVerificacion();
        reaparecerMenuConexion();
        setTimeout(()=>errorAlIntentarConectar(data.message), 500);
    }
})
// Conexión entre servidor y arduino
socket.on('arduinoConnectionState', data => {
    enviarPalabraVerificacion();
    isConnected = data.isConnected;
    activarBotonComenzar( data.isConnected? "start" : "desactivado" )
    if (data.isConnected) {
        ocultarTodoExcepto(2, ".Contenido_Estado");
        desvanecerMenuConexion();
        aparecerMenuVerificacion();
    } else {
        if (data.error) {
            ocultarTodoExcepto(0, ".Contenido_Estado");
            errorAlIntentarConectar(data.message);
        }
        else{
            ocultarTodoExcepto(0, ".Contenido_Estado");
        }
    }
})
// Tratamiento de datos en modo monitoreo
socket.on('data', data => {
    asignaDatosSensores(data);
    graficaSensores.draw("sensores", data);
    representacion3D.draw3d("robot3d", data);
    graficaSensores.analisisANOVA(data);
});
// Informacion de puertos
socket.on("ports", data => {
    console.log(data);
});
// Interacción con el arduino
socket.on("MenuArduino", data => {
    
})


