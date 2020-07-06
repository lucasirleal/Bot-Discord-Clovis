//Main dependencies.
const Discord    = require('discord.js');
const fs         = require('fs');
//JSON paths.
const path       = require('path');
const pathToJson = path.resolve(__dirname, '../JSON/config.json');

module.exports = {
	//Single command for the channel info.
	GetChannelInfo: function (message, args, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		//If no argument is present, we'll get the channel info for the current channel.
		if (!args.length) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setTitle(":satellite: Bip bop, carregando informações...")
				.setDescription("```Canal atual: " + message.channel.id + "```")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}
		//Getting information for specific channels.
		var text = "";

		for (i = 0; i < args.length; i++) {
			//Building up the channel name.
			text += args[i];
			if (i != args.length - 1) {
				text += " ";
			}
		}
		//Building and sending the response.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.setTitle(":satellite: Bip bop, carregando informações...")
			.setDescription("```Canal " + text.toLowerCase() + ": " + message.guild.channels.cache.find(ch => ch.name.toLowerCase() == text.toLowerCase()) + "```")
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.channel.send(embed);
	}
};