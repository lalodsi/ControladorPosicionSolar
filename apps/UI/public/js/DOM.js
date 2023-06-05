    /**
     * # Asignar Datos
     * Asigna los datos recibidos en el los campos correspondientes en la web.
     * Para ello asigna datos deberá ser llamado cuando ya se tenga los datos extraídos y separados.
     * 
     * TODO: Crecer esta funcion para separar todos los datos 
     * @param {Array} dataArray Datos recibidos del arduino
     */
const asignaDatos = function (dataArray, id) {
    const Elementos = document.querySelectorAll(id);
    if (Elementos.length) {
        if (Elementos.length > 1) {
            dataArray.forEach( (dato, index) => {
                Elementos[index].innerHTML = dato.toFixed(2);
            } )
        }
        else{
            Elementos[0].innerHTML = dataArray.toFixed(2);
        }
    }
};

const asignaDatosSensores = function (dataArray) {
    asignaDatos(dataArray, "#showSensores");
};

const asignaDatosPromediosSensores = function (dataArray) {
    asignaDatos(dataArray, "#showPromedios");
};

const asignaDatosVarianzasSensores = function (dataArray) {
    asignaDatos(dataArray, "#showVarianzas");
};

const asignaDatosPromedioTotal = function (dataArray) {
    asignaDatos(dataArray, "#showPromedioTotal");
};

const asignaDatosS2PE = function (dataArray) {
    asignaDatos(dataArray, "#showS2PE");
};

const asignaDatosS2Factor = function (dataArray) {
    asignaDatos(dataArray, "#showS2factor");
};

const asignaDatosF = function (dataArray) {
    asignaDatos(dataArray, "#showF");
}

/**
 * Activa un event listener en los input numéricos de modo que sus valores puedan
 * ser modificados con la rueda del mouse
 */
const interactuarInputConRuedaDelMouse = function ( callback ) {
    const entradasDocument = document.querySelectorAll('input[type="number" i]')
    const entradas = devolverArrayHTML(entradasDocument);
    entradas.forEach( (entrada) => {
        entrada.addEventListener('wheel', ()=>{
            if (callback) {
                console.log("Activando callback");
                callback();
            }
        });
    })
};

/**
 * Controla la actividad de monitoreo del arduino
 * El control de esta actividad se hace a través de las siguientes acciones:
 * - Cambiar el boton para comenzar y terminar monitoreo
 * - Enviar el socket correspondiente para 
 */
// const botonComenzarRecepcionDeDatos = function () {
//     const socketName = eventosSockets.comenzarRecepcionDeDatos; // startSendingData
//     const boton = document.getElementById('startMonitoreo');
//     const botonComenzarFuncion = activarBotonComenzar;
//     boton.addEventListener( "click", () => {
//         const texto = boton.innerHTML;
//         if (texto === "Comenzar Monitoreo") {
//             socket.emit(socketName, { comenzar : true });
//             botonComenzarFuncion("stop");
//             boton.innerHTML = "Terminar Monitoreo";
//         }
//         if (texto === "Terminar Monitoreo") {
//             socket.emit(socketName, { comenzar : false });
//             botonComenzarFuncion("start");
//             boton.innerHTML = "Comenzar Monitoreo";
//         }
//     })
// };

const copiarAlPortapapeles = function () {
    const datosHTML = document.querySelectorAll(".dato");
    const arrayHTML = devolverArrayHTML(datosHTML);
    arrayHTML.map( dato => 
        dato.addEventListener(
            'click', 
            navigator.clipboard.writeText(this.value)
        )
    );
};