const ArduinoSerial = require('./js/ArduinoSerial.js');
const Server = require('./js/Server.js')
console.clear()


let arduino = new ArduinoSerial();
let Servidor = new Server();


Servidor.start()
Servidor.socket(sockets)

function sockets(socket) {
    socket.on('connect-to-arduino', data => {
        if (data.connect) {
            const port = data.port
            arduino.init(port, socket)
        } else {
            arduino.disconnect()
            socket.emit('arduinoConnectionState', {isConnected: false})
        }
    })
}