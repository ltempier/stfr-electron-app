const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,

        minWidth: 700,
        minHeight: 700,

        titleBarStyle: 'hidden',

        // titleBarStyle: 'customButtonsOnHover',
        // frame: false,
        // backgroundColor: '#F9F9F9'
        // backgroundColor: 'rgba(255,255,255,40)',

        transparent: true,
        frame: false,
        toolbar: false

    });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
