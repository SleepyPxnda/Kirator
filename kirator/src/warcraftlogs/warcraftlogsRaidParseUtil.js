const utils = require("../util/util")
function getDpsParseList(dpsParses) {
    let dpsList = [];

    dpsParses.forEach(parse => {
        parse.roles.dps.characters.forEach(char => {
            let charInDpsList = dpsList.find(x => x.name === char.name)

            if(!charInDpsList){
                dpsList.push({
                    name: char.name,
                    class: char.class,
                    spec: char.spec,
                    participatedFights: 1,
                    dpsComputedPercentage: char.bracketPercent,
                    overallDps: char.amount
                })
            } else {
                charInDpsList.participatedFights += 1;
                charInDpsList.dpsComputedPercentage += char.bracketPercent;
                charInDpsList.overallDps += char.amount;
            }
        })
    })

    dpsList.forEach(dps => {
        dps.dpsComputedPercentage = Math.round(dps.dpsComputedPercentage / dps.participatedFights)
        dps.overallDps = Math.round(dps.overallDps / dps.participatedFights);
    });

    return dpsList;
}
function getHealerParseList(hpsParses) {
    let healerList = [];

    hpsParses.forEach(parse => {
        parse.roles.healers.characters.forEach(char => {
            let healerInHpsList = healerList.find(x => x.name === char.name)

            if(!healerInHpsList){
                healerList.push({
                    name: char.name,
                    class: char.class,
                    spec: char.spec,
                    participatedFights: 1,
                    hpsComputedPercentage: char.bracketPercent,
                    overallHps: char.amount
                })
            } else {
                healerInHpsList.participatedFights += 1;
                healerInHpsList.hpsComputedPercentage += char.bracketPercent;
                healerInHpsList.overallHps += char.amount;
            }
        })
    })

    healerList.forEach(healer => {
        healer.hpsComputedPercentage = Math.round(healer.hpsComputedPercentage / healer.participatedFights);
        healer.overallHps = Math.round(healer.overallHps / healer.participatedFights);
    });

    return healerList;
}
function getTankParseList(dpsParses, hpsParses){
    let tankList = [];

    dpsParses.forEach(parse => {
        parse.roles.tanks.characters.forEach(char => {
            let tankInList = tankList.find(x => x.name === char.name)

            if(!tankInList){
                tankList.push({
                    name: char.name,
                    class: char.class,
                    spec: char.spec,
                    participatedFights: 1,
                    dpsComputedPercentage: char.bracketPercent,
                    hpsComputedPercentage: 0
                })
            } else {
                tankInList.participatedFights += 1;
                tankInList.dpsComputedPercentage += char.bracketPercent
            }
        })
    })

    hpsParses.forEach(parse => {
        parse.roles.tanks.characters.forEach(char => {
            let tankInList = tankList.find(x => x.name === char.name)
            if(tankInList){
                tankInList.hpsComputedPercentage += char.bracketPercent
            }
        })
    })

    tankList.forEach(tank => {
        tank.dpsComputedPercentage = Math.round(tank.dpsComputedPercentage / tank.participatedFights);
        tank.hpsComputedPercentage = Math.round(tank.hpsComputedPercentage / tank.participatedFights);
    })

    return tankList;
}
function getFightData(fights){
    let fightSummary = [];

    fights
        .filter(fight => fight.difficulty !== null)
        .forEach(fight => {
        let fightInSummary = fightSummary.find(x=> x.encounterID === fight.encounterID);

        if(!fightInSummary){
            fightSummary.push({
                encounterID: fight.encounterID,
                kill: fight.kill,
                tries: 1,
                bestFightPercentage: fight.fightPercentage,
            })
        } else {
            fightInSummary.tries += 1;

            if(fight.fightPercentage <= fightInSummary.bestFightPercentage){
                fightInSummary.bestFightPercentage = Math.floor(fight.fightPercentage);
            }

            if(fight.kill){
                fightInSummary.kill = true;
            }
        }
    })

    return fightSummary;
}

module.exports = {
    parseWarcraftLogsResponseToJson(json) {
      let result = {
          general: {},
          parses: {},
          fights: {}
      };

      const report = json.data.reportData.report;

      if(report.dpsParses.data.length === 0 || report.hpsParses.data.length === 0){
          return new Error("No parse data found for report");
      }

      //general information
      result.general.title = report.title;
      result.general.duration = utils.getDurationFromUnix(report.startTime, report.endTime);
      result.general.code = report.code;

      //parses for different roles
      result.parses.dps = getDpsParseList(report.dpsParses.data);
      result.parses.healer = getHealerParseList(report.hpsParses.data);
      result.parses.tanks = getTankParseList(report.dpsParses.data, report.hpsParses.data);

      //fights
      result.fights = getFightData(report.fights);

      //populate each element with the name of the encounter
      result.fights.forEach(fight => {
          const bossName = report.zone.encounters.find(encounter => encounter.id === fight.encounterID);
          fight.bossName = bossName ? bossName.name : undefined;
      })

      return result;
    },
    parseWarcraftLogsResponseToJsonWithoutParses(json){
        let result = {
            general: {},
            fights: {},
            attendees: {}
        };

        const report = json.data.reportData.report;

        //general information
        result.general.title = report.title;
        result.general.duration = utils.getDurationFromUnix(report.startTime, report.endTime);
        result.general.code = report.code;

        //fights
        result.fights = getFightData(report.fights);

        result.attendees = report.masterData.actors;

        //populate each element with the name of the encounter
        result.fights.forEach(fight => {
            const bossName = report.zone.encounters.find(encounter => encounter.id === fight.encounterID);
            fight.bossName = bossName ? bossName.name : undefined;
        })



        return result;
    }
}
