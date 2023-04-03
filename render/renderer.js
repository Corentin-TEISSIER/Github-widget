// Informative message connection IPC established: Renderer -> Main
window.api.ipcRendererToMainConnected("Connection IPC : Renderer -> Main : OK")


// WINDOW RESIZEMENT
    // static big size
    bigSize = {
        x: 700, 
        y: 590
    }
    function resizeSmall() {
        const header = document.getElementById("bar-label")
        const signIn = document.getElementById("connection-button")
        size = {
            x: Math.max(header.offsetWidth, signIn.offsetWidth) + 25,
            y: Math.max(header.offsetHeight, signIn.offsetHeight) + 5
        }
        window.api.resizeWindow(size)
    }
    setTimeout(() => {
        resizeSmall()
    }, 100); 
    // TO DO : use resize function from preload
    const body = document.body
    body.addEventListener("mouseenter", () => {
        // const mainContainer = document.getElementById("widget-main-container")
        // size = {
        //     x: mainContainer.offsetHeight,
        //     y: mainContainer.offsetWidth
        // }
        // window.api.resizeWindow(size)
        window.api.resizeWindow(bigSize)
    })
    body.addEventListener("mouseleave", () => {
        resizeSmall()
    })

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

function modifyAvatar(){
    elementAvatar = document.getElementById("user-avatar")
    elementAvatar.href = currentGitData.userData.html_url
    avatar = document.getElementById("user-avatar-picture")
    avatar.src = currentGitData.userData.avatar
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
        repoLabel.id = repo.name + "-repo-history-label"
        repoLabel.style.display = "none"
        repoLabel.innerHTML = repo.name
        var link = document.createElement("img")
        link.id = repo.name + "repo-link"
        link.src = "../icon/external-link-white.png"
        link.alt = "link"
        link.addEventListener("mouseenter", () => {
            link.src = "../icon/external-link-bg.png"
        })
        link.addEventListener("mouseleave", () => {
            link.src = "../icon/external-link-white.png"
        })
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
            commit.className = "commit"
            var commitHeader = document.createElement("div")
            commitHeader.className = "commit-header"
            commitHeader.style.display = "flex"
            commitHeader.style.flexDirection = "row"
            
            var sha = document.createElement("div")
            sha.innerHTML = history.sha
            commitHeader.appendChild(sha)
            var linkCommit = document.createElement("div")
            linkCommit.className = "link-commit"
            linkCommit.addEventListener("mouseenter", () => {
                var extLink = document.getElementById(history.sha + "-link-external")
                extLink.src = "../icon/external-link-bg.png"
            })
            linkCommit.addEventListener("mouseleave", () => {
                var extLink = document.getElementById(history.sha + "-link-external")
                extLink.src = "../icon/external-link-white.png"
            })
            linkCommit.addEventListener("click", () => {
                window.api.openExternal(history.html_url)
            })
            var imgLinkCommit = document.createElement("img")
            imgLinkCommit.id = history.sha + "-link-external"
            imgLinkCommit.src = "../icon/external-link-white.png"
            imgLinkCommit.alt = "link"
            var commitMessage = document.createElement("div")
            commitMessage.className = "commit-message"
            commitMessage.id = history.sha + "-commit-message"
            commitMessage.innerHTML = history.message
            linkCommit.appendChild(imgLinkCommit)
            commitHeader.appendChild(linkCommit)
            commit.appendChild(commitHeader)
            commit.appendChild(commitMessage)
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
            const commitHistoryLabel = document.getElementById(repo.name + "-repo-history-label")
            commitHistoryLabel.style.display = "flex"
        })
    })
}

function addRepoToDom(repo){
    // add repo to repo list
    elementReposList = document.getElementById("user-repos-list")
    var repoLabel = document.createElement("a")
    repoLabel.href = repo.html_url
    repoLabel.innerHTML = repo.name
    repoLabel.id = repo.name + "-repo-label"
    repoLabel.addEventListener('click', (event) => {
        event.preventDefault()
        // window.api.openExternal(repoLabel.href)
    })
    elementReposList.appendChild(repoLabel)

    // Add repo commit list to commit history list
    var container = document.getElementById("commit-list-container")
    var repoLabel = document.createElement("div")
    repoLabel.className = "repo-history-label"
    repoLabel.id = repo.name + "-repo-history-label"
    repoLabel.style.display = "none"
    repoLabel.innerHTML = repo.name
    var link = document.createElement("img")
    link.id = repo.name + "repo-link"
    link.src = "../icon/external-link-white.png"
    link.alt = "link"
    link.addEventListener("mouseenter", () => {
        link.src = "../icon/external-link-bg.png"
    })
    link.addEventListener("mouseleave", () => {
        link.src = "../icon/external-link-white.png"
    })
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
        commit.className = "commit"
        var commitHeader = document.createElement("div")
        commitHeader.className = "commit-header"
        commitHeader.style.display = "flex"
        commitHeader.style.flexDirection = "row"
        
        var sha = document.createElement("div")
        sha.innerHTML = history.sha
        commitHeader.appendChild(sha)
        var linkCommit = document.createElement("div")
        linkCommit.className = "link-commit"
        linkCommit.addEventListener("mouseenter", () => {
            var extLink = document.getElementById(history.sha + "-link-external")
            extLink.src = "../icon/external-link-bg.png"
        })
        linkCommit.addEventListener("mouseleave", () => {
            var extLink = document.getElementById(history.sha + "-link-external")
            extLink.src = "../icon/external-link-white.png"
        })
        linkCommit.addEventListener("click", () => {
            window.api.openExternal(history.html_url)
        })
        var imgLinkCommit = document.createElement("img")
        imgLinkCommit.id = history.sha + "-link-external"
        imgLinkCommit.src = "../icon/external-link-white.png"
        imgLinkCommit.alt = "link"
        var commitMessage = document.createElement("div")
        commitMessage.className = "commit-message"
        commitMessage.id = history.sha + "-commit-message"
        commitMessage.innerHTML = history.message
        linkCommit.appendChild(imgLinkCommit)
        commitHeader.appendChild(linkCommit)
        commit.appendChild(commitHeader)
        commit.appendChild(commitMessage)
        commitList.appendChild(commit)
    })
    container.appendChild(commitList)
    linkRepoToCommitHistories()
}

