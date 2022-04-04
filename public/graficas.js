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

    draw = function (id, data) {
        if (!this.isPlotted) {
            Plotly.newPlot( id, data, this.layout , {staticPlot: true});
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

}