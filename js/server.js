const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const parser = new Readline();

// const SerialPort = require('serialport')
// const Readline = SerialPort.parsers.Readline
const port = new SerialPort('COM3')
// const parser = new Readline()
port.pipe(parser)
parser.on('data', console.log)
port.write('ROBOT PLEASE RESPOND\n')
// ROBOT ONLINE

console.log('Section 1');

const mySerial = new SerialPort('COM3 ', {
    baudRate: 9600
});

mySerial.on('read', function(){
    console.log('Puerto Abierto');
})