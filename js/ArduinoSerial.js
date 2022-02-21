SerialPort = require('serialport');

class ArduinoSerial{
    
    constructor() {    
        this.inicializado = false
        this.mySerial = null
    }

    init = async function (port, socket) {
         await this.wait('Conectando...')
         this.mySerial = await this.establishConnection(port, socket)
    }

    establishConnection = function (port, socket) {
        return new Promise( function (resolve, reject) {
            // console.log('Se pidió una conexión con el arduino, intentando conectar...');
            const serial = new SerialPort(port ,{
                baudRate: 9600
            }, function (err) {
                if (err) {
                    console.log('Hubo un error al conectar con arduino: ', err);
                    socket.emit('arduinoConnectionState', {isConnected: false})
                } else {
                    console.log('Conectado exitosamente al arduino');
                    socket.emit('arduinoConnectionState', {isConnected: true})
                }
            });
            resolve(serial)
            this.inicializado = true
        })
    }

    wait = function (message) {
        return new Promise( (resolve, reject)=> {
            console.log(message);
            setTimeout(() => {
                resolve(true)
            }, 500);
        })
    }

    receiveData = function (callback) {
        this.mySerial.on('data', function(data){
            console.log(data.toString());
            callback(data.toString)
        })
    }

    disconnect = async function () {
        await this.wait("Desconectando...")
        this.mySerial.close()
        console.log("Se ha desconectado el Arduino");
    }
    
}

module.exports = ArduinoSerial