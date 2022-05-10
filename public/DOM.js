// Llamar DOM
class DOM{
    eventos = {
        enviarPalabra: "sendString",
        calibrarFecha: "setDate",
        calibrarPosicion: "setPosition",
        calibrarOrientacion: "setOrientation",
        controlarMotores: "setMotores",
        controlarAlgoritmo: "setAlgoritmo",
    }
    eventosSockets = {
        requestConnection: "connect-to-arduino",
        comenzarRecepcionDeDatos: "startSendingData"

    }
    
    /**
     * Inicializa todos los módulos 
     */
    constructor(socket){
        this.socket = socket;
        this.ocultarTodoExcepto(0, ".principal");
        this.ocultarTodoExcepto(0, ".Contenido_Estado");
        this.btnShowContent();
        this.interactuarInputConRuedaDelMouse();

        this.comenzarConexion = false;
        this.botonComenzarRecepcionDeDatos();
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
     */
    btnShowContent = function() {
        const botones = document.querySelectorAll(".boton");
        const arrBotones = this.devolverArrayHTML(botones);
        arrBotones.forEach( (elem, index) => {
            elem.addEventListener( "click", () => {
                this.ocultarTodoExcepto(index, ".principal", 
                ()=>{},
                ()=>{},
                ()=>{},
                this.activarCalibracion
                );
            } )
        } )
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
        const botonConectar = document.getElementById('botonConectar')
        const puerto = document.getElementsByClassName('port')[0].value
        const data = {
            connect: true,
            port: puerto
        }
        botonConectar.addEventListener('click', ()=>{
            this.socket.emit(this.eventosSockets.requestConnection, data);
            this.ocultarTodoExcepto(1, ".Contenido_Estado");
        })
        // Desconección
        const botonDesconectar = document.getElementById('botonDesconectar')
        botonDesconectar.addEventListener('click', ()=>{
            this.socket.emit(this.eventosSockets.requestConnection, {connect: false})
            this.ocultarTodoExcepto(0, ".Contenido_Estado");
        })
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
            console.log(texto.innerHTML);
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
    interactuarInputConRuedaDelMouse = function () {
        const entradasDocument = document.querySelectorAll('input[type="number" i]')
        const entradas = this.devolverArrayHTML(entradasDocument);
        entradas.forEach( (entrada) => {
            entrada.parentElement.addEventListener('wheel', ()=>{})
        })
    }

    /**
     * Activa o desactiva el botón para comenzar el envío de datos según el estado del arduino
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
    asignaDatos = function (dataArray) {
        const sensores = document.querySelectorAll("#showSensores");
        dataArray.forEach( (dato, index) => {
            sensores[index].innerHTML = dato;
        } )
    }
}