const windowActions = require("./window");
const arduinoActions = require("./arduino");

module.exports = {
    ...windowActions,
    ...arduinoActions
}