const ArduinoSerial = require('./ArduinoSerial.js')
const HTMLManager = require('./HTMLManager.js')

let arduino = new ArduinoSerial()

arduino.init()
arduino.openPort()
arduino.receiveData()
