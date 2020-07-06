//Main dependencies.
const Discord    = require('discord.js');
const fs         = require('fs');
//JSON paths.
const path       = require('path');
const pathToJson = path.resolve(__dirname, '../JSON/config.json');

module.exports = {

	//Single command for the prefix swap of the bot.
	Change: function (message, args, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		if (!args.length) {
			//When prefix is null.
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: O bot não consegue ler sua mente... Digite um prefixo válido.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}
		else if (args.length > 1) {
			//When prefix is not unique.
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Você só pode digitar um prefixo!")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}
		//Changing the serialized JSON object.
		configs.prefix = args[0];
		//Writing to file.
		fs.writeFileSync(pathToJson, JSON.stringify(configs));
		//Returning a reply.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.setDescription(":white_check_mark: O prefixo do bot foi mudado para: '**" + args[0] + "**'.")
			.setFooter(new Date().toLocaleString(), avatarURL);

		return message.channel.send(embed);
    }
};