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
 * Activa o desactiva el botón para comenzar el envío de datos según el parámetro entrante que determina el estado del arduino
 * @param {boolean} data bandera para activar o desactivar el boton comenzar
 */
const activarBotonComenzar = function (state) {
    const botonStart =document.getElementById('startMonitoreo');
    if (state === "start") {
        botonStart.className = "botonStart start";
        botonStart.setAttribute('style', 'display: block;')
    }
    else if (state === "stop") {
        botonStart.className = "botonStart stop";
        botonStart.setAttribute('style', 'display: block;')
    }
    else if(state === "desactivado"){
        botonStart.className = "botonStart";
        botonStart.setAttribute('style', 'display: none;')
    }
};

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
                callback();
            }
        });
    })
};

/**
 * Crear un elemento HTML del tipo
 * <div class="lds-ripple">
 *   <div></div>
 *   <div></div>
 * </div>
 */
const aparecerMenuVerificacion = function () {
    // Creando animacion de carga
    const loadingElement = document.createElement("div");
    loadingElement.appendChild(document.createElement("div"));
    loadingElement.appendChild(document.createElement("div"));
    loadingElement.className = "lds-ripple";

    // Contenedor
    const estadoVerificacion = document.createElement("div");
    estadoVerificacion.id = "estadoVerificacion";
    // estadoVerificacion.className = "subsection estado animado transparente";
    estadoVerificacion.className = "animado transparente";
    
    // Text
    const texto = document.createElement("div");
    texto.className = "texto";
    texto.innerHTML = "Verificando versión de software";
    
    estadoVerificacion.appendChild(loadingElement);
    estadoVerificacion.append(texto);
    const fondo = document.getElementById("fondoIntroduccion");
    const botonIntroduccion = document.getElementsByClassName("contenedorIntroduccion")[0];
    fondo.insertBefore(estadoVerificacion, botonIntroduccion);
    setTimeout( () => {
        estadoVerificacion.className = "loadingContainer visible";
    }, 500 );
}

/**
 * Agrega funcionalidad a los botones para mostrar las diferentes vistas de la sección para información principal
 * Los botones realizarán una consulta GET a través de la ruta 'api/v1/menu/contenido/:id' para recibir el menu correspondiente y añadirlo a la aplicación
 */
const btnShowContent = function() {
    const botones = document.querySelectorAll(".boton");
    const arrBotones = devolverArrayHTML(botones);
    const request = async function (index) {
        const contenedor = document.getElementsByClassName("principal")[0];
        const url = `http://localhost:3000/api/v1/menu/contenido/${index + 1}`;
        const response = await fetch(url);
        contenedor.innerHTML = await response.text();
        if (index === 3) {
            activarCalibracion();
            activarForms();
            interactuarInputConRuedaDelMouse();
        }
        if (index === 2) {
            interactuarInputConRuedaDelMouse( ()=>{
                const azimut = document.getElementById("azimut").value;
                const elevacion = document.getElementById("elevacion").value;
                socket.emit(
                    eventos.enviarPalabra,
                    {
                        word: `${azimut},${elevacion}`,
                        message: "Se envio la informacion"
                    }
                );
            } );
            socket.emit(
                eventos.enviarPalabra,
                {
                    word: "salir",
                    message: "Se envio la palabra salir"
                }
            );
            setTimeout(() => {
                socket.emit(eventos.enviarPalabra,
                    {word: "controlar", message: "Se envio la palabra controlar"}
                );
            }, 200);
        }
        if (index === 0) {
            socket.emit(eventos.enviarPalabra,
                {word: "salir", message: "Se envio la palabra salir"}
                );
            copiarAlPortapapeles();
        }
    };

    arrBotones.forEach( (elem, index) => {
        elem.addEventListener( "click", () => {
            request(index);
        } )
    } )
};

/**
 * Controla la actividad de monitoreo del arduino
 * El control de esta actividad se hace a través de las siguientes acciones:
 * - Cambiar el boton para comenzar y terminar monitoreo
 * - Enviar el socket correspondiente para 
 */
const botonComenzarRecepcionDeDatos = function () {
    const socketName = eventosSockets.comenzarRecepcionDeDatos; // startSendingData
    const boton = document.getElementById('startMonitoreo');
    const botonComenzarFuncion = activarBotonComenzar;
    boton.addEventListener( "click", () => {
        const texto = boton.innerHTML;
        if (texto === "Comenzar Monitoreo") {
            socket.emit(socketName, { comenzar : true });
            botonComenzarFuncion("stop");
            boton.innerHTML = "Terminar Monitoreo";
        }
        if (texto === "Terminar Monitoreo") {
            socket.emit(socketName, { comenzar : false });
            botonComenzarFuncion("start");
            boton.innerHTML = "Comenzar Monitoreo";
        }
    })
};

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