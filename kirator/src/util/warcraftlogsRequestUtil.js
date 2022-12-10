let bearer = "";
const token_url = "https://www.warcraftlogs.com/oauth/token";
const graph_url = "https://www.warcraftlogs.com/api/v2/client"
let expiryDate = 0;

const query = require("../graphql/schema").query;

async function refreshToken() {
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

    bearer = json.access_token;
    console.log("Retrieved new token:", bearer.substring(0, 20));
}

module.exports = {
    async getDataForLog(logId){
        const report = logId;

        let response = await fetch(graph_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization' : 'Bearer ' + bearer
                },
                body: JSON.stringify({
                    query,
                    variables: { report }
                })
            }
        )

        if(response.status === 401){
            await refreshToken();
            console.log("Status was 401 Unauthorized")
            response = await fetch(graph_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization' : 'Bearer ' + bearer
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
}
