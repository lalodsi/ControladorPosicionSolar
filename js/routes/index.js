const express = require("express");

const menusRouter = require("./menu.router");

function routerApi(app) {
    const router = express.Router();
    app.use("/api/v1", router);
    router.use("/menu", menusRouter);
}

module.exports = routerApi;