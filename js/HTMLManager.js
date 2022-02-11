class HTMLManager{
    /**
     * Inicializa el documento
     */
    init = function() {
        this.ocultarMenu(0);
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
     * OcultarMenu
     * Oculta todos los campos de contenido menos el indicado en la sección de contenido
     * @param {int} index Formulario que no se estará ocultando
     */
    ocultarMenu = function(index){
        const forms = document.querySelectorAll(".principal");
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
                this.ocultarMenu(index);
            } )
        } )
    }
}