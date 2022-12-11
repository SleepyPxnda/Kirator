module.exports = {
    query : `query reportById($report: String) {
    reportData {
        report(code: $report) {
            title
            startTime
            endTime
            code
            fights {
                rating
                encounterID
                fightPercentage
                kill
                keystoneAffixes
                keystoneLevel
                keystoneTime
            }
            masterData {
                actors(type: "player") {
                    id
                    name
                    server
                    subType
                }
            }
            zone {
                name
                encounters {
                    id
                    name
                }
            }
        }
    }
}`
}
