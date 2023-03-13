// Informative message connection IPC established: Renderer -> Main
window.setupAPI.ipcRendererSetupToMainConnected("Connection IPC : RendererSetup -> Main : OK")

// get git user data
const registerButton = document.getElementById("set-git-data-up")
registerButton.addEventListener("click", () => {
    const gitUsername = document.getElementById("fillin-area-git-username").value 
    const gitToken = document.getElementById("fillin-area-git-token").value 
    window.setupAPI.sendGitData({gitUsername, gitToken})
})