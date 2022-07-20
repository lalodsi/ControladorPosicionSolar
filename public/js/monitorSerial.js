const monitorSerialHandleClick = (event)=>{
    if (event) {
        if (event.keyCode != 13) return;
    }
    const texto = document.getElementById("monitorSerialEnviarTexto").value;
    const serialContenedor = document.getElementById('contenedorSerial');
    const textoHTML = document.createElement('p');
    textoHTML.innerHTML = `> ${texto}`;
    serialContenedor.appendChild(textoHTML);
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
    boton.addEventListener('click', monitorSerialHandleClick);
}


const cerrarMonitorSerial = function () {
    socket.emit("monitorSerial", {connected: false})
    const contenedorSerial = document.getElementsByClassName("monitorSerial")[0];
    contenedorSerial.className = "monitorSerial abajo"
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