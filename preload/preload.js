const { ipcRenderer, contextBridge } = require("electron")

const WINDOW_API = {
    openGitSetUpWidow: () => ipcRenderer.invoke("open-git-setup-window"),
    isGitDataPresent:  () => ipcRenderer.invoke("is-git-id-defined"),

    ipcRendererToMainConnected: (message) => ipcRenderer.send("ipc-renderer-to-main-connected", message),
    resizeWindow: (size) => ipcRenderer.send("resize-window", size)
}

const GIT_API = {
    getGitData: () => ipcRenderer.invoke("get-git-data")
}

contextBridge.exposeInMainWorld("api", WINDOW_API)
contextBridge.exposeInMainWorld("git", GIT_API)