function addCommitsToRepo(repoName, newCommitsArray){
    var commitList = document.getElementById(repoName + "-commit-history")
    var prevLastCommit = commitList.firstChild
    newCommitsArray.map(newCommit => {
        var commit = document.createElement("div")
        commit.className = "commit"
        var commitHeader = document.createElement("div")
        commitHeader.className = "commit-header"
        commitHeader.style.display = "flex"
        commitHeader.style.flexDirection = "row"
        
        var sha = document.createElement("div")
        sha.innerHTML = newCommit.sha
        commitHeader.appendChild(sha)
        var linkCommit = document.createElement("div")
        linkCommit.className = "link-commit"
        linkCommit.addEventListener("mouseenter", () => {
            var extLink = document.getElementById(newCommit.sha + "-link-external")
            extLink.src = "../icon/external-link-bg.png"
        })
        linkCommit.addEventListener("mouseleave", () => {
            var extLink = document.getElementById(newCommit.sha + "-link-external")
            extLink.src = "../icon/external-link-white.png"
        })
        linkCommit.addEventListener("click", () => {
            window.api.openExternal(newCommit.html_url)
        })
        var imgLinkCommit = document.createElement("img")
        imgLinkCommit.id = newCommit.sha + "-link-external"
        imgLinkCommit.src = "../icon/external-link-white.png"
        imgLinkCommit.alt = "link"
        var commitMessage = document.createElement("div")
        commitMessage.className = "commit-message"
        commitMessage.id = newCommit.sha + "-commit-message"
        commitMessage.innerHTML = newCommit.message
        linkCommit.appendChild(imgLinkCommit)
        commitHeader.appendChild(linkCommit)
        commit.appendChild(commitHeader)
        commit.appendChild(commitMessage)
        commitList.insertBefore(commit, prevLastCommit)
    })
}

function deleteRepo(repoName){
    // delete from repo list
    var repoList = document.getElementById("user-repos-list")
    var repoToRemove = document.getElementById(repoName + "-repo-label")
    repoList.removeChild(repoToRemove)
    // delete commit history
    var commitList = document.getElementById("commit-list-container")
    var commitHistoryLabelToRemove = document.getElementById(repoName + "-repo-history-label")
    var commitHistoryToRemove = document.getElementById(repoName + "-commit-history")
    commitList.removeChild(commitHistoryLabelToRemove) 
    commitList.removeChild(commitHistoryToRemove)
}

function adapteDomToGitData(){
    if(JSON.stringify(currentGitData) === JSON.stringify({})){
        // No current data -> need to fetch data
        window.alert("ERROR: No data fetched. Please verify you connection and token configuration")
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
            }
            else{
                // Some change made -> need to adapt the dom
                
                // Avatar change -> actually do nothing: the url of the avatar never change -> need to find a way to know when avatar change
                if(JSON.stringify(currentGitData.userData) !== JSON.stringify(prevGitData.userData) ){
                    window.alert("Update on avatar")
                    modifyAvatar()
                }

                // Repo list change
                if(JSON.stringify(currentGitData.userRepos) !== JSON.stringify(prevGitData.userRepos)){
                    currentGitData.userRepos.map( repo => {
                        const repoExist = prevGitData.userRepos.find(prevRepo => prevRepo.name === repo.name)
                        if(repoExist === undefined){ 
                            // Repo not found in previous git data -> need to add this new repo 
                            addRepoToDom(repo)
                        }
                        if(repoExist !== undefined && JSON.stringify(repoExist.commitsHistory) !== JSON.stringify(repo.commitsHistory)){
                            // Need to update repo's commit history
                            var newCommits = []
                            repo.commitsHistory.map( currentCommit => {
                                if(repoExist.commitsHistory.find(commit => currentCommit.sha === commit.sha) === undefined){
                                    newCommits.push(currentCommit)
                                }
                            })
                            addCommitsToRepo(repo.name, newCommits)
                        }
                    })
                    prevGitData.userRepos.map( repo => {
                        const repoExist = currentGitData.userRepos.find(currentRepo => currentRepo.name === repo.name)
                        if(repoExist === undefined){
                            // Repo has been deleted -> need to be deleted from the dom
                            deleteRepo(repo.name)
                        }
                    })
                }
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

function runApp() {
    fetchGitData()
    setInterval(fetchGitData, 10000)
}

runApp()




// tests

