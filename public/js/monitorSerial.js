const botonEnviarMonitorSerial = function () {
    const boton = document.getElementById('monitorSerialEnviar');
    boton.addEventListener('click', ()=>{
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
    })
}