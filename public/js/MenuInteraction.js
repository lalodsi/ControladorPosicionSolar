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

const activarModoMonitoreo = function () {
    socket.emit(
        eventos.enviarPalabra,
        {
            word: "monitorear",
            message: "Se envio la palabra monitorear"
        }
    );
}

const getInformacionMonitoreoSection = function () {
    // request(0);
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
    
    arrBotones[0].addEventListener('click', activarModoMonitoreo);
    arrBotones[1].addEventListener('click', getControlManualSection);
    arrBotones[2].addEventListener('click', getPanelDeControlSection);
};
