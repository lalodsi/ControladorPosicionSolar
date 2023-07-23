/**
 * # Ejecutar todos los metodos que evalúan a los formularios
 */
const activarForms = function () {
    formCalibrarRelojManual();
    formCalibrarRelojAuto();
    formCalibrarPosicionManual();
    // formCalibrarPosicionAuto();
    formCalibrarOrientacion();
    formCalibrarAngulosActuales();
    formElegirAlgoritmo();
};

/**
 * Programa un envío para la información de la fecha y hora ingresados hacia el arduino
 */
const formCalibrarRelojManual = function () {
    const boton = document.getElementById("setTimeManual");
    boton.addEventListener('click', () => {
        const fecha = document.getElementById("arduinoDate").value;
        const horaWithoutFormat = document.getElementById("arduinoTime").value;
        const horaSplitted = horaWithoutFormat.split(":");
        const horaJoined = horaSplitted.join("-")
        const hora = `${horaJoined}-00`;
        const objeto = {
            fecha: fecha,
            hora: hora
        };
        socket.emit(eventos.calibrarFecha, objeto);
        console.log("Mostrar datos desde ui");
        console.log(`Fecha: ${fecha}, Hora: ${hora}`);
    });
}
const formCalibrarRelojAuto = function () {
    const boton = document.getElementById("setTimeAuto");
    boton.addEventListener('click', () => {
        // const fecha = document.getElementById("arduinoDate").value;
        // const hora = document.getElementById("arduinoTime").value;
        const date = new Date();
        const [month, day, year] = [
            date.getMonth(),
            date.getDate(),
            date.getFullYear(),
        ];
        const [hour, minutes, seconds] = [
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
        ];
        const fecha = `${year}-${month + 1}-${day}`
        const hora = `${hour}-${minutes}-${seconds}`
        const objeto = {
            fecha: fecha,
            hora: hora
        };
        socket.emit(eventos.calibrarFecha, objeto);
        console.log("Mostrar datos desde ui");
        console.log(`Fecha: ${fecha}, Hora: ${hora}`);
    });
}

/**
 * Programa un envío de la información ingresada de latitud y longitud hacia el arduino
 */
const formCalibrarPosicionManual = function () {
    const button = document.getElementById("setLocationManual");
    button.addEventListener('click', () => {
        const latitud = document.getElementById("latitud").value;
        const longitud = document.getElementById("longitud").value;
        const dato = {
            latitud,
            longitud
        };
        console.log(dato);

        socket.emit(eventos.calibrarPosicion, dato);
    })
}
const formCalibrarPosicionAuto = function () {
    const button = document.getElementById("setLocationAuto");
    button.addEventListener('click', () => {
        let latitud = 0;
        let longitud = 0;
        navigator.geolocation.getCurrentPosition((position) => {
            const coordenadas = position.coords;
            latitud = coordenadas.latitude;
            longitud = coordenadas.longitude;
        }, (error) => {
            console.log(error.message);
        })
        const dato = {
            latitud,
            longitud
        };
        console.log(dato);

        socket.emit(eventos.calibrarPosicion, dato);
    })
}
const formCalibrarAngulosActuales = function () {
    const button = document.getElementById("setCurrentPosition");
    button.addEventListener('click', () => {
        const azimut = document.getElementById("currentAzimut").value;
        const elevacion = document.getElementById("currentElevacion").value;
        const dato = {
            azimut,
            elevacion
        };
        console.log(dato);

        socket.emit(eventos.calibrarAngulosActuales, dato);
    })
}

/**
 * Programa un envío de la información de la orientación hacia el arduino
 */
const formCalibrarOrientacion = function () {
    const button = document.getElementById("setOrientation");

    button.addEventListener('click', () => {
        const orientacion = document.getElementById("orientation").value;
        const data = {
            orientacion: orientacion
        };
        console.log(data);
        socket.emit(eventos.calibrarOrientacion, data);
    })
}

const formElegirAlgoritmo = function () {
    const SPA = document.getElementById('SPAbutton');
    const SPL = document.getElementById('SPLbutton');
    const Mixed = document.getElementById('Mixedbutton');
    const Fixed = document.getElementById('Fixedbutton');

    function activateAlgorithm(word) {
        socket.emit(eventos.controlarAlgoritmo, {algorithm: word})
    }
    SPA.addEventListener('click', () => activateAlgorithm('SPA'))
    SPL.addEventListener('click', () => activateAlgorithm('SPL'))
    Mixed.addEventListener('click', () => activateAlgorithm('mixed'))
    Fixed.addEventListener('click', () => activateAlgorithm('fijo'))
}