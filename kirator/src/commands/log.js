const { SlashCommandBuilder } = require('discord.js');
const wlUtil = require("../warcraftlogs/warcraftlogsRequestUtil")
const wlRaidParseUtil = require("../warcraftlogs/warcraftlogsRaidParseUtil");
const wlMythicParseUtil = require("../warcraftlogs/warcraftlogsMythicPlusParseUtil")
const discordUtil = require("../util/discordUtil")

module.exports = {
    command: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Logs a raid based on the Warcraftlogs link!')
        .addStringOption(option =>
            option.setName("warcraft_logs_link").setDescription("Link for the log").setRequired(true))
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('decide if its a raid or a m+ log')
                .setRequired(true)
                .addChoices(
                    { name: 'Raid', value: 'mode_raid' },
                    { name: 'Dungeon', value: 'mode_dungeon' }
                ))
        .addStringOption(option =>
            option.setName('difficulty')
                .setDescription('content difficulty')
                .setRequired(true)
                .addChoices(
                    { name: 'Normal', value: 'diff_normal' },
                    { name: 'Heroic', value: 'diff_heroic' },
                    { name: 'Mythic', value: 'diff_mythic' },
                )),
    async execute(interaction) {
        await interaction.deferReply();

        const wlLink = interaction.options.getString("warcraft_logs_link")
        const wlCode = wlLink.split("/")[4]

        const difficulty = interaction.options.getString('difficulty');

        const mode = interaction.options.getString("mode")

        let embed;

        if(mode === "mode_raid") {
            const data = await wlUtil.getDataForLog(wlCode, true)

            const parsedData = wlRaidParseUtil.parseWarcraftLogsResponseToJson(data);

            embed = discordUtil.createEmbedFromRaidData(parsedData, difficulty);
        } else {
            const data = await wlUtil.getDataForLog(wlCode, false);

            const parsedData = wlMythicParseUtil.parseWarcraftLogsResponseToJson(data);

            embed = discordUtil.createEmbedFromMythicPlusData(parsedData);
        }

        await interaction.editReply({embeds: [embed]})
    },
};
