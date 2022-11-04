const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('signup')
        .setDescription('signs up for the raiders list')
        .addSubcommand(subcommand  => subcommand.setName("add").setDescription("brings up an selection menu and adds you to the raiders list"))
        .addSubcommand(subcommand  => subcommand.setName("leave").setDescription("removes you from the raiders list")),
    async execute(interaction) {
        console.log("test")
        interaction.reply("This was the Signup command")
    },
};
