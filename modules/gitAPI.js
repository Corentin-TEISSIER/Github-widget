const Octokit = require('octokit')

var octokit 

// const initConnection = (token) => {
    try{
        octokit = new Octokit.Octokit({
            // auth: token
        }); 
    }catch(error){
        console.log(error)
    }
// }

const testOcto = async (username, token) => {

    try{
        const res = await octokit.request("GET /repos/{owner}/{repo}", {
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

const getUserRepos = async (username) => {
    const res = await octokit.request("GET /users/{username}/repos", {
        username: username,
    })

    console.log("REPOS:")
    res.data.map(repo => {
        console.log("   name: ", repo. name)
        console.log("   private: ", repo.private)
    })
}

module.exports = {
    // initConnection,
    testOcto,
    getUserRepos,
}