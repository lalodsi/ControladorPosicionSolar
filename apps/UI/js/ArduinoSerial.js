const {SerialPort} = require('serialport');
const {ReadlineParser} = require('@serialport/parser-readline');
const { autoDetect } = require('@serialport/bindings-cpp');
const isOdd = require("is-odd");

class ArduinoSerial{
    mensajes = {
        arduinoRequest: "Se pidió una conexión con el arduino en el puerto ",
        connecting: "Conectando...",
        checkingFailed: "Parece que el dispositivo conectado no trae el software necesario",
        disconnecting: "Desconectando...",
        errorConnecting: "Hubo un error al conectar con arduino: ",
        connectionSuccessful: "Conectado exitosamente al arduino",
        ArduinoDisconnection: "Se ha desconectado el Arduino",
        ArduinoIsNoLongerConnected: "Parece que el arduino ya no se encuentra desconectado",
        AppWereReseted: "Parece que el servidor se recargó y el arduino ya no está conectado",
        shareData: "Compartiendo datos"
    }
    
    constructor() {
        this.isConnected = false;
        this.isApproved = false;
        this.SerialConnected = false;
    }

    /**
     * Inicializa la conexión con arduino mostrando un mensaje de espera
     * También activa la recepción de información
     * @param {number} port puerto serie en el que se estará estableciendo la conexión
     * @param {io.socket} socket objeto websocket necesario en la funcion establishConnection()
     */
    init = async function (port, ipcMain, eventName) {
        await this.wait(500, this.mensajes.connecting);
        this.port = this.establishConnection(port, ipcMain, eventName);
        this.parser = new ReadlineParser();
        this.port.pipe(this.parser);
        this.receiveData();
    }

    /**
     * Se Establece una conexión con el puerto serial indicado y comunica el estado de la conexión a
     * través de un web socket
     * @param {number} port Puerto serie en el que se estará estableciendo la conexión
     * @param {io.socket} socket Websocket en el que se comunicará el estado de la conexión con arduino
     * @returns {Promise} Al resolver la promesa se retornará el objeto serial para conectarse
     */
    establishConnection = function (port, ipcMain, eventName) {
        const messages = this.mensajes
        // const servidor = this.server;
        // Verificar que el arduino traiga el software
        setTimeout(()=>{
            if (!this.isApproved && this.isConnected) {
                ipcMain.emit(eventName, {
                    hasTheProgram: false,
                    message: "El dispositivo no tiene el software adecuado"
                })
                console.log(this.mensajes.checkingFailed);
                this.disconnect();
            }
        }, 3000);

            console.log(messages.arduinoRequest + port);
            const serial = new SerialPort({
                path: port,
                baudRate: 9600
            }, function (err) {
                if (err) {
                    console.log(messages.errorConnecting, err);
                    ipcMain.emit(eventName, 
                        {
                            isConnected: false, 
                            error: true, 
                            message: err.message
                        });
                        this.isConnected = false
                        this.isApproved = false;
                } else {
                    console.log(messages.connectionSuccessful);
                    ipcMain(eventName,
                        {
                            isConnected: true,
                            error: false,
                            message: ""
                        });
                    this.isConnected = true;
                    this.isApproved = false;
                }
            });
        return serial;
    }

    /**
     * Espera un momento y muestra un mensaje
     * @param {string} message mensaje que mostrar en el servidor
     * @returns {Promise}
     */
    wait = function (time, message) {
        return new Promise( (resolve, reject)=> {
            if (message) {
                console.log(message);
            }
            setTimeout(() => {
                resolve(true)
            }, time);
        })
    }

    /**
     * TODO: establecer el intercambio de información con arduino
     * @param {function} callback funcion a ejecutar
     */
    receiveData = function (sendData) {
        console.log("Activada la recepción de información desde arduino");
        this.parser.on('data', data => {
            try{
                console.log(data);
                const datos = JSON.parse(data);
                // Cambiar Menu
                if (datos.accion === "changeMenu") {
                    const menu = datos.menu;
                    // socket.emit(this.server.sockets.menuArduino,
                    //     {
                    //         menu
                    //     });
                }
                // MonitorSerial
                if (this.monitorSerialConnected) {
                    // socket.emit("monitorSerial", data);
                    return;
                }
                // console.log(datos.accion);
                if (datos.accion === "monitoreo") 
                {
                    this.analizaDatosDeEntrada(datos, socket, this.server);
                }
                if (datos.accion === "mensaje") {
                    console.log(datos.message);
                }
                if (datos.accion === "test") {
                    this.isApproved = true;
                    console.log(datos.message);
                    // socket.emit(this.server.sockets.versionSoftwareArduino, 
                    //     {
                    //         hasTheProgram: true,
                    //         message: "El dispositivo tiene el software adecuado"
                    //     });
                }
            }
            catch(err){
                console.log("LLegó un dato erroneo: ",err.message);
                this.disconnect();
            }
        });
    }

    sendData = async function (data) {
        return this.port.write(data);
    }

    /**
     * Desconecta el arduino del puerto serie
     */
    disconnect = async function () {
        await this.wait(500, this.mensajes.disconnecting);
        if (this.port.isOpen) {
            await this.port.close();
            console.log(this.mensajes.ArduinoDisconnection);
        }
        else{
            console.log(this.mensajes.AppWereReseted);
        }
        this.isConnected = false;
        this.isApproved = false;
        // socket.emit(servidor.sockets.estadoArduino, 
        //     {
        //         isConnected: false, 
        //         error: false,
        //         message: ""
        //     });
    }

    analizaDatosDeEntrada = function (datos) {
        let arrayFinal = [];
        arrayFinal.push(datos.sensor1);
        arrayFinal.push(datos.sensor2);
        arrayFinal.push(datos.sensor3);
        arrayFinal.push(datos.sensor4);
        arrayFinal.push(datos.sensor5);
        // Enviar datos al servidor por web sockets
        // socket.emit(servidor.sockets.intercambiarDatos, arrayFinal);
    }

    // enviarPuertosDisponibles = async function (socket, servidor) {
    //     const puertos = await SerialPort.list();
    //     socket.emit("ports", puertos);
    // }
}

module.exports = ArduinoSerial