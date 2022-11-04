const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Logs a raid based on the Warcraftlogs link!')
        .addStringOption(option =>
            option.setName("warcraft_logs_link").setDescription("Link for the log").setRequired(true)),
    async execute(interaction) {
        //ToDo: Parse Warcraftlog log
        //ToDo: Prepare it for an embed
        //ToDo: Post the embed
        console.log("test 1")
        interaction.reply("This was the Log command")
    },
};
