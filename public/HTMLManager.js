class HTMLManager{
    eventos = {
        calibrarFecha: "setDate",
        calibrarPosicion: "setPosition",
        calibrarOrientacion: "",
        controlarMotores: "",
        controlarAlgoritmo: "",
    }
    
    defineSocket = function (socket) {
        this.socket = socket;
    }
    
    /**
     * Inicializa el documento
     */
    init = function() {
        this.ocultarTodoExcepto(0, ".principal");
        this.ocultarTodoExcepto(0, ".Contenido_Estado");
        this.btnShowContent();
        this.interactuarInput();
    }



    /**
     * Convierte una colección HTML a Array para poder utilizar las funciones internas de los arrays
     * 
     * @param {HTMLCollection} document
     * @returns array of HTML
     */
    devolverArrayHTML = function(document){
        return [].concat(...document)
    }

    /**
     * OcultarTodoExcepto
     * Oculta todos los campos de contenido menos el indicado en la sección de contenido
     * @param {int} index Formulario que no se estará ocultando
     * @param {string} className nombre de la clase para los elementos que serán ocultados
     */
    ocultarTodoExcepto = function(index, className){
        const forms = document.querySelectorAll(className);
        const arrayForms = this.devolverArrayHTML(forms);
        arrayForms.forEach( (elem, ArrIndex) => {
            elem.setAttribute( "style", "display: none" )
            if (index == ArrIndex) {
                elem.setAttribute( "style", "display: block" )
            }
        } )
    }

    /**
     * Agrega funcionalidad a los botones para mostrar diferente contenido
     */
    btnShowContent = function() {
        const botones = document.querySelectorAll(".boton");
        const arrBotones = this.devolverArrayHTML(botones);
        arrBotones.forEach( (elem, index) => {
            elem.addEventListener( "click", () => {
                this.ocultarTodoExcepto(index, ".principal");
            } )
        } )
    }

    /**
     * Establece el proceso de conexión y desconexión del servidor con arduino enviando las solicitudes
     * por websockets y mostrando los menus correspondientes según el estado de la conexión
     * @param {socket} socket websocket al cual comunicar la solicitud de conexión con arduino
     */
    onPressArduino = function ( socket ) {
        const botonConectar = document.getElementById('botonConectar')
        const puerto = document.getElementsByClassName('port')[0].value
        const data = {
            connect: true,
            port: puerto
        }
        botonConectar.addEventListener('click', ()=>{
            socket.emit("connect-to-arduino", data);
            this.ocultarTodoExcepto(1, ".Contenido_Estado");
        })
        // Desconección
        const botonDesconectar = document.getElementById('botonDesconectar')
        botonDesconectar.addEventListener('click', ()=>{
            socket.emit('connect-to-arduino', {connect: false})
            this.ocultarTodoExcepto(0, ".Contenido_Estado");
        })
    }

    /**
     * Ejecutar todos los metodos que evaluan formularios
     */
    forms = function (socket) {
        this.formCalibrarReloj();
        this.formCalibrarPosicion();
    }
    
    /**
     * Escucha el evento "submit" de todos los forms, evita la recarga y ejecuta
     * la función de callback.
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

    formCalibrarReloj = function () {
        this.setForm('formSetTime', (form) => {
            console.log(form);
            const fecha = form.children[1].value;
            const hora = form.children[2].value;

            const objeto = {
                fecha: fecha,
                hora: hora
            };
            socket.emit(this.eventos.calibrarFecha, objeto);
        })
    }

    formCalibrarPosicion = function () {
        this.setForm("formSetPosition", (form)=> {
            const latitud = form.children[1].children[1].value;
            const longitud = form.children[1].children[3].value;
            
            const dato = {
                latitud: latitud,
                longitud: longitud
            };
            console.log(socket);
            socket.on(this.eventos.calibrarPosicion, dato);
        })
    }

    interactuarInput = function () {
        const entradasDocument = document.querySelectorAll('input[type="number" i]')
        const entradas = this.devolverArrayHTML(entradasDocument);
        entradas.forEach( (entrada) => {
            entrada.parentElement.addEventListener('wheel', ()=>{})
        })
    }
}