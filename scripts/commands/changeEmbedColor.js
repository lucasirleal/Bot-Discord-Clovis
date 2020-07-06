//Main dependencies.
const Discord    = require('discord.js');
const fs         = require('fs');
//JSON paths.
const path       = require('path');
const pathToJson = path.resolve(__dirname, '../JSON/config.json');

module.exports = {

	//Single command for the embed color swap of the bot.
	Change: function (message, args, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		if (!args.length) {
			//When color is null.
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Você precisa digitar uma cor em HEX sem as hashtags.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}
		else if (args.length > 1) {
			//When color is not unique.
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Você só pode digitar um código HEX.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}

		//REGEX for a valid HEX code.
		var re = /[0-9A-Fa-f]{6}/g;
		//Testing with the regex.
		if (!re.test(args[0])) {
			//This only falls if the hex is not valid.
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Você precisa digitar uma cor em HEX sem as hashtags.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}

		//Changing the serialized JSON object.
		configs.embedColor = "#" + args[0];

		//Writing to file.
		fs.writeFileSync(pathToJson, JSON.stringify(configs));
		//Returning a reply.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.setDescription(":white_check_mark: A cor dos embeds foi mudada para: '**" + args[0] + "**'.")
			.setFooter(new Date().toLocaleString(), avatarURL);

		return message.channel.send(embed);
    }
};