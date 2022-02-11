const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const parser = new Readline();

console.log('Section 1');

const mySerial = new SerialPort('COM3 ', {
    baudRate: 9600
});
console.log('Section 2');

// mySerial.on('open', function(){
//     console.log('Puerto Abierto');
// })