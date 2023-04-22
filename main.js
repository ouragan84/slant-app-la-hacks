const { win, BrowserWindow, app, ipcMain, Menu, dialog} = require('electron');
const fs = require("fs");
const path = require('path');
const homedir = require('os').homedir();

console.log('homedir', homedir)


async function createWindow() {
    let win = new BrowserWindow({
        width: 800, 
        height: 600,
        backgroundColor: '#ffffff',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            worldSafeExecuteJavaScript: true,
            enableRemoteModule: true,
            // preload: `${__dirname}/preload.js`
        }
    });

    win.loadFile('index.html');
}

ipcMain.on('load-file', (event) => {  
    // If the platform is 'win32' or 'Linux'
    // Resolves to a Promise<Object>
    dialog.showOpenDialog({
        title: 'Select the File to be opened',
        defaultPath: path.join(homedir, 'Desktop'),
        buttonLabel: 'Open',
        // Restricting the user to only Text Files.
        filters: [ 
        { 
            name: 'Slant Files', 
            extensions: ['sla'] 
        }, ],
        // Specifying the File Selector Property
         properties: process.platform === 'darwin' ? ['openFile', 'openDirectory'] : ['openFile']
    }).then(file => {
        // Stating whether dialog operation was
        // cancelled or not.
        console.log(file.canceled);
        if (!file.canceled) {
            const filepath = file.filePaths[0].toString();
            console.log(filepath);
            if (process.platform === 'darwin')
                event.reply('file-loaded', filepath);
        }  
    }).catch(err => {
      console.log(err)
    });
});

ipcMain.on('save-new-file', (event, text) => {  

    // If the platform is 'win32' or 'Linux'
    // Resolves to a Promise<Object>
    dialog.showSaveDialog ({
        title: 'Select where to save the file',
        defaultPath: path.join(homedir, 'Desktop'),
        buttonLabel: 'Save',
        // Restricting the user to only Text Files.
        filters: [ 
        { 
            name: 'Slant Files', 
            extensions: ['sla'] 
        }, ],
        // Specifying the File Selector Property
         properties: process.platform === 'darwin' ? ['createDirectory'] : []
    }).then(file => {
        // Stating whether dialog operation was
        // cancelled or not.
        console.log(file.canceled);
        if (!file.canceled) {
            const filepath = file.filePath.toString();
            console.log(filepath);
            fs.writeFile(filepath, text, (err) => {
                if (err) {
                    console.log("An error ocurred creating the file " + err.message)
                }
            });
            if (process.platform === 'darwin')
                event.reply('file-saved', filepath);
        }
    }).catch(err => {
      console.log(err)
    });
});

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
    