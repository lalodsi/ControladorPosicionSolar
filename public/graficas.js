class graficas{
    layout = {
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
    isPlotted = false;

    constructor(title){
        this.layout.title = title;
    }

    draw = function (id, arrayX, arrayY) {
        if (!this.isPlotted) {
            Plotly.newPlot( id, [{
                x: arrayX,
                y: arrayY,
            }], this.layout , {staticPlot: true});
            this.isPlotted = true;
        }
        else{
            const data = {
                x: arrayX,
                y: arrayY,
                'xaxis.range': [0, 25],   
                'yaxis.range': [0, 1024],
            };
            Plotly.relayout( id, data);
        }
    }

}