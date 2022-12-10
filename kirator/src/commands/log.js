const { SlashCommandBuilder } = require('discord.js');
const wlUtil = require("../util/warcraftlogsRequestUtil")
const wlParseUtil = require("../util/warcraftlogsParseUtil");
const discordUtil = require("../util/discordUtil")

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
                )),
    async execute(interaction) {
        await interaction.deferReply();

        const data = await wlUtil.getDataForLog("Ktz4mT9g8XaZF6bn")

        const parsedData = wlParseUtil.parseWarcraftLogsResponseToJson(data);
        //console.log(JSON.stringify(parsedData))

        const embed = discordUtil.createEmbedFromRaidData(parsedData, interaction.options.getString('difficulty'))

        await interaction.editReply({embeds: [embed]})
    },
};
