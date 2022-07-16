    /**
     * # ActivarCalibración
     * Función que envía un socket al servidor para enviar el dato de calibración al arduino
     */
     activarCalibracion = () => {
        console.log("Se ha activado la calibración desde el Front");
        socket.emit(eventos.enviarPalabra, 
            {word: "calibrar", message: "Se envió la palabra 'calibrar' al arduino"}
            );
    }

    enviarPalabraVerificacion = function () {
        socket.emit(eventosSockets.testearSoftware,
            {testing: true}
            );
    }
    
    enviarPalabraVerificacion = function () {
        socket.emit(eventosSockets.testearSoftware,
            {testing: true}
            );
    }