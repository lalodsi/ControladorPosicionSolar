/**
 * # Ejecutar todos los metodos que evalúan a los formularios
 */
const activarForms = function () {
    formCalibrarReloj();
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
const setForm = function (id, callback) {
    const formulario = document.getElementById(id);
    formulario.addEventListener('submit', function(event) {
        event.preventDefault();
        callback(this)
    })
}

/**
 * Programa un envío para la información de la fecha y hora ingresados hacia el arduino
 */
const formCalibrarReloj = function () {
    setForm('formSetTime', (form) => {
        const fecha = form.children[1].value;
        const hora = form.children[2].value;

        const objeto = {
            fecha: fecha,
            hora: hora
        };
        socket.emit(eventos.calibrarFecha, objeto);
    })
}

/**
 * Programa un envío de la información ingresada de latitud y longitud hacia el arduino
 */
const formCalibrarPosicion = function () {
    setForm("formSetPosition", (form)=> {
        // TypeError: Cannot read properties of undefined (reading 'value')
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
    setForm("formSetOrientation", (form) => {
        const orientacion = form.children[2].children[1].value;
        console.log(orientacion);

        const data = {
            orientacion: orientacion
        };
        socket.emit(eventos.calibrarOrientacion, data);
    })
}