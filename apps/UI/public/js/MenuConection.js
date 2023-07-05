const getMenuConexion = async function () {
    const url = `http://localhost:3000/api/v1/menu/contenido/5`;
    const response = await fetch(url);
    return await response.text();
}

const reaparecerMenuConexion = function () {
    const fondo = document.getElementById("fondoIntroduccion");
    const estadoConexion = document.getElementById("estadoConexion");
    estadoConexion.className = "subsection estado animado transparente";
    // fondo.className = "desvanecido";
    setTimeout( () => {
        const botonIntroduccion = document.getElementsByClassName("contenedorIntroduccion")[0];
        // fondo.className = "oscurecido";
        fondo.insertBefore(estadoConexion, botonIntroduccion);
        estadoConexion.className = "subsection estado visible";
        // Boton introduccion
        botonIntroduccion.className = "botonIntroduccion transparente";
    }, 500 );
}

const desvanecerMenuConexion = function name(params) {
    const estado = document.getElementById("estadoConexion");
    estado.className = "subsection estado animado transparente";
    // Desaparecer el boton
    const contenedorIntroduccion = document.getElementsByClassName("contenedorIntroduccion")[0];
    contenedorIntroduccion.className = "contenedorIntroduccion transparente";
    setTimeout( ()=>{
        const posicionOriginal = document.getElementsByClassName("control")[0];
        posicionOriginal.appendChild(estado);
        estado.className = "subsection estado visible"

        contenedorIntroduccion.className = "contenedorIntroduccion desaparecido";
    }, 500 );
}

const actualizarPuertos = async function () {
    const puertos = document.getElementById("puertos");
    puertos.innerHTML = "";

    // Obtener la lista de puertos
    const url = `http://localhost:3000/api/v1/menu/ports`;
    const response = await fetch(url);
    const responseList = await response.json();

    // Añadir una primer opción
    const primerOpcion = document.createElement("option");
    primerOpcion.setAttribute("disabled", "" );
    primerOpcion.setAttribute("selected", "" );
    primerOpcion.innerHTML = "Elige un puerto";
    puertos.appendChild(primerOpcion);

    // Añadir las demás opciones
    responseList.forEach( (puerto, index) => {
        const opcion = document.createElement("option");
        opcion.setAttribute("value", puerto.path );
        opcion.innerHTML = puerto.friendlyName;
        puertos.appendChild(opcion);
    });
};

    /**
     * # Establecer/Interrumpir conexión con arduino
     * Se activará la funcionalidad en el boton de conexión y desconexión del arduino
     * Es decir, establece el proceso de conexión y desconexión del servidor con arduino 
     * enviando las solicitudes por websockets y mostrando los menus correspondientes según el 
     * estado de la conexión.
     * ## Funcionamiento
     * El botón conectar/desconectar será quien desencadene la función de este elemento enviando un dato por web
     * web sockets al servidor indicando que deberá de establecer o terminar la conexión con el arduino, enviando
     * también el puerto al cual conectarse.
     * Se usarán las siguientes funciones para mejorar la interacción de esta función:
     * - ocultarTodoExcepto
     * 
     */
const botonConectarConArduino = function () {
    const botonConectar = document.getElementById('botonConectar');
    actualizarPuertos();
    botonConectar.addEventListener('click', ()=>{
        const puerto = document.getElementById("puertos").value;
        const data = {
            connect: true,
            port: puerto
        }
        socket.emit(eventosSockets.requestConnection, data);
        ocultarTodoExcepto(1, ".Contenido_Estado");
    })
    // Desconección
    const botonDesconectar = document.getElementById('botonDesconectar')
    botonDesconectar.addEventListener('click', ()=>{
        botonRegresarAlMenuHome()
        setTimeout(() => {
            socket.emit(eventosSockets.requestConnection, {connect: false})
            reaparecerFondo();
            // Reaparecer el boton introduccion
            const botonIntroduccion = document.getElementsByClassName("botonIntroduccion")[0];
            botonIntroduccion.className = "botonIntroduccion visible";

            setTimeout( ()=> ocultarTodoExcepto(0, ".Contenido_Estado"), 500 );
        }, 1000)
    })
}

const errorAlIntentarConectar = function (message) {
    const estadoConexion = document.getElementById("estadoConexion");
    estadoConexion.className = "subsection estado temblor";
    setTimeout( () => estadoConexion.className = "subsection estado", 500 );
    const botonIntroduccion = document.getElementsByClassName("contenedorIntroduccion")[0];
    const fondo = document.getElementById("fondoIntroduccion");
    // Crear la alerta
    const mensaje = document.createElement("div");
    mensaje.className = "subsection errorMessage";
    mensaje.innerHTML = `Error: ${message}`;
    // Colocar la alerta
    fondo.insertBefore(mensaje, botonIntroduccion);
    setTimeout( () => mensaje.className = "subsection errorMessageBye", 4500);
    setTimeout( () => mensaje.parentNode.removeChild(mensaje), 5000);
}

const activarBotonActualizar = function () {
    const boton = document.getElementById("botonActualizar");
    boton.addEventListener("click", ()=>{
        actualizarPuertos();
    });
};

const activarMenuConexion = function () {
    botonConectarConArduino();
    activarBotonActualizar();
    ocultarTodoExcepto(0, ".Contenido_Estado");
}