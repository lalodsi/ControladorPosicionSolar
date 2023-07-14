const {SerialPort, SerialPortMock} = require('serialport');
const {ReadlineParser} = require('@serialport/parser-readline');
const { autoDetect } = require('@serialport/bindings-cpp');
const isOdd = require("is-odd");
const fs = require('fs');

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
        this.monitorSerialConnected = false;
        this.data=[]
    }

    /**
     * Inicializa la conexión con arduino mostrando un mensaje de espera
     * También activa la recepción de información
     * @param {number} port puerto serie en el que se estará estableciendo la conexión
     * @param {io.socket} socket objeto websocket necesario en la funcion establishConnection()
     */
    init = async function (port, socket, server, db) {
        console.log("Showing environment variables");
        await this.wait(500, this.mensajes.connecting);
        this.server = server;
        try {
            this.port = this.establishConnection(port, socket);
        } catch (error) {
            console.log(error);
        }
        this.port.on('open', () => {
            // Opening port
            console.log("The port is opened");
            this.parser = new ReadlineParser();
            this.port.pipe(this.parser);
            this.receiveData(socket);

        })
    }

    /**
     * Se Establece una conexión con el puerto serial indicado y comunica el estado de la conexión a
     * través de un web socket
     * @param {number} port Puerto serie en el que se estará estableciendo la conexión
     * @param {io.socket} socket Websocket en el que se comunicará el estado de la conexión con arduino
     * @returns {Promise} Al resolver la promesa se retornará el objeto serial para conectarse
     */
    establishConnection = function (port, socket) {
        const messages = this.mensajes
        const servidor = this.server;


        // return new Promise( function (resolve, reject) {
            console.log(messages.arduinoRequest + port);
            const mode = process.env.NODE_ENV;
            const serialOptions = {
                path: port,
                baudRate: 9600
            };
            const errorFunction = function (err) {
                if (err) {
                    console.log(messages.errorConnecting, err);
                    socket.emit(servidor.sockets.estadoArduino, 
                        {
                            isConnected: false, 
                            error: true, 
                            message: err.message
                        });
                        this.isConnected = false
                        this.isApproved = false;
                } else {
                    console.log(messages.connectionSuccessful);
                    socket.emit(servidor.sockets.estadoArduino, 
                        {
                            isConnected: true, 
                            error: false, 
                            message: ""
                        });
                    this.isConnected = true;
                    this.isApproved = false;
                }
            }
            let serial;
            if ('PRODUCTION' === mode) {
                serial = new SerialPort(serialOptions, errorFunction);
            }
            if ('DEVELOPMENT' === mode) {
                SerialPortMock.binding.createPort(port)
                serial = new SerialPortMock(serialOptions, errorFunction);
            }
            
            // resolve(serial)
        // })
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
    receiveData = function (socket, sendData) {
        console.log("Activada la recepción de información desde arduino");
        console.clear()
        let Attempts = 0;
        this.parser.on('data', data => {
            try{
                // console.log(data);
                const datos = JSON.parse(data);
                // Cambiar Menu
                if (datos.accion === "changeMenu") {
                    const menu = datos.menu;
                    socket.emit(this.server.sockets.menuArduino,
                        {
                            menu
                        });
                }
                // MonitorSerial
                if (this.monitorSerialConnected) {
                    socket.emit("monitorSerial", data);
                    return;
                }
                // console.log(datos.accion);
                if (datos.accion === "monitoreo") 
                {
                    this.analizaDatosDeEntrada(datos, socket, this.server);

                    // Preparando datos de salida
                    const {
                        sensor1,
                        sensor2,
                        sensor3,
                        sensor4,
                        sensor5,
                        voltaje_gen,
                        voltaje_sal,
                        corriente_gen,
                        corriente_sal,
                    } = datos;
                    const dataOut = {
                        sensor1,
                        sensor2,
                        sensor3,
                        sensor4,
                        sensor5,
                        voltaje_gen,
                        voltaje_sal,
                        corriente_gen,
                        corriente_sal,
                    };
                    this.data.push(dataOut);
                }
                if(datos.accion === "anova"){
                    //
                    const {
                        sensor1,
                        sensor2,
                        sensor3,
                        sensor4,
                        sensor5,
                        AnovaResult
                    } = datos;

                    const out = {
                        sensor1,
                        sensor2,
                        sensor3,
                        sensor4,
                        sensor5,
                        result: AnovaResult
                    };

                    socket.emit(this.server.sockets.resultadosAnova, out);
                }
                if (datos.accion === "controlMotors") {
                    const {
                        azimutText,
                        incidenceText,
                        posIncidence,
                        posAzimut
                    } = datos.state;
                    console.log(`Texto Azimut: ${azimutText}`);
                    console.log(`Texto Incidencia: ${incidenceText}`);
                    console.log(`Posicion Actual de Incidencia: ${posIncidence}`);
                    console.log(`Posicion Actual de Azimut: ${posAzimut}`);
                }
                if (datos.accion === "mensaje") {
                    console.log(datos.message);
                }
                if (datos.accion === "test") {
                    this.isApproved = true;
                    console.log(datos.message);
                    socket.emit(this.server.sockets.versionSoftwareArduino, 
                        {
                            hasTheProgram: true,
                            message: "El dispositivo tiene el software adecuado"
                        });
                }
            }
            catch(err){
                console.log("LLegó un dato erroneo: ",err.message);
                Attempts++;
                if (Attempts > 10) {
                    console.log("Parece que están ocurriendo demasiados errores, se ha desconectado el arduino ",err.message);
                    this.disconnect(socket, this.server, true, err.message);
                }
            }
        });
    }

    sendData = async function (data) {
        return this.port.write(data);
    }

    /**
     * Desconecta el arduino del puerto serie
     */
    disconnect = async function (socket, servidor, error, message) {
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
        socket.emit(servidor.sockets.estadoArduino, 
            {
                isConnected: false, 
                error,
                message
            });
    }

    analizaDatosDeEntrada = function (datos, socket, servidor) {
        let arrayFinal = [];
        arrayFinal.push(datos.sensor1);
        arrayFinal.push(datos.sensor2);
        arrayFinal.push(datos.sensor3);
        arrayFinal.push(datos.sensor4);
        arrayFinal.push(datos.sensor5);
        arrayFinal.push(datos.voltaje_gen);
        arrayFinal.push(datos.voltaje_sal);
        arrayFinal.push(datos.corriente_gen);
        arrayFinal.push(datos.corriente_sal);

        // console.log(arrayFinal);
        // Enviar datos al servidor por web sockets
        socket.emit(servidor.sockets.intercambiarDatos, datos);
    }

    enviarPuertosDisponibles = async function (socket, servidor) {
        const puertos = await SerialPort.list();
        socket.emit("ports", puertos);
    }
    
}

module.exports = ArduinoSerial