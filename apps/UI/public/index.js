const socket = io();

// Estados de Conexion
let isConnected = false;
let itHasTheProgram = false;
let actualState = "home";

// Inicializando
topBarFunctions();
introduccion();
ocultarTodoExcepto(0, ".principal"); //Cambiar
btnShowContent();
interactuarInputConRuedaDelMouse();
// botonComenzarRecepcionDeDatos();
// activarBotonComenzar("desactivado");
copiarAlPortapapeles();
botonEnviarMonitorSerial();
botonCerrarMonitorSerial();

// Gráficas a generar
// const graficaSensores = new graficas("Sensores");
// const representacion3D = new graficas("robot3d");

// Conexión entre servidor y cliente
socket.on('connect', ()=>{
    console.log(socket.id);
})
socket.on('disconnect', ()=>{
    console.log("Desconectado");
})
socket.on('arduinoSoftwareTest', data => {
    itHasTheProgram = data.hasTheProgram;
    eliminarMenuVerificacion();
    if (data.hasTheProgram) {
        console.log("Verificación de software aceptada");
        desvanecerFondo();
    }
    else{
        console.log("Software incorrecto");
        ocultarTodoExcepto(0, ".Contenido_Estado");
        reaparecerMenuConexion();
        setTimeout(()=>errorAlIntentarConectar(data.message), 500);
    }
})
// Conexión entre servidor y arduino
socket.on('arduinoConnectionState', data => {
    // enviarPalabraVerificacion();
    isConnected = data.isConnected;
    // activarBotonComenzar( data.isConnected? "start" : "desactivado" )
    if (data.isConnected) {
        ocultarTodoExcepto(2, ".Contenido_Estado");
        desvanecerMenuConexion();
        aparecerMenuDesarrollo();
        // aparecerMenuVerificacion();
    } else {
        eliminarMenuVerificacion();
        quitarMenuDesarrollo();
        if (data.error) {
            ocultarTodoExcepto(0, ".Contenido_Estado");
            errorAlIntentarConectar(data.message);
        }
        else{
            ocultarTodoExcepto(0, ".Contenido_Estado");
            cerrarMonitorSerial();
        }
    }
})
// Tratamiento de datos en modo monitoreo
socket.on('data', data => {
    asignaDatosSensores(data);
    draw2DPlot("sensores", data);
    draw3DPlot("robot3d", data);
    analisisANOVA(data);
    animacionModuloSensores(data);
});
// Informacion de puertos
socket.on("ports", data => {
    console.log(data);
});
// Interacción con el arduino
socket.on("MenuArduino", data => {
    actualState = data.menu;
    traerContenidoALaSeccion(actualState);
})
socket.on("monitorSerial", data => {
    escribirMonitorSerialTexto(data);
})

