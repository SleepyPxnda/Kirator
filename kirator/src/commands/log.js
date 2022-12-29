const { SlashCommandBuilder } = require('discord.js');
const wlUtil = require("../warcraftlogs/warcraftlogsRequestUtil")
const wlRaidParseUtil = require("../warcraftlogs/warcraftlogsRaidParseUtil");
const wlMythicParseUtil = require("../warcraftlogs/warcraftlogsMythicPlusParseUtil")
const discordUtil = require("../util/discordUtil")
const logRequester = require("../warcraftlogs/LogRequester")

module.exports = {
    command: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Logs a raid based on the Warcraftlogs link!')
        .addStringOption(option =>
            option.setName("warcraft_logs_link").setDescription("Link for the log").setRequired(true))
        .addStringOption(option =>
            option.setName('difficulty')
                .setDescription('content difficulty')
                .setRequired(true)
                .addChoices(
                    { name: 'Normal', value: 'diff_normal' },
                    { name: 'Heroic', value: 'diff_heroic' },
                    { name: 'Mythic', value: 'diff_mythic' },
                ))
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('decide if its a raid or a m+ log')
                .setRequired(false)
                .addChoices(
                    { name: 'Raid', value: 'mode_raid' },
                    { name: 'Dungeon', value: 'mode_dungeon' }
                )),
    async execute(interaction) {
        await interaction.deferReply();

        const wlLink = interaction.options.getString("warcraft_logs_link");
        const wlCode = wlLink.split("/")[4];

        const difficulty = interaction.options.getString('difficulty');

        const mode = interaction.options.getString("mode");

        const requester = new logRequester(wlCode);

        let embed;

        if(mode === "mode_dungeon") {
            const data = await requester.requestMPlusData();

            const parsedData = wlMythicParseUtil.parseWarcraftLogsResponseToJson(data);

            embed = discordUtil.createEmbedFromMythicPlusData(parsedData);
        } else {
            const data = await requester.requestRaidData();

            let parsedData = wlRaidParseUtil.parseWarcraftLogsResponseToJson(data);

            if(parsedData instanceof Error){
                parsedData = wlRaidParseUtil.parseWarcraftLogsResponseToJsonWithoutParses(data);
                embed = discordUtil.createEmbedFromReducedRaidData(parsedData, difficulty);
                await interaction.editReply({embeds: [embed]})
                return;
            }

            embed = discordUtil.createEmbedFromRaidData(parsedData, difficulty);
            await interaction.editReply({embeds: [embed]})

        }

    },
};
