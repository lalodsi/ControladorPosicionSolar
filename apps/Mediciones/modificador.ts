// import Plotly from 'plotly.js-dist-min'
import { readFileSync } from "fs"

const year = 2023
const month = 7
const day = 18
const hour = 15
const minutes = 15

const dateToAnalize = [year, month, day, hour, minutes, 0, 0];
// Traer el archivo
// 
type fileType = string[][]
const getFileData = (): fileType => {
    const file: string = readFileSync("datos18Julio.txt", { encoding: 'utf8' });
    const splittedByLines = file.split("\r\n");
    const splittedByData = splittedByLines.map(line => line.split(","));
    splittedByData.shift();
    return splittedByData;
}

const estructureData = (data: fileType, startDate: Date) => {
    // 
    const current: (string | undefined)[] = []
    const power: (string | undefined)[] = []
    const date: any[] = []
    data.map((arr, index) => {
        if (arr.pop()) {
            const ms = startDate.getTime()
            const newDate = new Date(ms + index * 1000 * 5)
            date.push(`${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`);
            // date.push(newDate);
            power.push(arr.pop())
            current.push(arr.pop())
        }
    })
    return {date, current, power}
}

const myData = getFileData();
const myEstructuredData = estructureData(myData, new Date(2023, 7, 18, 15, 0, 0, 0));
console.log(myEstructuredData);


const randomGenerator = (): number => {
    //
    return Math.random();
}

