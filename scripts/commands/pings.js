//Main dependencies.
const Discord    = require('discord.js');
const fs         = require('fs');
//JSON paths.
const path       = require('path');
const pathToJson = path.resolve(__dirname, '../JSON/config.json');

module.exports = {

	//All different commands for a ping. We calculate it by subtracting the timestamp of the message creation from the current date.

	//Ping.
	Ping: function (message, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		var ping = Math.abs(Date.now() - message.createdTimestamp) + " ms";

		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.addField("Pong! Ou seria ping?  :ping_pong:", ping)
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.channel.send(embed);
	},
	//Pong.
	Pong: function (message, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		var ping = Math.abs(Date.now() - message.createdTimestamp) + " ms";

		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.addField("Ping! Não, não... acho que é pong agora.  :ping_pong:", ping)
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.channel.send(embed);
	},
	//Beep.
	Beep: function (message, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		var ping = Math.abs(Date.now() - message.createdTimestamp) + " ms";

		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.addField("Boop? Bo bo boop?  :ping_pong:", ping)
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.channel.send(embed);
	},
	//Boop.
	Boop: function (message, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		var ping = Math.abs(Date.now() - message.createdTimestamp) + " ms";

		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.addField("Beep. É isso aí, beep mesmo.  :ping_pong:", ping)
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.channel.send(embed);
	}
};