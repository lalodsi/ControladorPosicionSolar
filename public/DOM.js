// Llamar DOM
class DOM{
    eventos = {
        enviarPalabra: "sendString",
        calibrarFecha: "setDate",
        calibrarPosicion: "setPosition",
        calibrarOrientacion: "setOrientation",
        controlarMotores: "setMotores",
        controlarAlgoritmo: "setAlgoritmo",
        closeApp: "closeApp",
        minimizeApp: "minimizeApp",
    }
    eventosSockets = {
        requestConnection: "connect-to-arduino",
        comenzarRecepcionDeDatos: "startSendingData",
        testearSoftware: "arduinoSoftwareTest"

    }
    
    /**
     * Inicializa todos los módulos 
     */
    constructor(socket){
        this.socket = socket;
        this.ocultarTodoExcepto(0, ".principal"); //Cambiar
        this.ocultarTodoExcepto(0, ".Contenido_Estado");
        this.btnShowContent();
        this.interactuarInputConRuedaDelMouse();

        this.comenzarConexion = false;
        this.botonComenzarRecepcionDeDatos();
        this.introduccion();
        this.botonConectarConArduino();
        this.activarBotonComenzar("desactivado");
        this.activarBotonActualizar();
        this.topBarFunctions();
    }


    /**
     * # Devolver un Array de objetos HTML
     * Convierte una colección HTML a Array para poder utilizar las funciones internas de los arrays
     * 
     * @param {HTMLCollection} document
     * @returns array of HTML
     */
    devolverArrayHTML = function(document){
        return [].concat(...document)
    }

    /**
     * # Ocultar Todo Excepto un elemento
     * Oculta todos los campos de contenido menos el indicado en la sección de contenido
     * Funciona correctamente si los diferentes elementos comparten el mismo className
     * @param {int} index Formulario que no se estará ocultando
     * @param {string} className nombre de la clase para los elementos que serán ocultados
     * @param {function} callbacks funciones que se estarán ejecutando en el orden de elementos a ocultar según el array
     * 
     * El parámetro "...callbacks" recibe los parametros restantes y será llamado sólo el parámetro llamado en {index} lugar
     */
    ocultarTodoExcepto = function(index, className, ...callbacks){
        const forms = document.querySelectorAll(className);
        const arrayForms = this.devolverArrayHTML(forms);
        arrayForms.forEach( function(elem, ArrIndex, origArray) {
            elem.setAttribute( "style", "display: none" )
            if (index == ArrIndex) {
                elem.setAttribute( "style", "display: block" )
                if (callbacks.length && callbacks.length <= origArray.length) {
                    if(typeof(callbacks[ArrIndex] === "function")){
                        callbacks[ArrIndex]();
                    }
                }
            }
        } )
    }

    /**
     * Agrega funcionalidad a los botones para mostrar las diferentes vistas de la sección para información principal
     * Los botones realizarán una consulta GET a través de la ruta 'api/v1/menu/contenido/:id' para recibir el menu correspondiente y añadirlo a la aplicación
     */
    btnShowContent = function() {
        const botones = document.querySelectorAll(".boton");
        const arrBotones = this.devolverArrayHTML(botones);
        const request = async function (index) {
            const contenedor = document.getElementsByClassName("principal")[0];
            const url = `http://localhost:3000/api/v1/menu/contenido/${index + 1}`;
            const response = await fetch(url);
            contenedor.innerHTML = await response.text();
            if (index === 3) {
                this.activarCalibracion();
                this.activarForms();
                this.interactuarInputConRuedaDelMouse();
            }
            if (index === 2) {
                this.interactuarInputConRuedaDelMouse( ()=>{
                    const azimut = document.getElementById("azimut").value;
                    const elevacion = document.getElementById("elevacion").value;
                    this.socket.emit(this.eventos.enviarPalabra,
	                {word: `${azimut},${elevacion}`, message: "Se envio la informacion"}
		            );
                } );
                this.socket.emit(this.eventos.enviarPalabra,
                    {word: "salir", message: "Se envio la palabra salir"}
                );
                setTimeout(() => {
                    this.socket.emit(this.eventos.enviarPalabra,
                        {word: "controlar", message: "Se envio la palabra controlar"}
                    );
                }, 200);
            }
            if (index === 0) {
                this.socket.emit(this.eventos.enviarPalabra,
                    {word: "salir", message: "Se envio la palabra salir"}
                    );
                this.copiarAlPortapapeles();
            }
        }.bind(this);

        arrBotones.forEach( (elem, index) => {
            elem.addEventListener( "click", () => {
                request(index);
            } )
        } )
    }

