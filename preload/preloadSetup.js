const { ipcRenderer, contextBridge } = require("electron")

const SETUP_API = {
    ipcRendererSetupToMainConnected: (message) => ipcRenderer.send("ipc-renderer-setup-to-main-connected", message),
    sendGitData: (gitUsername) => ipcRenderer.send("send-git-data", gitUsername)
}

contextBridge.exposeInMainWorld("setupAPI", SETUP_API)
