const { app, BrowserWindow, screen, Menu, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

//dev var
const devToolActivate = true

// usefull values (try to set up when first window is ready)
var screenWidth = 0
var screenHeight = 0
// var windowWidth = 200
// var windowHeight = 25
var windowWidth = 600
var windowHeight = 600
var shift = 700
var shiftWindowLeft = screenWidth - shift
var shiftWindowTop = 0

var windowOpacity = 1

// usefull functions
const resizeWindow = (win, size, duration) => {
    const startSize = win.getSize();
    const targetSize = [size.x, size.y];

    const startTime = Date.now();

    const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const newSize = [
            Math.floor(startSize[0] + (targetSize[0] - startSize[0]) * progress),
            Math.floor(startSize[1] + (targetSize[1] - startSize[1]) * progress),
        ];
        win.setSize(newSize[0], newSize[1]);

        if (progress === 1) {
            clearInterval(interval);
        }
    }, 1);
}


const createWindow = () => {
    var win = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        transparent: true,
        backgroundColor: '#21262e',
        resizable: true,
        transparent: true,
        opacity: windowOpacity,
        frame: false,
        x: shiftWindowLeft,
        y: shiftWindowTop,
        hasShadow: true,
        alwaysOnTop: false,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload/preload.js'),
            nodeIntegration: true
        }
    })

    win.loadFile('pages/index.html')

    //IPC on
    ipcMain.on("ipc-renderer-to-main-connected", (event, args) => {
        console.log(args)
    })
    ipcMain.on("resize-window", (event,size) => {
        //win.setSize(size.x, size.y)
        resizeWindow(win,size,250)
    })

    //IPC handle
    ipcMain.handle("open-git-setup-window", async (event) => {
        createSetupWindow()

        return true
    })
  
    // activate dev tools 
    if(devToolActivate === true) {win.webContents.openDevTools()}

    win.webContents.on('dom-ready', () => {
        win.webContents.insertCSS(
            fs.readFileSync(path.join(__dirname, 'css', 'primaryWindow.css'), 'utf8')
        )
    })

    //tests
}

const createSetupWindow = () => {
    var win = new BrowserWindow({
        width: 400,
        height: 400,
        backgroundColor: '#21262e',
        resizable: false,
        frame: false,
        center: true,
        hasShadow: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload/preloadSetup.js'),
            nodeIntegration: true
        }
    })

    win.loadFile('pages/setup.html')

    //IPC on
    ipcMain.on("ipc-renderer-setup-to-main-connected", (event, args) => {
        console.log(args)
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



