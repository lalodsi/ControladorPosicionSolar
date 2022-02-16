SerialPort = require('serialport');

class ArduinoSerial{
    // Readline = SerialPort.parsers.Readline;
    // inicializado = false
    
    constructor() {    
        this.inicializado = false
    }

    toString = function () {
        console.log('Prueba Funcionando');
    }

    init = function () {
        this.mySerial = new SerialPort("COM3" ,{
            baudRate: 9600
        }, function (err) {
            if (err) {
                console.log('Hubo un Error: ', err);
            } else {
                console.log('conectado exitosamente');
            }
        });
        this.inicializado = true
    }

    openPort = function () {
        if (this.inicializado) {
            this.mySerial.on('open', function(){
                console.log('El Puerto ha sido Abierto');
            })
        } else {
            console.log('Error, tienes que inicializar el Puerto');
        }
    }

    receiveData = function (callback) {
        this.mySerial.on('data', function(data){
            // console.log(data.toString());
            callback(data.toString)
        })
    }
}



module.exports = ArduinoSerial