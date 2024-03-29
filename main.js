const { app, BrowserWindow, screen, Menu, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const gitAPI = require(path.join(__dirname, 'modules', 'gitAPI.js'))
require('dotenv').config()

//dev var
const devToolActivate = false

// usefull values (try to set up when first window is ready)
    //Main window
var screenWidth = 0
var screenHeight = 0
// var windowWidth = 200
// var windowHeight = 25
var windowWidth = 700
var windowHeight = 580
var shift = 700
var shiftWindowLeft = screenWidth - shift
var shiftWindowTop = 0
var windowOpacity = 1
    //Setup window
const setupWindowWidth = 800
const setupWindowHeight = 800

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

const syncFetchGitData = async () => {
    gitAPI.initConnection(process.env.GITHUB_TOKEN)
    var gitApiData
    try{
        gitApiData = await gitAPI.fetchDataForApp(process.env.GIT_USERNAME)
    }catch(error){
        throw error
    }
    return gitApiData
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
        // frame: false,
        x: shiftWindowLeft,
        y: shiftWindowTop,
        hasShadow: true,
        alwaysOnTop: false,
        skipTaskbar: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload', 'preload.js'),
            nodeIntegration: true
        }
    })

    win.setTitle("Github widget")

    win.loadFile('pages/index.html')

    // activate dev tools 
    win.webContents.on('did-frame-finish-load', () => {
        if(devToolActivate){win.webContents.openDevTools()}
      })

    win.webContents.on('dom-ready', () => {
        win.webContents.insertCSS(
            fs.readFileSync(path.join(__dirname, 'css', 'primaryWindow.css'), 'utf8')
        )
    })

    //IPC on
    ipcMain.on("ipc-renderer-to-main-connected", (event, args) => {
        console.log(args)
    })
    ipcMain.on("resize-window", (event,size) => {
        win.setSize(size.x, size.y)
        //resizeWindow(win,size,250)
    })

    //IPC handle
    ipcMain.handle("open-git-setup-window", async (event) => {
        const gitData = await createSetupWindow()
        return gitData
    })
    ipcMain.handle("is-git-id-defined", (event) => {
        if(process.env.GIT_USERNAME){
            return {res: true, gitData: {username: process.env.GIT_USERNAME, token: process.env.GITHUB_TOKEN}}}
        else{return {res: false, gitData: {error: "not found"}}}
    })
    ipcMain.handle("get-git-data", async (event) => {
        var gitData
        try{
            gitData = await syncFetchGitData()
        }catch(error){
            console.log(error)
        }
        return gitData
        
    })
  

    //tests
}

async function createSetupWindow(){
    var win = new BrowserWindow({
        width: setupWindowWidth,
        height: setupWindowHeight,
        backgroundColor: '#21262e',
        resizable: false,
        frame: false,
        center: true,
        hasShadow: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload', 'preloadSetup.js'),
            nodeIntegration: true
        }
    })
    win.setTitle("Setup")

    win.loadFile('pages/setup.html')

    // activate dev tools 
    if(devToolActivate === true) {win.webContents.openDevTools()}

    win.webContents.on('dom-ready', () => {
        win.webContents.insertCSS(
            fs.readFileSync(path.join(__dirname, 'css', 'setupWindow.css'), 'utf8')
        )

    })

    //IPC on
    ipcMain.on("ipc-renderer-setup-to-main-connected", (event, args) => {
        console.log(args)
    })

    return new Promise((resolve) => {
        ipcMain.once("send-git-data", (event, args) => {
            if(args != "cancel"){
                process.env.GIT_USERNAME = args.gitUsername
                process.env.GITHUB_TOKEN = args.gitToken
                fs.writeFileSync('.env',`GIT_USERNAME=${process.env.GIT_USERNAME}\nGITHUB_TOKEN=${process.env.GITHUB_TOKEN}`)
            }
            win.close()
            if(args != "cancel"){
                resolve({username: process.env.GIT_USERNAME, token: process.env.GITHUB_TOKEN})
            }
            else{
                resolve("cancel")
            }
            
        })
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



// TESTS

 



