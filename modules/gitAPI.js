const Octokit = require('octokit')
const testOcto = async (token) => {

    try{
        const octokit = new Octokit.Octokit({
            auth: token
        });
        
        const res = await octokit.request("GET /repos/{owner}/{repo}", {
            owner: "Corentin-TEISSIER",
            repo: "MS-labs",
        });

        console.log(res)
    }
    catch(error){
        console.log("error : " + error)
        console.log("status : " + error.status)
    }

}

module.exports = {
    testOcto
}