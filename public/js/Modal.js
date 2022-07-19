/**
     * # Desvanecer Fondo
     * Desvanece el fondo negro de la 'introducción' y posiciona la sección de estado en su lugar original de modo que el proyecto se pueda utilizar de manera normal
     * Función que se ejecuta sólo cuando el servidor haya comunicado una conexión exitosa con el arduino
     */
const desvanecerFondo = function () {
    const fondo = document.getElementById("fondoIntroduccion");
    fondo.className = "desvanecido";
    setTimeout( ()=>{
        fondo.className = "desvanecido desaparecido";
    }, 500 );
}

const reaparecerFondo = function () {
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
};

    /**
     * # Introduccion
     * ### Sólo se activará el proyecto en cuanto se conecte un arduino por primera vez
     * Se trata de una función que encapsula toda la interacción necesaria para mostrar la introducción a la app
     * ¿Qué es la introducción?
     * Para evitar que el usuario haga peticiones o interactue con elementos de la app sin que un arduino se encuentre conectado, se oscurecerá toda la pantalla y sólo se mostrará el menú correspondiente para conexión con arduino.
     * Además se tiene el detalle de mostrar una sección donde vienen los nombres de los creadores del proyecto
     */
const introduccion = async function () {
    const fondo = document.getElementById("fondoIntroduccion");
    const estadoConexion = await getMenuConexion();
    const botonContinuar = document.getElementsByClassName("contenedorIntroduccion")[0];
    fondo.insertAdjacentHTML('afterBegin', estadoConexion);
    activarMenuConexion();
    //Interaccion en el Modal
    const html = document.querySelectorAll("#fondoIntroduccion>section");
    const [sectionConexion, sectionCreditos] = devolverArrayHTML(html);
    sectionCreditos.setAttribute("style", "display: none;");
    const boton = document.getElementsByClassName("botonIntroduccion")[0];
    boton.addEventListener("click", function(){
        if (sectionConexion.getAttribute("style") === "display: none;") {
            sectionConexion.setAttribute("style", "display: block;");
            sectionCreditos.setAttribute("style", "display: none;");
            this.innerHTML = "Creadores";
        }
        else{
            sectionCreditos.setAttribute("style", "display: block;");
            sectionConexion.setAttribute("style", "display: none;");
            this.innerHTML = "Regresar al proyecto";
        }
        
    });
}

const eliminarMenuVerificacion = function () {
    const estadoVerificacion = document.getElementById("estadoVerificacion")
    const fondo = document.getElementById("fondoIntroduccion");
    if (estadoVerificacion) {
        fondo.removeChild(estadoVerificacion);
    }
};