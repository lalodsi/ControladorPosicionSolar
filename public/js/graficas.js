const layout2D = {
    title: 'Datos',
    yaxis: {
        title: 'Valor',
    },
    margin: { t: 35 },
    paper_bgcolor: "#00000000",
    plot_bgcolor: "#00000000",
    'xaxis.range': [0, 25],   
            'yaxis.range': [0, 1024],
    font: {
        color: "#1fffbc"
    },
    showlegend: false
};
const layout3D = {
    scene1: {
        annotations: {
            text: 'Hola',
            ax: 0,
            ay: 0
        },
        // paper_bgcolor: "#00000000",
        // plot_bgcolor: "#00000000",
        xaxis: {
            range: [-1, 1]
        },
        yaxis: {
            range: [-1, 1]
        },
        zaxis: {
            range: [-1, 1]
        },
    },
    // height: 600,
    margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 0
    },
};
let isPlotted = false;
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
    type: 'scatter3d',
    scene: 'scene1'
};
let cantidadMediciones = 0;
const conjuntoDeDatos = [
    [],
    [],
    [],
    [],
    [],
];

// constructor(title){
//     layout2D.title = title;
// }

const draw2DPlot = function (id, datos) {
    const data = sortData(datos);
    if (document.getElementById(id)) {
        if (!isPlotted) {
            
            Plotly.newPlot( id, data, layout2D , {staticPlot: true});
            isPlotted = true;
        }
        else{
            data.forEach(element => {
                element['xaxis.range'] = [0, 25]
                element['yaxis.range'] = [0, 1024]
            });
            Plotly.relayout( id, data[0]);
        }
    }
    else{
        isPlotted = false;
    }
}
    
    /**
     * 
     * @param {html element} id objeto html con el div que contiene a la grafica
     * @param {*} data 
     */
const draw3DPlot = function (id, datos) {
    const data = modificaLimites(datos);
    if (document.getElementById(id)) {
        if (!isPlotted) {
            Plotly.newPlot( id, data, layout3D);
            isPlotted = true;
        }
        else{
            // Plotly.animate( id, data );
            // Plotly.react( id, data);
            Plotly.react( id, data);
        }
    }
}

    // Dont using
    // reset = function () {
    //     isPlotted = false;
    // }

const sortData = function (data) {

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
    ];

    return datos;
}

const limitarCantidadDatosRecibidos = function(grafica, data) {
    const CANTIDAD_DE_ELEMENTOS_MAXIMA = 25;
    grafica.y.push(data);
    
    if (grafica.y.length > CANTIDAD_DE_ELEMENTOS_MAXIMA) {
        grafica.y.shift();
    }
    if (grafica.x.length < CANTIDAD_DE_ELEMENTOS_MAXIMA) {
        grafica.x.push(grafica.y.length);
    }
}

const modificaLimites = function (data) {
    dirX = data[0];
    dirY = data[1];
    dirZ = data[2];
    homeTrace.x[1] = (dirX - 512) / 512;
    homeTrace.y[1] = (dirY - 512) / 512;
    homeTrace.z[1] = (dirZ - 512) / 512;
    return [homeTrace];
}

const analisisANOVA = function (data) {
    function promedio(conjunto) {
        const suma = conjunto.reduce( (acc, curr) => acc + curr );
        return suma / conjunto.length;
    }
    const CANTIDAD_MAXIMA_DE_MEDICIONES = 10;
    cantidadMediciones++;

    // Teniendo la cantidad de muestras adecuadas se hace el procedimiento
    if (cantidadMediciones > CANTIDAD_MAXIMA_DE_MEDICIONES) {
        cantidadMediciones = 1;

        //Datos principales
        const n = conjuntoDeDatos[0].length;
        const gradosDeLibertad = n - 1;
        // Promedio de los datos de cada grupo de mediciones
        const promedios = conjuntoDeDatos.map( promedio );
        // Varianza de cada grupo
        const varianzas = promedios.map( (promX, index) => {
            const diferenciaAlCuadrado = conjuntoDeDatos[index].reduce( (acc, curr) => acc += Math.pow(curr - promX,2), 0);
            return (diferenciaAlCuadrado / gradosDeLibertad);
        } );
        // Promedio de los promedios de los sensores
        const promedioTotal = promedio(promedios);
        // Cálculo de S2PE
        const diferenciaAlCuadrado = promedios.reduce( (acc, curr) => acc += Math.pow(curr - promedioTotal, 2), 0 );
        const S2PE = promedio(varianzas);
        const S2Factor = diferenciaAlCuadrado * n / (gradosDeLibertad);
        const F = S2Factor / S2PE;

        //Enviar la informacion al DOM
        asignaDatosPromediosSensores(promedios);
        asignaDatosVarianzasSensores(varianzas);
        asignaDatosPromedioTotal(promedioTotal);
        asignaDatosS2PE(S2PE);
        asignaDatosS2Factor(S2Factor);
        asignaDatosF(F);

        // Borrar
        conjuntoDeDatos.forEach( data => data = [] );
        conjuntoDeDatos[0] = [];
        conjuntoDeDatos[1] = [];
        conjuntoDeDatos[2] = [];
        conjuntoDeDatos[3] = [];
        conjuntoDeDatos[4] = [];
    }
    else{
        if (conjuntoDeDatos[0].length > CANTIDAD_MAXIMA_DE_MEDICIONES) {
            conjuntoDeDatos.forEach( datos => datos.shift() );
        }
        if (conjuntoDeDatos[0].length < CANTIDAD_MAXIMA_DE_MEDICIONES){
            conjuntoDeDatos.forEach( (datos, i) => datos.push(data[i]) );
        }
    }
}
    