    copiarAlPortapapeles = function () {
        const datosHTML = documet.querySelectorAll(".dato");
        const arrayHTML = this.devolverArrayHTML(datosHTML);
        arrayHTML.map( dato => 
            dato.addEventListener(
                'click', 
                navigator.clipboard.writeText(this.value)
            )
        );
    }

    /**
     * # ActivarCalibración
     * Función que envía un socket al servidor para enviar el dato de calibración al arduino
     */
    activarCalibracion = () => {
        console.log("Se ha activado la calibración desde el Front");
        this.socket.emit(this.eventos.enviarPalabra, 
            {word: "calibrar", message: "Se envió la palabra 'calibrar' al arduino"}
            );
    }

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
    botonConectarConArduino = function () {
        const botonConectar = document.getElementById('botonConectar');
        this.actualizarPuertos();
        botonConectar.addEventListener('click', ()=>{
            const puerto = document.getElementById("puertos").value;
            const data = {
                connect: true,
                port: puerto
            }
            this.socket.emit(this.eventosSockets.requestConnection, data);
            this.ocultarTodoExcepto(1, ".Contenido_Estado");
        })
        // Desconección
        const botonDesconectar = document.getElementById('botonDesconectar')
        botonDesconectar.addEventListener('click', ()=>{
            this.socket.emit(this.eventosSockets.requestConnection, {connect: false})
            this.reaparecerFondo();
            setTimeout( ()=> this.ocultarTodoExcepto(0, ".Contenido_Estado"), 500 );
        })
    }

    actualizarPuertos = async function () {
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
    }

    activarBotonActualizar = function () {
        const boton = document.getElementById("botonActualizar");
        boton.addEventListener("click", ()=>{
            this.actualizarPuertos();
        });
    }

    /**
     * # Desvanecer Fondo
     * Desvanece el fondo negro de la 'introducción' y posiciona la sección de estado en su lugar original de modo que el proyecto se pueda utilizar de manera normal
     * Función que se ejecuta sólo cuando el servidor haya comunicado una conexión exitosa con el arduino
     */
    desvanecerFondo = function () {
        const fondo = document.getElementById("fondoIntroduccion");
        fondo.className = "desvanecido";
        setTimeout( ()=>{
            fondo.className = "desvanecido desaparecido";
        }, 500 );
    }
    
    desvanecerMenuConexion = function name(params) {
        const estado = document.getElementById("estadoConexion");
        estado.className = "subsection estado animado transparente";
        setTimeout( ()=>{
            const posicionOriginal = document.getElementsByClassName("control")[0];
            posicionOriginal.appendChild(estado);
            estado.className = "subsection estado visible"
        }, 500 );
    }

    reaparecerFondo = function () {
        const fondo = document.getElementById("fondoIntroduccion");
        const estadoConexion = document.getElementById("estadoConexion");
        estadoConexion.className = "subsection estado animado transparente";
        fondo.className = "desvanecido";
        setTimeout( () => {
            const botonIntroduccion = document.getElementsByClassName("contenedorIntroduccion")[0];
            fondo.className = "oscurecido";
            fondo.insertBefore(estadoConexion, botonIntroduccion);
            estadoConexion.className = "subsection estado visible";
        }, 500 );
    }

    reaparecerMenuConexion = function () {
        const fondo = document.getElementById("fondoIntroduccion");
        const estadoConexion = document.getElementById("estadoConexion");
        estadoConexion.className = "subsection estado animado transparente";
        // fondo.className = "desvanecido";
        setTimeout( () => {
            const botonIntroduccion = document.getElementsByClassName("contenedorIntroduccion")[0];
            // fondo.className = "oscurecido";
            fondo.insertBefore(estadoConexion, botonIntroduccion);
            estadoConexion.className = "subsection estado visible";
        }, 500 );
    }

