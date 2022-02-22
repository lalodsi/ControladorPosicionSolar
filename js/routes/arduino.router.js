const express = require('express');
const { header } = require('express/lib/request');

const router = express.Router();
const arduino = require('../../app')

router.get('/connect/', (req, res)=> {
    res.json({
        message: 'Api Funcionando'
    })
})

router.get('/setTime/', (req, res) => {
    const { date, time } = req.params;
    res.json({
        estado: "Recibido"
    })
    arduino.wait("Hola")
})

module.exports = router