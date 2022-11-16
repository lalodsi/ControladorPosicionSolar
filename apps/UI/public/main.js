// const { app : electronApp, BrowserWindow, ipcMain } = require("electron");
// const path = require("path");

// function createWindow() {
//     const win = new BrowserWindow({
//         width: 1200,
//         height: 700,
//         frame: false,
//         titleBarStyle: 'hidden',
//         resizable: false,
//         webPreferences: {
//             preload: path.join(__dirname, '../public/preload.js'),
//             nodeIntegration: true,
//             contextIsolation: true,
//             devTools: true,
//         }
//     })
//     ipcMain.on('closeApp', ()=> {
//         win.close();
//     })
//     ipcMain.on('minimizeApp', ()=> {
//         console.log("Minimizando App desde server");
//         win.minimize();
//     })
//     win.loadURL(`http://localhost:3000`);
// };

// electronApp.whenReady().then(createWindow)

// electronApp.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         electronApp.quit();
//     }
// })

// electronApp.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//         createWindow()
//     }
// })