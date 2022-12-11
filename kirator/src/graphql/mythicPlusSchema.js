module.exports = {
    query : `query reportById($report: String) {
        reportData {
            report(code: $report) {
                title
                startTime
                endTime
                code
                fights (killType: Encounters) {
                    rating
                    encounterID
                    averageItemLevel
                    fightPercentage
                    friendlyPlayers
                    kill
                    keystoneAffixes
                    keystoneLevel
                    keystoneTime
                    keystoneBonus
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
