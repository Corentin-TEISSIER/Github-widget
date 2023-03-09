const { ipcRenderer, contextBridge } = require("electron")

const SETUP_API = {
    ipcRendererSetupToMainConnected: (message) => ipcRenderer.send("ipc-renderer-setup-to-main-connected", message),
}

contextBridge.exposeInMainWorld("setupAPI", SETUP_API)