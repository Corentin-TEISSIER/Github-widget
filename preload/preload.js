const { ipcRenderer, contextBridge, shell } = require("electron")

const WINDOW_API = {
    // invokers
    openGitSetUpWidow: () => ipcRenderer.invoke("open-git-setup-window"),
    isGitDataPresent:  () => ipcRenderer.invoke("is-git-id-defined"),
    // senders
    ipcRendererToMainConnected: (message) => ipcRenderer.send("ipc-renderer-to-main-connected", message),
    resizeWindow: (size) => ipcRenderer.send("resize-window", size),
    // tools
    openExternal: (url) => shell.openExternal(url),
}

const GIT_API = {
    getGitData: () => ipcRenderer.invoke("get-git-data")
}

contextBridge.exposeInMainWorld("api", WINDOW_API)
contextBridge.exposeInMainWorld("git", GIT_API)