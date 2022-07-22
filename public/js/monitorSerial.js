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

const getAviso = (menu) => {
    const aviso = document.createElement("div");
    aviso.className = "warning arriba";
    aviso.innerHTML = `Tienes que regresar al menu principal, estás en ${menu}`;
    setTimeout(()=>aviso.className = "warning posicionado", 0);
    setTimeout(()=>aviso.className = "warning bye", 3000);
    setTimeout(()=>aviso.remove(), 3500);
    return aviso;
}

const cerrarMonitorSerial = function () {
    if (actualState == "home") {
        socket.emit("monitorSerial", {connected: false})
        const contenedorSerial = document.getElementsByClassName("monitorSerial")[0];
        contenedorSerial.className = "monitorSerial abajo";
    }
    else{
        const cuerpo = document.getElementsByTagName("body")[0];
        cuerpo.append(getAviso(actualState));
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