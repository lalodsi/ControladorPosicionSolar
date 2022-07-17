const express = require("express");
const path = require('node:path');
const router = express.Router();
const { SerialPort } = require("serialport");

router.get('/contenido/:id', function (req, res) {
    const { id } = req.params;
    const jsDirectory = path.parse(__dirname);
    const tesisDirectory = path.parse(jsDirectory.dir);
    if (id == 1){
        res.sendFile(tesisDirectory.dir + "\\menu\\informacionGeneral.html");
    }
    else if(id == 2){
        res.sendFile(tesisDirectory.dir + "\\menu\\graficas.html");
    }
    else if(id == 3){
        res.sendFile(tesisDirectory.dir + "\\menu\\controlManual.html");
    }
    else if(id == 4){
        res.sendFile(tesisDirectory.dir + "\\menu\\panelDeControl.html");
    }
    else if(id == 5){
        res.sendFile(tesisDirectory.dir + "\\menu\\controladorConexion.html");
    }
    else{
        res.json({message: "No encontrado", id: id});
    }
})

router.get('/test', function (req, res) {
    res.json({state: 'ok'});
})

router.get('/ports', async function (req, res) {
    const puertos = await SerialPort.list();
    res.json(puertos);
})

module.exports = router