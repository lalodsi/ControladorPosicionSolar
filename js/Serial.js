import { SerialPort } from 'serialport';
export class ArduinoSerial{
    // SerialPort = require('serialport');
    // Readline = SerialPort.parsers.Readline;
    // parser = new Readline();
    // initButton = new HTMLManager();
    
    constructor() {
        // // SerialPort = require('serialport');
        this.Readline = SerialPort.parsers.Readline;
        this.parser = new Readline();
        this.initButton = new HTMLManager();
        this.initButton.onPressArduino(this.prueba())
    }

    prueba = function () {
        console.log('Prueba Funcionando');
    }

    init = function () {

        const mySerial = new SerialPort("COM3" ,{
            baudRate: 9600
        }, function (err) {
            if (err) {
                console.log('Hubo un Error: ', err);
            } else {
                console.log('conectado exitosamente');
            }
        });
    }

    openPort = function () {
        mySerial.on('open', function(){
            console.log('El Puerto ha sido Abierto');
        })
    }

    receiveData = function () {
        mySerial.on('data', function(data){
            console.log(data.toString());
        })
    }
}



