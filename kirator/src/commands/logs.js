const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Logs a raid based on the Warcraftlogs link!'),
    async execute(interaction) {
        //ToDo: Parse Warcraftlog log
        //ToDo: Prepare it for an embed
        //ToDo: Post the embed
    },
};
