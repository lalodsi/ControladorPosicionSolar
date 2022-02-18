const ArduinoSerial = require('./js/ArduinoSerial.js');
const Server = require('./js/Server.js')


let arduino = new ArduinoSerial();
let Servidor = new Server();


// Avisar cuando un usuario este conectado
Servidor.getIO().on('connection', function(socket) {
    console.log(socket.id);
})

Servidor.connect()

// Conexion con Arduino
arduino.init()
arduino.openPort()
// arduino.receiveData(function(datos) {
//     Servidor.io.emit('arduino:data', {
//         value: datos
//     })
// })

Servidor.getIO().on("connect-to-arduino", (data)=>{
    // console.log(data);
    if (data) {
        console.log('Conectando al arduino');
    }
})

Servidor.getIO.on("data", () => {
    console.log('datos');
})