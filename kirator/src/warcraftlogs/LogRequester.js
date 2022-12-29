const {query: raidQuery} = require("../graphql/raidSchema");
const {query: mythicQuery} = require("../graphql/mythicPlusSchema");

class LogRequester {

    constructor(logId) {
        this.logId = logId;
        this.bearer = "";
    }

    async requestRaidData() {
        return await requestData(this.logId, true)
    }

    async requestMPlusData() {
        return await requestData(this.logId, true)
    }
}

async function requestData(logId, isRaid){
    const report = logId;
    let query = isRaid ? raidQuery : mythicQuery;

    let response = await fetch(graph_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization' : 'Bearer ' + this.bearer
            },
            body: JSON.stringify({
                query,
                variables: { report }
            })
        }
    )

    if(response.status === 401){
        console.log("Status was 401 Unauthorized")
        await refreshToken();
        response = await fetch(graph_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization' : 'Bearer ' + this.bearer
                },
                body: JSON.stringify({
                    query,
                    variables: { report }
                })
            }
        )
    }
    return response.json();
}
async function refreshToken(){
    const WL_CLIENT_ID = process.env.WL_CLIENT_ID;
    const WL_CLIENT_SECRET = process.env.WL_CLIENT_SECRET;

    const response = await fetch(token_url, {
            method: 'POST',
            body: 'grant_type=client_credentials&client_id=' + WL_CLIENT_ID + '&client_secret=' + WL_CLIENT_SECRET,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    )
    const json = await response.json();

    this.bearer = json.access_token;
    console.log("Retrieved new token:", this.bearer.substring(0, 20));
}

module.exports = LogRequester;
