const { Client, Events, GatewayIntentBits } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if(TOKEN === undefined || CLIENT_ID === undefined){
    console.log("ENV Vars 'TOKEN' and 'CLIENT_ID' has to be specified")
    return
}

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    let command = null;

    switch (interaction.commandName){
        case "log":
            command = require("./commands/log");
            break;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isSelectMenu()) return;
    let select = null;

    try {
        await select.selectInteraction(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this select menu!', ephemeral: true });
    }
});

// Log in to Discord with your client's token
client.login(TOKEN);
