class graficas{
    layout2D = {
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
    layout3D = {
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
    isPlotted = false;
    trazo1 = {
        x: [],
        y: []
    }
    trazo2 = {
        x: [],
        y: []
    }
    trazo3 = {
        x: [],
        y: []
    }
    trazo4 = {
        x: [],
        y: []
    }
    trazo5 = {
        x: [],
        y: []
    }
    homeTrace = {
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

    constructor(title){
        this.layout2D.title = title;
        // this.title = type;
    }

    draw = function (id, datos) {
        const data = this.sortData(datos);
        if (document.getElementById(id)) {
            if (!this.isPlotted) {
                
                Plotly.newPlot( id, data, this.layout2D , {staticPlot: true});
                this.isPlotted = true;
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
            this.isPlotted = false;
        }
    }
    
    /**
     * 
     * @param {html element} id objeto html con el div que contiene a la grafica
     * @param {*} data 
     */
    draw3d = function (id, datos) {
        const data = this.modificaLimites(datos);
        if (document.getElementById(id)) {
            if (!this.isPlotted) {
                Plotly.newPlot( id, data, this.layout3D);
                this.isPlotted = true;
            }
            else{
                // Plotly.animate( id, data );
                // Plotly.react( id, data);
                Plotly.react( id, data);
            }
        }
    }

    reset = function () {
        this.isPlotted = false;
    }

    sortData = function (data) {

        this.limitarCantidadDatosRecibidos(this.trazo1, data[0])
        this.limitarCantidadDatosRecibidos(this.trazo2, data[1])
        this.limitarCantidadDatosRecibidos(this.trazo3, data[2])
        this.limitarCantidadDatosRecibidos(this.trazo4, data[3])
        this.limitarCantidadDatosRecibidos(this.trazo5, data[4])

        const datos = [
            this.trazo1,
            this.trazo2,
            this.trazo3,
            this.trazo4,
            this.trazo5
        ];

        return datos;
    }

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

    modificaLimites = function (data) {
        this.dirX = data[0];
        this.dirY = data[1];
        this.dirZ = data[2];
        this.homeTrace.x[1] = (this.dirX - 512) / 512;
        this.homeTrace.y[1] = (this.dirY - 512) / 512;
        this.homeTrace.z[1] = (this.dirZ - 512) / 512;
        return [this.homeTrace];
    }

}