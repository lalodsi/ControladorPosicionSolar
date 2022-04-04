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

const sensores = document.getElementById('sensor1');
const grafica1 = new graficas("Sensores");


const trazo1 = {
    x: [],
    y: []
}
const trazo2 = {
    x: [],
    y: []
}
const trazo3 = {
    x: [],
    y: []
}
const trazo4 = {
    x: [],
    y: []
}
const trazo5 = {
    x: [],
    y: []
}

socket.on('data', data => {
    html.asignaDatos(data);
    limitarA25(trazo1, data[0])
    limitarA25(trazo2, data[1])
    limitarA25(trazo3, data[2])
    limitarA25(trazo4, data[3])
    limitarA25(trazo5, data[4])
    const datos = [
        trazo1,
        trazo2,
        trazo3,
        trazo4,
        trazo5
    ]
    grafica1.draw(sensores, datos);
});

function limitarA25(grafica, data) {
    grafica.y.push(data);
    
    if (grafica.y.length > 25) {
        grafica.y.shift();
    }
    if (grafica.x.length < 25) {
        grafica.x.push(grafica.y.length);
    }

}

html.activarForms();


