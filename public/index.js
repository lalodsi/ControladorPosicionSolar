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


    const layout = {
        title: 'Datos',
        xaxis: {
          title: 'Numero',
        },
        yaxis: {
          title: 'Valor',
        },
        margin: { t: 0 },
        
      };
    
    Plotly.newPlot( sensor1, [{
        x: B,
        y: A[0],
    }], layout );

    var update = {
        'xaxis.range': [0, 25],   // updates the xaxis range
        'yaxis.range': [0, 1024]     // updates the end of the yaxis range
    };
    Plotly.relayout( sensor1, update)
});


html.activarForms();


