const ArduinoSerial = require('./ArduinoSerial.js')
const DOM = require('./DOM.js')

let arduino = new ArduinoSerial()

arduino.init()
arduino.openPort()
arduino.receiveData()
