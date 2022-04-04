const SerialPort = require('serialport');
const readLine = require('@serialport/parser-readline');
const isOdd = require("is-odd");

class ArduinoSerial{
    mensajes = {
        arduinoRequest: "Se pidió una conexión con el arduino en el puerto ",
        connecting: "Conectando...",
        disconnecting: "Desconectando...",
        errorConnecting: "Hubo un error al conectar con arduino: ",
        connectionSuccessful: "Conectado exitosamente al arduino",
        ArduinoDisconnection: "Se ha desconectado el Arduino",
        shareData: "Compartiendo datos"
    }
    
    constructor() {
        this.isConnected = false;
        // this.readLine = SerialPort.parser.readLine();
        // this.parser = new readLine();
    }

    /**
     * Inicializa la conexión con arduino mostrando un mensaje de espera
     * @param {number} port puerto serie en el que se estará estableciendo la conexión
     * @param {io.socket} socket objeto websocket necesario en la funcion establishConnection()
     */
    init = async function (port, socket, server) {
        await this.wait(this.mensajes.connecting);
        this.server = server;
        this.port = await this.establishConnection(port, socket);
        this.parser = new readLine();
        this.port.pipe(this.parser);
        // this.socket = socket
        // this.receiveData(socket)
    }

    /**
     * Se Establece una conexión con el puerto serial indicado y comunica el estado de la conexión a
     * través de un web socket
     * @param {number} port Puerto serie en el que se estará estableciendo la conexión
     * @param {io.socket} socket Websocket en el que se comunicará el estado de la conexión con arduino
     * @returns {Promise}
     */
    establishConnection = function (port, socket) {
        const messages = this.mensajes
        const servidor = this.server;
        return new Promise( function (resolve, reject) {
            console.log(messages.arduinoRequest + port);
            const serial = new SerialPort(port,{
                baudRate: 115200
            }, function (err) {
                if (err) {
                    console.log(messages.errorConnecting, err);
                    socket.emit(servidor.sockets.estadoArduino, {isConnected: false})
                    this.isConnected = false
                } else {
                    console.log(messages.connectionSuccessful);
                    socket.emit(servidor.sockets.estadoArduino, {isConnected: true})
                    this.isConnected = true
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
    receiveData = function (socket, sendData) {
        console.log("Recibiendo datos en el arduino");
        const servidor = this.server;
        this.parser.on('data', function(data){
            let arrayFinal = [];
            const datosEnteros = data.toString();
            const datosLimpios = datosEnteros.trim();
            const grupoDatos = datosLimpios.split(",");
            grupoDatos.forEach(element => {
                element.split("=").forEach( (dato, index) => {
                    if (isOdd(index)) {
                        arrayFinal.push(dato.trim());
                    }
                } )
            });
            // console.log(arrayFinal);
            // Enviar datos al servidor por web sockets
            socket.emit(servidor.sockets.intercambiarDatos, arrayFinal);
        })
    }

    /**
     * Desconecta el arduino del puerto serie
     */
    disconnect = async function () {
        await this.wait(this.mensajes.disconnecting);
        this.port.close();
        console.log(this.mensajes.ArduinoDisconnection);
        this.isConnected = false;
    }
    
}

module.exports = ArduinoSerial