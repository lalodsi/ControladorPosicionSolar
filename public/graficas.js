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

    constructor(title){
        this.layout2D.title = title;
        // this.title = type;
    }

    draw = function (id, data) {
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
    
    /**
     * 
     * @param {html element} id objeto html con el div que contiene a la grafica
     * @param {*} data 
     */
    draw3d = function (id, data) {
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