const {EmbedBuilder} = require("discord.js");
function getColorFromDifficulty(difficulty){
    switch (difficulty){
        case "diff_normal":
            return "#1EFF0C"
        case "diff_heroic":
            return "#0070FF"
        case "diff_mythic":
            return "#A335EE"
    }
}
function getIconForClass(className){
    switch(className.toLowerCase()){
        case "warrior":
            return "<:ClassIcon_warrior:1038504922225844265>";
        case "warlock":
            return "<:ClassIcon_warlock:1038504923861618840>";
        case "rogue":
            return "<:ClassIcon_rogue:1038504927015743508>";
        case "demonhunter":
            return "<:ClassIcon_demon_hunter:1038504919897997414>";
        case "deathknight":
            return "<:ClassIcon_deathknight:1038504921189863455>";
        case "hunter":
            return "<:ClassIcon_hunter:1038504934481596457>";
        case "priest":
            return "<:ClassIcon_priest:1038504928114651277>";
        case "shaman":
            return "<:ClassIcon_shaman:1038504925405118476>";
        case "mage":
            return "<:ClassIcon_mage:1038504933202346054>";
        case "monk":
            return "<:ClassIcon_monk:1038504931386216458>";
        case "druid":
            return "<:ClassIcon_druid:1038504935869919393>";
        case "paladin":
            return "<:ClassIcon_paladin:1038504929775587328>";
        case "evoker":
            return "🐉"
        default:
            return "<:read_the_error:508733110154690560>";
    }
}
function getEmbedValueStringForFight(fight){
    if(fight.tries === 1 && fight.kill){
        return "⭐"
    }

    if(!fight.kill) {
        return fight.bestFightPercentage + " %"
    }

    if(fight.kill){
        return "✅"
    }
}
function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

function getIconForParseScore(score){
    switch (true){
        case (score <= 25):
            return "<:small_gray_diamond:923596714609348638>"
        case (score > 25 && score <= 50):
            return "<:small_green_diamond:923596714449989692>"
        case (score > 50 && score <= 75):
            return "<:small_blue_diamond:923596714500300820>"
        case (score > 75 && score < 98):
            return "<:small_purple_diamond:923597523829014588>"
        case (score >= 98):
            return "<:small_yellow_diamond:923596992888848504>"
        default:
            return "X"
    }
}

