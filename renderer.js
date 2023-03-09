// Informative message connection IPC established: Renderer -> Main
window.api.ipcRendererToMainConnected("Connection IPC : Renderer -> Main : OK")


// WINDOW RESIZEMENT
const windowState = {
    Bar: "bar",
    Icon: "icon",
    Menu: "menu",
    Full: "full"
}
const windowSize = {
    Bar: {x: 200, y: 25},
    Icon: {x: 200, y: 400},
    Menu: {x: 0, y: 0},
    Full: {x: 0, y: 0}
}
var currentWindowState = windowState.Bar
const windowContainer = document.getElementById('bar-label')

windowContainer.addEventListener("mouseover", () => {window.api.resizeWindow(windowSize.Icon); currentWindowState = windowState.Icon})
windowContainer.addEventListener("mouseleave", () => {window.api.resizeWindow(windowSize.Bar); currentWindowState = windowState.Bar})

// GIT CONNECTION LABEL -> To Set with git rest api
var connected = true 

    // try connection
const isConnected = (connected) => {
    //manage check connection -> TO DO

    //change dom value
    const span = document.getElementById("git-connected-label")
    var connectedMessage = connected? " connected" : " disconnected" 
    span.innerHTML = connectedMessage
    connected? span.style.color = 'green' : span.style.color = 'red' 
    return true
}

isConnected(connected)



// tests

