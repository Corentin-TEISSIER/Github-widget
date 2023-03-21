// Informative message connection IPC established: Renderer -> Main
window.api.ipcRendererToMainConnected("Connection IPC : Renderer -> Main : OK")


// WINDOW RESIZEMENT
    // TO DO : use resize function from preload


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
    var userAvatar = document.getElementById("user-avatar")
    elementAvatar = document.createElement("a")
    elementAvatar.id = "user-avatar-href"
    elementAvatar.href = currentGitData.userData.html_url
    var userImage = document.createElement("img")
    userImage.id = "user-avatar-picture"
    userImage.src = currentGitData.userData.avatar
    elementAvatar.appendChild(userImage)
    elementAvatar.addEventListener('click', (event) => {
        event.preventDefault()
        window.api.openExternal(elementAvatar.href)
    })
    userAvatar.appendChild(elementAvatar)
}

function updateRepoList(){
    elementReposList = document.getElementById("user-repos-list")
    currentGitData.userRepos.map( repo => {
        var repoLabel = document.createElement("a")
        repoLabel.href = repo.html_url
        repoLabel.innerHTML = repo.name
        repoLabel.id = repo.name + "-repo-label"
        repoLabel.addEventListener('click', (event) => {
            event.preventDefault()
            // window.api.openExternal(repoLabel.href)
        })
        elementReposList.appendChild(repoLabel)
    })
}

function updateRepoCommits(){
    var container = document.getElementById("commit-list-container")
    currentGitData.userRepos.map( repo => {
        var repoLabel = document.createElement("div")
        repoLabel.className = "repo-history-label"
        repoLabel.id = repo.name + "repo-history-label"
        repoLabel.style.display = "none"
        repoLabel.innerHTML = repo.name
        var link = document.createElement("img")
        link.id = repo.name + "repo-link"
        link.src = "../icon/external-link.png"
        link.alt = "link"
        link.addEventListener("click", () => {
            window.api.openExternal(repo.html_url)
        })
        repoLabel.appendChild(link)
        container.appendChild(repoLabel)
        var commitList = document.createElement("div")
        commitList.className = "commit-history"
        commitList.id = repo.name + "-commit-history"
        commitList.style.display = "none"
        repo.commitsHistory.map( history => {
            var commit = document.createElement("div")
            commit.class = "commit"
            var commitHeader = document.createElement("div")
            commitHeader.className = "commit-header"
            commitHeader.style.display = "flex"
            commitHeader.style.flexDirection = "row"
            
            var sha = document.createElement("div")
            sha.innerHTML = history.sha
            commitHeader.appendChild(sha)
            var linkCommit = document.createElement("div")
            linkCommit.className = "link-commit"
            var imgLinkCommit = document.createElement("img")
            imgLinkCommit.src = "../icon/external-link.png"
            imgLinkCommit.alt = "link"
            linkCommit.appendChild(imgLinkCommit)
            commitHeader.appendChild(linkCommit)
            commit.appendChild(commitHeader)
            
            commitList.appendChild(commit)
        })
        container.appendChild(commitList)
    })
}

function linkRepoToCommitHistories(){
    currentGitData.userRepos.map( repo => {
        const repoButton = document.getElementById(repo.name + "-repo-label")
        repoButton.addEventListener("click", () => {
            const histories = document.getElementsByClassName("commit-history")
            Array.prototype.slice.call(histories).map( history => {
                history.style.display = "none"
            })
            const historiesLabels = document.getElementsByClassName("repo-history-label")
            Array.prototype.slice.call(historiesLabels).map( historyLabel => {
                historyLabel.style.display = "none"
            })
            const commitHistory = document.getElementById(repo.name + "-commit-history")
            commitHistory.style.display = "flex"
            const commitHistoryLabel = document.getElementById(repo.name + "repo-history-label")
            commitHistoryLabel.style.display = "flex"
        })
    })
}

function adapteDomToGitData(){
    if(JSON.stringify(currentGitData) === JSON.stringify({})){
        // No current data -> need to fetch data
        window.alert("1")
    }
    else{
        if(JSON.stringify(prevGitData) === JSON.stringify({})){
            // First fetch -> adapte the entire dom
            updateAvatar()
            updateRepoList()
            updateRepoCommits()
            linkRepoToCommitHistories()
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

