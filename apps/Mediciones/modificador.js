"use strict";
exports.__esModule = true;
// import Plotly from 'plotly.js-dist-min'
var fs_1 = require("fs");
var year = 2023;
var month = 7;
var day = 18;
var hour = 15;
var minutes = 15;
var dateToAnalize = [year, month, day, hour, minutes, 0, 0];
var getFileData = function () {
    var file = (0, fs_1.readFileSync)("datos18Julio.txt", { encoding: 'utf8' });
    var splittedByLines = file.split("\r\n");
    var splittedByData = splittedByLines.map(function (line) { return line.split(","); });
    splittedByData.shift();
    return splittedByData;
};
var estructureData = function (data, startDate) {
    // 
    var current = [];
    var power = [];
    var date = [];
    data.map(function (arr, index) {
        if (arr.pop()) {
            var ms = startDate.getTime();
            var newDate = new Date(ms + index * 1000 * 5);
            date.push("".concat(newDate.getHours(), ":").concat(newDate.getMinutes(), ":").concat(newDate.getSeconds()));
            // date.push(newDate);
            power.push(arr.pop());
            current.push(arr.pop());
        }
    });
    return { date: date, current: current, power: power };
};
var myData = getFileData();
var myEstructuredData = estructureData(myData, new Date(2023, 7, 18, 15, 0, 0, 0));
console.log(myEstructuredData);
var randomGenerator = function () {
    //
    return Math.random();
};
