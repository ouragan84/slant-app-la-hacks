const { win, BrowserWindow, app, ipcMain, Menu} = require('electron');
const fs = require("fs-extra");

async function createWindow() {
    let win = new BrowserWindow({
        width: 800, 
        height: 600,
        backgroundColor: '#ffffff',
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
            // preload: `${__dirname}/preload.js`
        }
    });

    win.loadFile('index.html');
}

require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
});

ipcMain.on('load-file', (event, arg) => {
    console.log('load-file');
});

app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
    
app.on('activate', () => {
      // On macOS it's common to re-create a window in the 
      // app when the dock icon is clicked and there are no 
      // other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
    