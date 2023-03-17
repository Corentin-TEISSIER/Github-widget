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
    //tests
    Bar: {x: 500, y: 500},
    Icon: {x: 500, y: 800},
    Menu: {x: 0, y: 0},
    Full: {x: 0, y: 0}
    //prod
    // Bar: {x: 200, y: 25},
    // Icon: {x: 200, y: 400},
    // Menu: {x: 0, y: 0},
    // Full: {x: 0, y: 0}
}
var currentWindowState = windowState.Bar
const windowContainer = document.getElementById('widget-main-container')

windowContainer.addEventListener("mouseenter", () => {window.api.resizeWindow(windowSize.Icon); currentWindowState = windowState.Icon})
windowContainer.addEventListener("mouseleave", () => {window.api.resizeWindow(windowSize.Bar); currentWindowState = windowState.Bar})

// GIT CONNECTION LABEL -> To Set with git rest api

    // try connection
async function isConnected(){
    //manage check connection -> TO DO

    //change dom value
    var connected = await window.api.isGitDataPresent() 
    connected.res? document.getElementById("bar-label").style.display = 'flex' : document.getElementById("connection-button").style.display = 'flex'
    connected.res? document.getElementById("connection-button").style.display = 'none' : document.getElementById("bar-label").style.display = 'none'
    if(connected.res) document.getElementById("git-account-username-label").innerHTML = connected.gitData.username
    const span = document.getElementById("git-connected-label")
    var connectedMessage = connected.res? " connected" : " disconnected" 
    span.innerHTML = connectedMessage
    connected.res? span.style.color = 'green' : span.style.color = 'red' 
    return connected.res? true : false
}

isConnected()


// Git setup connection 
const gearsButtonContainer = document.getElementById("gears-button-container")
const gearsButton = document.getElementById("gears-button")
gearsButtonContainer.addEventListener("mouseenter", () => {
    gearsButton.src = "../icon/gears-bg-darker-1.png"
})
gearsButtonContainer.addEventListener("mouseleave", () => {
    gearsButton.src = "../icon/gears-bg-lighter.png"
})
gearsButtonContainer.addEventListener("click", () => {
    manageSetting()
})

const signinButton = document.getElementById("connection-button")
signinButton.addEventListener("click", async () => {
    manageSetting()
})

async function manageSetting(){
    const gitData = await window.api.openGitSetUpWidow()

    document.getElementById("git-account-username-label").innerHTML = gitData.username
    document.getElementById("bar-label").style.display = "flex"
    document.getElementById("connection-button").style.display = "none"
    document.getElementById("git-connected-label").innerHTML = " connected"
    document.getElementById("git-connected-label").style.color = 'green'

    const mainContainerWidth = document.getElementById("bar-label").getBoundingClientRect().width
    const mainContainerHeight = document.getElementById("bar-label").getBoundingClientRect().height

    window.api.resizeWindow({x:mainContainerWidth+25, y:mainContainerHeight+2})
}


// Update frequently git data
var currentGitData = {}
var prevGitData = {}

var elementAvatar
var elementReposList

function updateAvatar(){
    window.alert(currentGitData.userData.username)
    var userAvatar = document.getElementById("user-avatar")
    elementAvatar = document.createElement("a")
    elementAvatar.id = "user-avatar-href"
    elementAvatar.href = currentGitData.userData.html_url
    var userImage = document.createElement("img")
    userImage.id = "user-avatar-picture"
    userImage.src = currentGitData.userData.avatar
    elementAvatar.appendChild(userImage)
    userAvatar.appendChild(elementAvatar)
    elementAvatar.addEventListener('click', (event) => {
        event.preventDefault()
        window.api.openExternal(elementAvatar.href)
    })
    console.log("coucou")
}

function adapteDomToGitData(){
    if(JSON.stringify(currentGitData) === JSON.stringify({})){
        // No current data -> need to fetch data
        window.alert("1")
    }
    else{
        if(JSON.stringify(prevGitData) === JSON.stringify({})){
            // First fetch -> adapte the entire dom
            window.alert("2")
            updateAvatar()
        }
        else{
            if(JSON.stringify(currentGitData) === JSON.stringify(prevGitData)){
                // No update -> nothing to add neither delete
                window.alert("3")
            }
            else{
                // Some change made -> need to adapt the dom
                window.alert("4")
            }
        }
    }
}

async function fetchGitData(){

    if(isConnected()){
        prevGitData = currentGitData
        currentGitData = await window.git.getGitData()
        adapteDomToGitData()
    }
    
}

fetchGitData()
// setInterval(fetchGitData, 5000)



// tests