    enviarPalabraVerificacion = function () {
        this.socket.emit(this.eventosSockets.testearSoftware,
            {testing: true}
            );
    }
    
    /**
     * Crear un elemento HTML del tipo
     * <div class="lds-ripple">
     *   <div></div>
     *   <div></div>
     * </div>
     */
    aparecerMenuVerificacion = function () {
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

    eliminarMenuVerificacion = function () {
        const estadoVerificacion = document.getElementById("estadoVerificacion")
        const fondo = document.getElementById("fondoIntroduccion");
        if (estadoVerificacion) {
            fondo.removeChild(estadoVerificacion);
        }
    }

    errorAlIntentarConectar = function (message) {
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
        setTimeout( () => mensaje.className = "subsection errorMessageBye", 1500);
        setTimeout( () => mensaje.parentNode.removeChild(mensaje), 2000);
    }

    /**
     * Controla la actividad de monitoreo del arduino
     * El control de esta actividad se hace a través de las siguientes acciones:
     * - Cambiar el boton para comenzar y terminar monitoreo
     * - Enviar el socket correspondiente para 
     */
    botonComenzarRecepcionDeDatos = function () {
        const socketName = this.eventosSockets.comenzarRecepcionDeDatos; // startSendingData
        const boton = document.getElementById('startMonitoreo');
        const botonComenzarFuncion = this.activarBotonComenzar;
        boton.addEventListener( "click", () => {
            const texto = boton.innerHTML;
            if (texto === "Comenzar Monitoreo") {
                this.socket.emit(socketName, { comenzar : true });
                botonComenzarFuncion("stop");
                boton.innerHTML = "Terminar Monitoreo";
            }
            if (texto === "Terminar Monitoreo") {
                this.socket.emit(socketName, { comenzar : false });
                botonComenzarFuncion("start");
                boton.innerHTML = "Comenzar Monitoreo";
            }
            // this.comenzarConexion = !this.comenzarConexion;
        })
    }

    /**
     * # Ejecutar todos los metodos que evalúan a los formularios
     */
    activarForms = function () {
        this.formCalibrarReloj();
        this.formCalibrarPosicion();
        this.formCalibrarOrientacion();
    }
    
    /**
     * # setForm
     * Escucha el evento "submit" de todos los forms, evita la recarga y ejecuta
     * la función de callback.
     * Esta función es base para las funciones siguientes:
     * - formCalibrarReloj
     * - formCalibrarPosicion
     * - formCalibrarOrientacion
     * @param {string} id del formulario a evaluar
     * @param {function} callback accion a realizar al ocurrir el evento submit
     */
    setForm = function (id, callback) {
        const formulario = document.getElementById(id);
        formulario.addEventListener('submit', function(event) {
            event.preventDefault();
            callback(this)
        })
        
    }

    /**
     * Programa un envío para la información de la fecha y hora ingresados hacia el arduino
     */
    formCalibrarReloj = function () {
        this.setForm('formSetTime', (form) => {
            const fecha = form.children[1].value;
            const hora = form.children[2].value;

            const objeto = {
                fecha: fecha,
                hora: hora
            };
            this.socket.emit(this.eventos.calibrarFecha, objeto);
        })
    }

    /**
     * Programa un envío de la información ingresada de latitud y longitud hacia el arduino
     */
    formCalibrarPosicion = function () {
        this.setForm("formSetPosition", (form)=> {
            // TypeError: Cannot read properties of undefined (reading 'value')
            const latitud = form.children[2].children[1].value;
            const longitud = form.children[2].children[3].value;
            
            const dato = {
                latitud: latitud,
                longitud: longitud
            };
            this.socket.emit(this.eventos.calibrarPosicion, dato);
        })
    }

    /**
     * Programa un envío de la información de la orientación hacia el arduino
     */
    formCalibrarOrientacion = function () {
        this.setForm("formSetOrientation", (form) => {
            const orientacion = form.children[2].children[1].value;
            console.log(orientacion);

            const data = {
                orientacion: orientacion
            };
            this.socket.emit(this.eventos.calibrarOrientacion, data);
        })
    }

    /**
     * Activa un event listener en los input numéricos de modo que sus valores puedan
     * ser modificados con la rueda del mouse
     */
    interactuarInputConRuedaDelMouse = function ( callback ) {
        const entradasDocument = document.querySelectorAll('input[type="number" i]')
        const entradas = this.devolverArrayHTML(entradasDocument);
        entradas.forEach( (entrada) => {
            entrada.addEventListener('wheel', ()=>{
                if (callback) {
                    callback();
                }
            });
        })
    }

    /**
     * Activa o desactiva el botón para comenzar el envío de datos según el parámetro entrante que determina el estado del arduino
     * @param {boolean} data bandera para activar o desactivar el boton comenzar
     */
    activarBotonComenzar = function (state) {
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
    }

    /**
     * # Asignar Datos
     * Asigna los datos recibidos en el los campos correspondientes en la web.
     * Para ello asigna datos deberá ser llamado cuando ya se tenga los datos extraídos y separados.
     * 
     * TODO: Crecer esta funcion para separar todos los datos 
     * @param {Array} dataArray Datos recibidos del arduino
     */
    asignaDatos = function (dataArray, id) {
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
    }
    asignaDatosSensores = function (dataArray) {
        this.asignaDatos(dataArray, "#showSensores");
    }
    asignaDatosPromediosSensores = function (dataArray) {
        this.asignaDatos(dataArray, "#showPromedios");
    }
    asignaDatosVarianzasSensores = function (dataArray) {
        this.asignaDatos(dataArray, "#showVarianzas");
    }
    asignaDatosPromedioTotal = function (dataArray) {
        this.asignaDatos(dataArray, "#showPromedioTotal");
    }
    asignaDatosS2PE = function (dataArray) {
        this.asignaDatos(dataArray, "#showS2PE");
    }
    asignaDatosS2Factor = function (dataArray) {
        this.asignaDatos(dataArray, "#showS2factor");
    }
    asignaDatosF = function (dataArray) {
        this.asignaDatos(dataArray, "#showF");
    }

    /**
     * # Introduccion
     * ### Sólo se activará el proyecto en cuanto se conecte un arduino por primera vez
     * Se trata de una función que encapsula toda la interacción necesaria para mostrar la introducción a la app
     * ¿Qué es la introducción?
     * Para evitar que el usuario haga peticiones o interactue con elementos de la app sin que un arduino se encuentre conectado, se oscurecerá toda la pantalla y sólo se mostrará el menú correspondiente para conexión con arduino.
     * Además se tiene el detalle de mostrar una sección donde vienen los nombres de los creadores del proyecto
     */
    introduccion = function () {
        const fondo = document.getElementById("fondoIntroduccion");
        const estadoConexion = document.getElementsByClassName("subsection")[1];
        const botonContinuar = document.getElementsByClassName("contenedorIntroduccion")[0];
        fondo.insertBefore(estadoConexion, botonContinuar);
        const html = document.querySelectorAll("#fondoIntroduccion>section");
        const secciones = this.devolverArrayHTML(html);
        secciones[0].setAttribute("style", "display: none;");
        const boton = document.getElementsByClassName("botonIntroduccion")[0];
        boton.addEventListener("click", function(){
            if (secciones[0].getAttribute("style") === "display: none;") {
                secciones[0].setAttribute("style", "display: block;");
                secciones[1].setAttribute("style", "display: none;");
                this.innerHTML = "Regresar al proyecto";
            }
            else{
                secciones[1].setAttribute("style", "display: block;");
                secciones[0].setAttribute("style", "display: none;");
                this.innerHTML = "Creadores";
            }
            
        });
    }

    topBarFunctions = function () {
        const closeBtn = document.getElementById('closeBtn');
        const minimizeBtn = document.getElementById('minimizeBtn');

        closeBtn.addEventListener('click', ()=>{
            electronAPI.closeApp()
        })
        minimizeBtn.addEventListener('click', ()=>{
            electronAPI.minimizeApp()
        })
    }
}
