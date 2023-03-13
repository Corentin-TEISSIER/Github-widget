const Octokit = require('octokit')

var octokit 

const initConnection = (token) => {
    try{
        octokit = new Octokit.Octokit({
            auth: token
        })
        console.log("Octokit is functionnal")
    }catch(error){
        console.log("Octokit connection failed")
        console.log("   error : " + error)
        console.log("   status : " + error.status)
    }
}

const testOcto = async (username, token) => {

    try{
        await octokit.request("GET /repos/{owner}/{repo}", {
            owner: "octocat",
            repo: "Spoon-Knife",
        });
        console.log("Octokit is functionnal")
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
    res.data.map( commits => {
        const commit = {
            sha: commits.sha,
            message: commits.commit.message,
            api_url: commits.url,
            html_url: commits.html_url,
            author_name: commits.author.login,
            committer_name: commits.committer.login
        }
        repoCommitsHistory.push(commit)
    })
    console.log(repoCommitsHistory)
}


module.exports = {
    initConnection,
    testOcto,
    getUserData,
    getUserRepos,
    getCommitsHistoryFromRepo
}