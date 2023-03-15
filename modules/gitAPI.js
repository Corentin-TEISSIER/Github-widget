const Octokit = require('octokit')

var octokit 

const initConnection = (token) => {
    try{
        octokit = new Octokit.Octokit({
            auth: token
        })
    }catch(error){
        console.log("Octokit connection failed")
        console.log("   error : " + error)
        console.log("   status : " + error.status)
    }
}

const testOcto = async () => {

    try{
        await octokit.request("GET /repos/{owner}/{repo}", {
            owner: "octocat",
            repo: "Spoon-Knife",
        });
    }
    catch(error){
        console.log("Octokit connection failed")
        console.log("   error : " + error)
        console.log("   status : " + error.status)
    }
}

const getUserData = async (username) => {
    const res = await octokit.request("GET /users/{username}", {
        username: username
    })
    const userData = {
        username: res.data.login,
        avatar: res.data.avatar_url,
        api_url: res.data.url,
        html_url: res.data.html_url
    }
    return userData
}

const getUserRepos = async (username) => {
    const res = await octokit.request("GET /search/repositories?q=user:{username}", {
        username: username,
    })

    var repos = []
    res.data.items.map( repo => {
        repos.push({
            name: repo.name,
            private: repo.private,
            html_url: repo.html_url,
            api_url: repo.url,
            commits_url: repo.commits_url
        })
    })
    return repos
}

const getCommitsHistoryFromRepo = async (username, repo) => {
    const res = await octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner: username,
        repo: repo
    })
    const repoCommitsHistory = []
    for(let i = 0; i<res.data.length; i++){
        const commit = {
            sha: res.data[i].sha,
            message: res.data[i].commit.message,
            api_url: res.data[i].url,
            html_url: res.data[i].html_url,
            author_name: res.data[i].commit.author.name,
            committer_name: res.data[i].commit.committer.name
        }
        repoCommitsHistory.push(commit)
    }
    return repoCommitsHistory
}

/**
 * This function has to be called with an 'await' 
 */
const fetchDataForApp = async (username) => {
    const userData = await getUserData(username)
    const userRepos = await getUserRepos(username)
    for(let i = 0; i<userRepos.length; i++){
        var repoCommitsHistory
        try{
            repoCommitsHistory = await getCommitsHistoryFromRepo(username, userRepos[i].name)
        }catch(error){
            console.log(error)
        }
        userRepos[i].commitsHistory = repoCommitsHistory
    }
    return {userData: userData, userRepos: userRepos}
}



module.exports = {
    initConnection,
    testOcto,
    getUserData,
    getUserRepos,
    getCommitsHistoryFromRepo,
    fetchDataForApp
}