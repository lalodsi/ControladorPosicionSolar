const getInformacionMonitoreoSection = function () {
    // request(0);
    socket.emit(
        eventos.enviarPalabra,
        {
            word: "salir",
            message: "Se envio la palabra salir"
        }
    );
    copiarAlPortapapeles();
    blockAll();
};

const getGraficasSection = function () {
    // request(1);
    blockAll();
};

const getControlManualSection = function () {
    // request(2);
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
    blockAll();
}

const getPanelDeControlSection = function () {
    // request(3);
    activarCalibracion();
    activarForms();
    interactuarInputConRuedaDelMouse();
    blockAll();
}

/**
 * Bloquea el contenido
 */
const blockAll = function () {
    const botones = document.querySelectorAll(".boton");
    const arrBotones = devolverArrayHTML(botones);
    const contenedor = document.getElementsByClassName("principal")[0];
    // contenedor.className = "section principal bloqueado";
    arrBotones.map( (boton, index) => {
        boton.className = "boton botonDesactivado";
    });

    switch (actualState) {
        case 'monitorear':
            arrBotones[2].removeEventListener('click', getControlManualSection);
            arrBotones[3].removeEventListener('click', getPanelDeControlSection);
            break;

        case 'calibrar':
            arrBotones[0].removeEventListener('click', getInformacionMonitoreoSection);
            arrBotones[1].removeEventListener('click', getGraficasSection);
            arrBotones[2].removeEventListener('click', getControlManualSection);
            arrBotones[3].removeEventListener('click', getPanelDeControlSection);
            break;
    
        case 'controlar':
            arrBotones[0].removeEventListener('click', getInformacionMonitoreoSection);
            arrBotones[1].removeEventListener('click', getGraficasSection);
            arrBotones[2].removeEventListener('click', getControlManualSection);
            arrBotones[3].removeEventListener('click', getPanelDeControlSection);
            break;
    
        default:
            break;
    }

    contenedor.innerHTML = "";
    contenedor.className = "section principal centrado";
    contenedor.append(getLoadingElement());
}
/**
 * Agrega funcionalidad a los botones para mostrar las diferentes vistas de la sección para información principal
 * Los botones realizarán una consulta GET a través de la ruta 'api/v1/menu/contenido/:id' para recibir el menu correspondiente y añadirlo a la aplicación
 */
const btnShowContent = function() {
    const botones = document.querySelectorAll(".boton");
    const arrBotones = devolverArrayHTML(botones);
    
    arrBotones[0].addEventListener('click', getInformacionMonitoreoSection);
    arrBotones[1].addEventListener('click', getGraficasSection);
    arrBotones[2].addEventListener('click', getControlManualSection);
    arrBotones[3].addEventListener('click', getPanelDeControlSection);
};
