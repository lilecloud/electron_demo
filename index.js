const { app, BrowserWindow ,ipcMain,dialog} = require('electron')
const path = require('path')

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            // 官网似乎说是默认false，但是这里必须设置contextIsolation
            contextIsolation: false
          }
    })
    // win.webContents.openDevTools();
    win.loadFile('index.html');

    // 打开保存对话框
    ipcMain.handle('show_dialog', async (event, someArgument) => {
        return await dialog.showSaveDialogSync();
    })
}


app.whenReady().then(() => {
    createWindow()
})