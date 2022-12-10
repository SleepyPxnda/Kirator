function getRaidDuration(startUnix, endUnix) {
    const difference = Math.abs(endUnix - startUnix);

    let seconds = Math.floor((difference / 1000) % 60),
        minutes = Math.floor((difference / (1000 * 60)) % 60),
        hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}
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
                    dpsComputedPercentage: char.bracketPercent
                })
            } else {
                charInDpsList.participatedFights += 1;
                charInDpsList.dpsComputedPercentage += char.bracketPercent
            }
        })
    })

    dpsList.forEach(dps => dps.dpsComputedPercentage = Math.round(dps.dpsComputedPercentage / dps.participatedFights));

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
                    hpsComputedPercentage: char.bracketPercent
                })
            } else {
                healerInHpsList.participatedFights += 1;
                healerInHpsList.hpsComputedPercentage += char.bracketPercent
            }
        })
    })

    healerList.forEach(healer => healer.hpsComputedPercentage = Math.round(healer.hpsComputedPercentage / healer.participatedFights));

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
          summary: {},
          parses: {},
          fights: {}
      };

      let errors = [];

      const report = json.data.reportData.report;

      //general information
      result.general.title = report.title;
      result.general.duration = getRaidDuration(report.startTime, report.endTime);
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
    }
}
