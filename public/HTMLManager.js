class HTMLManager{
    /**
     * Inicializa el documento
     */
    init = function() {
        this.ocultarTodoExcepto(0, ".principal");
        this.ocultarTodoExcepto(0, ".Contenido_Estado");
        this.btnShowContent();
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
     */
    ocultarTodoExcepto = function(index, className){
        const forms = document.querySelectorAll(className);
        const arrayForms = this.devolverArrayHTML(forms);
        // arrayForms.shift();
        arrayForms.forEach( (elem, ArrIndex) => {
            elem.setAttribute( "style", "display: none" )
            if (index == ArrIndex) {
                elem.setAttribute( "style", "display: block" )
            }
        } )
    }

    /**
     * Agrega funcionalidad a los botones de la sección 
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
     * Prepara una conexión con el puerto serial
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
}

// module.exports = HTMLManager