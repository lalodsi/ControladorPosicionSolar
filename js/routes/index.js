const express = require('express')

const arduinoRouter = require('./arduino.router')

function routerApi(app) {
    const router = express.Router()
    app.use('/api', router);
    router.use('/arduino', arduinoRouter)
}

module.exports = routerApi