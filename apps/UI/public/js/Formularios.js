/**
 * # Ejecutar todos los metodos que evalúan a los formularios
 */
const activarForms = function () {
    formCalibrarRelojManual();
    formCalibrarRelojAuto();
    formCalibrarPosicion();
    formCalibrarOrientacion();
};
    
/**
 * # setForm
 * Escucha el evento "submit" de todos los forms, evita la recarga y ejecuta
 * la función de callback.
 * Esta función es base para las funciones siguientes:
 * - formCalibrarReloj
 * - formCalibrarPosicion
 * - formCalibrarOrientacion
 * @param {string} id del formulario a evaluar
 * @param {function} callback accion a realizar al ocurrir el evento submit
 */

/**
 * Programa un envío para la información de la fecha y hora ingresados hacia el arduino
 */
const formCalibrarRelojManual = function () {
    const boton = document.getElementById("setTimeManual");
    boton.addEventListener('click', () => {
        const fecha = document.getElementById("arduinoDate").value;
        const hora = document.getElementById("arduinoTime").value;
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
        const fecha = `${year}-${month + 1}-${day + 1}`
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
const formCalibrarPosicion = function () {
    const formulario = document.getElementById("");
    setForm("formSetPosition", (form)=> {
        // TypeError: Cannot read properties of undefined (reading 'value')
        console.log(form);
        const latitud = form.children[2].children[1].value;
        const longitud = form.children[2].children[3].value;
        
        const dato = {
            latitud: latitud,
            longitud: longitud
        };
        socket.emit(eventos.calibrarPosicion, dato);
    })
}

/**
 * Programa un envío de la información de la orientación hacia el arduino
 */
const formCalibrarOrientacion = function () {
    const formulario = document.getElementById("");
    setForm("formSetOrientation", (form) => {
        const orientacion = form.children[2].children[1].value;
        console.log(orientacion);

        const data = {
            orientacion: orientacion
        };
        socket.emit(eventos.calibrarOrientacion, data);
    })
}