module.exports = {
    createEmbedFromRaidData(raidData, difficulty) {
        let embed = new EmbedBuilder()
            .setColor(getColorFromDifficulty(difficulty))
            .setTitle(raidData.general.title + " | " + raidData.general.duration)
            .setTimestamp()
            .setAuthor({name: "<RI> Raid Log"})
            .setFooter({ text: raidData.general.code})

        embed.addFields(
            {
                name: "**BOSS**",
                value: raidData.fights.map(fight => fight.bossName ?? "unknown").join("\n"),
                inline: true
            },
            {name: "**TRIES**", value: raidData.fights.map(fight => fight.tries).join("\n"), inline: true},
            {name: "**KILL**", value: raidData.fights.map(getEmbedValueStringForFight).join("\n"), inline: true}
        )

        let dpsArrays = sliceIntoChunks(raidData.parses.dps.sort((a,b) => b.overallDps - a.overallDps), 5);

        embed.addFields(
            {
                name: "(Ov.DPS) DPS", value: dpsArrays[0]
                    .map(dps =>
                        (dps.overallDps / 1000).toFixed(1)
                        + "k -"
                        + getIconForParseScore(dps.dpsComputedPercentage)
                        + " "
                        + getIconForClass(dps.class)
                        + " "
                        + dps.name).join("\n"), inline: true
            },
            {
                name: "(DPS/HPS) Tanks", value: raidData.parses.tanks
                    .sort((a,b) => b.dpsComputedPercentage - a.dpsComputedPercentage)
                    .map(tank =>
                        getIconForParseScore(tank.dpsComputedPercentage)
                        + " "
                        + getIconForParseScore(tank.hpsComputedPercentage)
                        + " "
                        + getIconForClass(tank.class)
                        + " "
                        + tank.name).join("\n"), inline: true
            },
            {
                name: "(HPS) Healers", value: raidData.parses.healer
                    .sort((a,b) => b.overallHps - a.overallHps)
                    .map(healer =>
                        (healer.overallHps / 1000).toFixed(1)
                        + "k -"
                        + getIconForParseScore(healer.hpsComputedPercentage)
                        + " "
                        + getIconForClass(healer.class)
                        + " "
                        + healer.name).join("\n"), inline: true
            }
        );

        if(dpsArrays.length > 1){
            for(let i = 1; i < dpsArrays.length; i++){
                embed.addFields(
                    {
                        name: "(Ov.DPS) DPS " + (i + 1), value: dpsArrays[i]
                            .map(dps =>
                                (dps.overallDps / 1000).toFixed(1)
                                + "k -"
                                + getIconForParseScore(dps.dpsComputedPercentage)
                                + " "
                                + getIconForClass(dps.class)
                                + " "
                                + dps.name).join("\n"), inline: false
                    });
            }
        }

        //Add Links to helpful websites
        embed.addFields({name: "Useful links", value: "https://www.warcraftlogs.com/reports/" + raidData.general.code + " \n"
                + "https://www.wipefest.gg/report/" + raidData.general.code + " \n"
                + "https://wowanalyzer.com/report/" + raidData.general.code + " \n", inline: false})

        return embed;
    },
    createEmbedFromMythicPlusData(mythicData){
        let embed = new EmbedBuilder()
            .setColor(getColorFromDifficulty("diff_mythic"))
            .setTitle(mythicData.general.title + " | " + mythicData.general.duration)
            .setTimestamp()
            .setAuthor({name: "<RI> Mythic+ Log"})
            .setFooter({ text: mythicData.general.code})

        embed.addFields({name: "Dungeon", value: mythicData.summary.dungeonName, inline: true},
            {name: "Level", value: mythicData.summary.keyLevel.toString(), inline: true},
            {name: "Upgrade", value: "+ " + mythicData.summary.keyUpgrade, inline: true});

        embed.addFields({name: "Group", value: mythicData.summary.players.map(x => getIconForClass(x.subType)  + " " + x.name ).join("\n"), inline: false})

        return embed;
    },
    createEmbedFromReducedRaidData(raidData, difficulty){
        let embed = new EmbedBuilder()
            .setColor(getColorFromDifficulty(difficulty))
            .setTitle(raidData.general.title + " | " + raidData.general.duration)
            .setTimestamp()
            .setAuthor({name: "<RI> Raid Log"})
            .setFooter({ text: raidData.general.code})

        embed.addFields(
            {
                name: "**BOSS**",
                value: raidData.fights.map(fight => fight.bossName ?? "unknown").join("\n"),
                inline: true
            },
            {name: "**TRIES**", value: raidData.fights.map(fight => fight.tries).join("\n"), inline: true},
            {name: "**KILL**", value: raidData.fights.map(getEmbedValueStringForFight).join("\n"), inline: true}
        )

        let attendeesArray = sliceIntoChunks(raidData.attendees.sort((a,b) => b.id - a.id), 5);

        embed.addFields(
            {
                name: "Attendees",
                value: attendeesArray[0]
                    .map(dps =>
                        getIconForClass(dps.subType)
                        + " "
                        + dps.name).join("\n"),
                inline: false
            }
        );

        if(attendeesArray.length > 1){
            for(let i = 1; i < attendeesArray.length; i++){
                embed.addFields(
                    {
                        name: "Attendees " + (i + 1), value: attendeesArray[i]
                            .map(dps =>
                                getIconForClass(dps.subType)
                                + " "
                                + dps.name).join("\n"), inline: false
                    });
            }
        }

        //Add Links to helpful websites
        embed.addFields({name: "Useful links", value: "https://www.warcraftlogs.com/reports/" + raidData.general.code + " \n"
                + "https://www.wipefest.gg/report/" + raidData.general.code + " \n"
                + "https://wowanalyzer.com/report/" + raidData.general.code + " \n", inline: false})

        embed.addFields({name: "Remarks", value:" This log only shows reduced data, due to some missing information from warcraftlogs", inline: false})

        return embed;
    }
}
