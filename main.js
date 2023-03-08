const { app, BrowserWindow, screen, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

// usefull values (try to set up when first window is ready)
var screenWidth = 0
var screenHeight = 0
var windowWidth = 600
var windowHeight = 600
var shift = 700
var shiftWindowLeft = screenWidth - shift
var shiftWindowTop = 0

var windowOpacity = 1

const createWindow = () => {
    const win = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        transparent: true,
        backgroundColor: '#21262e',
        resizable: false,
        transparent: true,
        opacity: windowOpacity,
        frame: false,
        x: shiftWindowLeft,
        y: shiftWindowTop,
        hasShadow: true,
        alwaysOnTop: false,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })

    //Renderer event listener
    ipcMain.on('activate', (event,size) => {
        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        win.
    })


    win.loadFile('index.html')

    // activate dev tools 
    win.webContents.openDevTools()

    win.webContents.on('dom-ready', () => {
        win.webContents.insertCSS(
            fs.readFileSync(path.join(__dirname, 'css', 'primaryWindow.css'), 'utf8')
        )
    })

    //tests
    console.log(win.webContents)
}

app.whenReady().then(() => {

    // display env info
    const primaryDisplay = screen.getPrimaryDisplay()
    screenWidth = primaryDisplay.workAreaSize.width
    screenHeight = primaryDisplay.workAreaSize.height 

    console.log(`Screen width: ${screenWidth}`)
    console.log(`Screen height: ${screenHeight}`)

    //compute shift
    shiftWindowLeft = screenWidth - shift
    shiftWindowTop = 0

    //primary window creation
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

