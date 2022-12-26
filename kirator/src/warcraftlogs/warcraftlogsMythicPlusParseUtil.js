const utils = require("../util/util")

module.exports = {
    parseWarcraftLogsResponseToJson(json) {
        let result = {
            general: {},
            summary: {}
        };
        const report = json.data.reportData.report;

        //general information
        result.general.title = report.title;
        result.general.duration = utils.getDurationFromUnix(report.startTime, report.endTime);
        result.general.code = report.code;

        result.summary.keyLevel = report.fights[0].keystoneLevel;
        result.summary.dungeonName = report.zone.encounters.find(x => report.fights[0].encounterID === x.id).name;
        result.summary.players = report.masterData.actors.filter(x => x.subType !== "Unknown");
        result.summary.keyUpgrade = report.fights[0].keystoneBonus;

        return result;

    }
}
