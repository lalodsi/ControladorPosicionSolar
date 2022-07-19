const botonEnviarMonitorSerial = function () {
    const boton = document.getElementById('monitorSerialEnviar');
    boton.addEventListener('click', ()=>{
        const texto = document.getElementById("monitorSerialEnviarTexto").value;
        socket.emit(
            eventos.enviarPalabra,
            {
                word: texto,
                message: "Interactuando con el monitor serie"
            }
        )
    })
}