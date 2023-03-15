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

function updateAvatar(username, imgSrc, webLink){
    winsow.alert("coucou")
        elementAvatar = document.createElement("a")
        elementAvatar.id = "avatar-" + username
        elementAvatar.href = webLink
        var image = document.createElement("img")
        image.src = imgSrc
        elementAvatar.appendChild(image)
        document.getElementById("user-avatar").appendChild(elementAvatar)        
}

function adapteDomToGitData(){
    window.alert("enter")
    if(JSON.stringify(currentGitData) === JSON.stringify({})){
        window.alert("enter 1")
        // Error
    }
    else{
        if(JSON.stringify(prevGitData) === JSON.stringify({})){
            // First receive -> recursive creation in the dom
            window.alert("enter 2")
            updateAvatar(currentGitData.userData.username, currentGitData.userData.avatar, currentGitData.userData.html_url)
            
        }
        else{
            if(JSON.stringify(prevGitData) === JSON.stringify(currentGitData)){
                window.alert("enter 3")
                // DO nothing -> no change
            }
            else{
                window.alert("enter 4")
                // Compare currentGitData with prevGitData and update dom
            }
        }
    }
}

async function fetchGitData(){

    if(isConnected()){
        prevGitData = currentGitData
        currentGitData = await window.git.getGitData().then( res => {
            currentGitData = res; adapteDomToGitData()
        })
    
        // adapteDomToGitData()
    }
    
}

fetchGitData()
// setInterval(fetchGitData, 5000)



// tests

