const { REST, Routes } = require('discord.js');
const fs = require("fs");
const logCommand = require("../commands/log")

module.exports = {
    async deployCommands() {
        const TOKEN = process.env.TOKEN;
        const CLIENT_ID = process.env.CLIENT_ID;
        const GUILD_ID = process.env.GUILD_ID;

        if(TOKEN === undefined || CLIENT_ID === undefined || GUILD_ID === undefined){
            console.log("ENV Var 'TOKEN', 'GUILD_ID' and 'CLIENT_ID' needs to be specified")
            return
        }

        const commands = [
            logCommand.command.toJSON()
        ];

        // Construct and prepare an instance of the REST module
        const rest = new REST({ version: '10' }).setToken(TOKEN);

        // and deploy your commands!
        await (async () => {
            try {
                console.log(`Started refreshing ${commands.length} application (/) commands.`);

                // The put method is used to fully refresh all commands in the guild with the current set
                const data = await rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                    {body: commands},
                );

                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            } catch (error) {
                // And of course, make sure you catch and log any errors!
                console.error(error);
            }

            const data = await rest.get(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID))
            console.log("Result:", data)
        })();
    }
}


