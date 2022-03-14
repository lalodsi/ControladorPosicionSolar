const socket = io();
const html = new HTMLManager(socket);


html.botonConectarConArduino();

html.activarBotonComenzar(false)
socket.on('connect', ()=>{
    console.log(socket.id);
})

socket.on('arduinoConnectionState', data => {
    html.activarBotonComenzar(data.isConnected)
    if (data.isConnected) {
        html.ocultarTodoExcepto(2, ".Contenido_Estado");
    } else {
        html.ocultarTodoExcepto(0, ".Contenido_Estado");
    }
})

const sensor1 = document.getElementById('sensor1');
const grafica1 = new graficas("Sensor 1");

const A = [[],[],[],[],[]];
const B = [];
socket.on('data', data => {
    html.asignaDatos(data);
    data.forEach( (one, index) => {
        A[index].push(one);
        if (A[0].length > 25) {
            A[index].shift();
        }
    } )

    if (B.length < 25) {
        B.push(A[0].length);
        // B.shift();
    }

    grafica1.draw(sensor1, B, A[0]);
});


html.activarForms();


