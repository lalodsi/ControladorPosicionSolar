const socket = io();
const dom = new DOM(socket);


dom.botonConectarConArduino();

dom.activarBotonComenzar("desactivado")
// Conexión entre servidor y cliente
socket.on('connect', ()=>{
    console.log(socket.id);
})
// Conexión entre servidor y arduino
socket.on('arduinoConnectionState', data => {
    dom.activarBotonComenzar( data.isConnected? "start" : "desactivado" )
    if (data.isConnected) {
        dom.ocultarTodoExcepto(2, ".Contenido_Estado");
    } else {
        dom.ocultarTodoExcepto(0, ".Contenido_Estado");
    }
})





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
const homeTrace = {
    x: [0, 1],
    y: [0, 1],
    z: [0, 1],
	// marker: {
	// 	size: 8,
	// 	line: {
	// 	    color: 'rgba(217, 217, 217, 0.14)',
	// 	    width: 0.5
    //     },
	// 	opacity: 0.8
    // },
    // line: {
    //     width: 10,
    //     color: [2],
    //     colorscale: "Viridis"
    // },
    type: 'scatter3d',
    scene: 'scene1',
    // xaxis: {
    //     range: [-1, 1]
    // },
    // yaxis: {
    //     range: [-1, 1]
    // },
    // zaxis: {
    //     range: [-1, 1]
    // },
};



let dirX, dirY, dirZ;
    const graficaSensores = new graficas("Sensores");
    const representacion3D = new graficas("robot3d");

socket.on('data', data => {
    limitarCantidadDatosRecibidos = function(grafica, data) {
        const CANTIDAD_DE_ELEMENTOS_MAXIMA = 25;
        grafica.y.push(data);
        
        if (grafica.y.length > CANTIDAD_DE_ELEMENTOS_MAXIMA) {
            grafica.y.shift();
        }
        if (grafica.x.length < CANTIDAD_DE_ELEMENTOS_MAXIMA) {
            grafica.x.push(grafica.y.length);
        }
    }

    
    dom.asignaDatos(data);
    limitarCantidadDatosRecibidos(trazo1, data[0])
    limitarCantidadDatosRecibidos(trazo2, data[1])
    limitarCantidadDatosRecibidos(trazo3, data[2])
    limitarCantidadDatosRecibidos(trazo4, data[3])
    limitarCantidadDatosRecibidos(trazo5, data[4])
    const datos = [
        trazo1,
        trazo2,
        trazo3,
        trazo4,
        trazo5
    ]
    dirX = data[0];
    dirY = data[1];
    dirZ = data[2];
    homeTrace.x[1] = (dirX - 512) / 512;
    homeTrace.y[1] = (dirY - 512) / 512;
    homeTrace.z[1] = (dirZ - 512) / 512;
    
    

    graficaSensores.draw("sensores", datos);
    representacion3D.draw3d("robot3d", [homeTrace]);
    
});


