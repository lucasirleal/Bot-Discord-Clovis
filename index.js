//Starts discord.
const Discord         = require('discord.js');
const client          = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
//Main dependencies.
var { token }         = require('./scripts/JSON/config.json');
const CommandHandler  = require('./scripts/commandHandler.js');
const ReactionHandler = require('./scripts/reactionHandler.js');
const InfoChannels    = require('./scripts/commands/infoChannels.js');

//Runs once when the bot starts.
client.once('ready', () => {
	console.log('Clóvis, o sapo was started.');

	//Defines a timeout of 5 minutes to execute all functions listed.
	setInterval(function () {
		InfoChannels.Update(client, false); //Updates the "Membros" and "Canais" count.
	}, 5 * 60000);
});

//Runs everytime someone sends a message on any channel.
client.on('message', message => {
	//Calls the command handlers that calls all other scripts.
	CommandHandler.HandleMessage(message, client);
});

//Runs everytime someone ADDS a reaction to any message on any channel.
client.on('messageReactionAdd', async (reaction, user) => {
	// When we receive a reaction we check if the reaction is partial or not.
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle.
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null.
			return;
		}
	}

	//Declines if the reaction was made by a bot.
	if (user.bot) { return; }

	//Passes the commands to the respective handler.
	ReactionHandler.HandleReactionAdd(reaction, user, client);
});

//Runs everytime a guild member is added.
client.on('guildMemberAdd', member => {
	InfoChannels.Update(client, false); //Updates the "Membros" and "Canais" count.
});

//Runs everytime a guild member is removed.
client.on('guildMemberRemove', member => {
	InfoChannels.Update(client, false); //Updates the "Membros" and "Canais" count.
});

//Logins with the bot token.
client.login(token);