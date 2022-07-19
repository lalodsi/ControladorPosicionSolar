/**
     * # Devolver un Array de objetos HTML
     * Convierte una colección HTML a Array para poder utilizar las funciones internas de los arrays
     * 
     * @param {HTMLCollection} document
     * @returns array of HTML
     */
const devolverArrayHTML = function(document){
    return [].concat(...document);
};

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
const ocultarTodoExcepto = function(index, className, ...callbacks){
    const forms = document.querySelectorAll(className);
    const arrayForms = devolverArrayHTML(forms);
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
    })
};

/**
 * Crear un elemento HTML del tipo
 * <div class="lds-ripple">
 *   <div></div>
 *   <div></div>
 * </div>
 */
 const getLoadingElement = function () {
    // Creando animacion de carga
    const loadingElement = document.createElement("div");
    loadingElement.appendChild(document.createElement("div"));
    loadingElement.appendChild(document.createElement("div"));
    loadingElement.className = "lds-ripple";
    return loadingElement;
}

const requestMenu = async function (index) {
    const url = `http://localhost:3000/api/v1/menu/contenido/${index}`;
    const response = await fetch(url);
    return await response.text();
};