const { ipcRenderer, contextBridge } = require("electron")

const WINDOW_API = {
    openGitSetUpWidow: () => ipcRenderer.invoke("open-git-setup-window"),
    isGitDataPresent:  () => ipcRenderer.invoke("is-git-data-defined"),

    ipcRendererToMainConnected: (message) => ipcRenderer.send("ipc-renderer-to-main-connected", message),
    resizeWindow: (size) => ipcRenderer.send("resize-window", size)
}

contextBridge.exposeInMainWorld("api", WINDOW_API)