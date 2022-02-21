const express = require('express')
const ArduinoSerial = require('../ArduinoSerial.js');



const router = express.Router();

router.get('/connect/', (req, res)=> {
    let arduino = new ArduinoSerial();
    
    arduino.init()
    state = arduino.openPort()

    res.json({
        state: 'conectado'
    })
})

module.exports = router