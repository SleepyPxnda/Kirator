module.exports = {
    query: `query reportById($report: String) {
        reportData {
            report(code: $report) {
                title
                startTime
                endTime
                code
                fights (killType: Encounters) {
                    difficulty
                    encounterID
                    averageItemLevel
                    bossPercentage
                    fightPercentage
                    friendlyPlayers
                    kill
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
                    encounters {
                        id
                        name
                    }
                }
                dpsParses: rankings(playerMetric: dps, compare: Parses)
                hpsParses: rankings(playerMetric: hps, compare: Parses)
            }
        }
    }`
}

