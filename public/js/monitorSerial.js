const monitorSerialHandleClick = (event)=>{
    if (event) {
        if (event.keyCode != 13) return;
    }
    enviarTextoMonitorSerial();
}

const enviarTextoMonitorSerial = function () {
    const texto = document.getElementById("monitorSerialEnviarTexto").value;
    const serialContenedor = document.getElementById('contenedorSerial');
    const textoHTML = document.createElement('p');
    textoHTML.innerHTML = `> ${texto}`;
    serialContenedor.appendChild(textoHTML);
    // Hacer scroll
    const contenedor = document.getElementById("contenedorSerial");
    contenedor.scrollTop += 53;
    // Avisar de la interaccion
    socket.emit(
        eventos.enviarPalabra,
        {
            word: texto,
            message: "Interactuando con el monitor serie"
        }
    )
}

const botonEnviarMonitorSerial = function () {
    const boton = document.getElementById('monitorSerialEnviar');
    boton.addEventListener('click', enviarTextoMonitorSerial);
}

const cerrarMonitorSerial = function () {
    if (actualState == "home") {
        socket.emit("monitorSerial", {connected: false})
        const contenedorSerial = document.getElementsByClassName("monitorSerial")[0];
        contenedorSerial.className = "monitorSerial abajo";
    }
    else{
        makeAviso(
            `Tienes que regresar al menu principal, estás en ${actualState}`,
            'warning'
        );
    }
}
const abrirMonitorSerial = function () {
    socket.emit("monitorSerial", {connected: true})
    const contenedorSerial = document.getElementsByClassName("monitorSerial")[0];
    contenedorSerial.className = "monitorSerial"
}
const botonCerrarMonitorSerial = function () {
    const boton = document.getElementById("closeSerialBtn");
    boton.addEventListener("click", ()=>{
        cerrarMonitorSerial();
    });
}

const escribirMonitorSerialTexto = function (data){
    const contenedor = document.getElementById("contenedorSerial");
    const dato = document.createElement('p');
    dato.innerText = data;
    contenedor.appendChild(dato);
    if (contenedor.scrollTop > contenedor.scrollHeight - 600) {
        contenedor.scrollTop += 53;
    }
}