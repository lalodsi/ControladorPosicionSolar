SerialPort = require('serialport');

class ArduinoSerial{
    constructor() {
    }

    /**
     * Inicializa la conexión con arduino mostrando un mensaje de espera
     * @param {number} port puerto serie en el que se estará estableciendo la conexión
     * @param {io.socket} socket objeto websocket necesario en la funcion establishConnection()
     */
    init = async function (port, socket) {
         await this.wait('Conectando...')
         this.mySerial = await this.establishConnection(port, socket)
    }

    /**
     * Se Establece una conexión con el puerto serial indicado y comunica el estado de la conexión a
     * través de un web socket
     * @param {number} port Puerto serie en el que se estará estableciendo la conexión
     * @param {io.socket} socket Websocket en el que se comunicará el estado de la conexión con arduino
     * @returns {Promise}
     */
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
        })
    }

    /**
     * Espera un momento y muestra un mensaje
     * @param {string} message mensaje que mostrar en el servidor
     * @returns {Promise}
     */
    wait = function (message) {
        return new Promise( (resolve, reject)=> {
            console.log(message);
            setTimeout(() => {
                resolve(true)
            }, 500);
        })
    }

    /**
     * TODO: establecer el intercambio de información con arduino
     * @param {function} callback funcion a ejecutar
     */
    receiveData = function (callback) {
        this.mySerial.on('data', function(data){
            console.log(data.toString());
            callback(data.toString)
        })
    }

    /**
     * Desconecta el arduino del puerto serie
     */
    disconnect = async function () {
        await this.wait("Desconectando...")
        this.mySerial.close()
        console.log("Se ha desconectado el Arduino");
    }
    
}

module.exports = ArduinoSerial