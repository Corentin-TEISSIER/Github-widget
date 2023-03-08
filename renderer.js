// Informative message connection IPC established: Renderer -> Main
window.api.ipcRendererToMainConnected("Connection IPC : Renderer -> Main : OK")

// Window resizement
const windowState = {
    Bar: "bar",
    Icon: "icon",
    Menu: "menu",
    Full: "full"
}
const windowSize = {
    Bar: {x: 600, y: 600},
    Icon: {x: 100, y: 100},
    Menu: {x: 0, y: 0},
    Full: {x: 0, y: 0}
}
var currentWindowState = windowState.Bar
const windowContainer = document.getElementById('widget-main-container')

windowContainer.addEventListener("mouseover", () => {window.api.resizeWindow(windowSize.Icon)})
windowContainer.addEventListener("mouseleave", () => {window.api.resizeWindow(windowSize.Bar)})





// tests

