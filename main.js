const { app, BrowserWindow, screen } = require('electron')
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

const createWindow = () => {
    const win = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        transparent: true,
        backgroundColor: '#ee21262e',
        resizable: true,
        transparent: true,
        frame: true,
        x: shiftWindowLeft,
        y: shiftWindowTop,
        hasShadow: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')
    win.webContents.openDevTools()

    win.webContents.on('dom-ready', () => {
        win.webContents.insertCSS(
            fs.readFileSync(path.join(__dirname, 'css', 'primaryWindow.css'), 'utf8')
        )
    })
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

