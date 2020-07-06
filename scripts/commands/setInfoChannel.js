//Main dependencies.
const Discord    = require('discord.js');
const fs         = require('fs');
//JSON paths.
const path       = require('path');
const pathToJson = path.resolve(__dirname, '../JSON/config.json');

module.exports = {
	//Single command for setting an info channel. Not to be confused with infoChannels, that will only update existing info channels.
	Set: function (message, args, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		//If arguments are not valid, we return a static response.
		if (!args.length || args.length != 2 || (args[0] != "membros" && args[0] != "canais"))
		{
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Você precisa digitar o tipo de canal com letras minúsculas [membros ou canais] e o ID do canal afetado.\n" +
					"Use **/chaninfo {nome do canal}** para pegar seu ID.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}

		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());
		//Changing the serialized object.
		if (args[0] === "membros")
		{
			configs.canalMembros = args[1];
		}
		else if (args[0] === "canais")
		{
			configs.canalCanais = args[1];
		}
		//Writing to file.
		fs.writeFileSync(pathToJson, JSON.stringify(configs));
		//Sending a response.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.setDescription(":white_check_mark: O canal de informação **[" + args[0].charAt(0).toUpperCase() + args[0].slice(1) + "]** foi mudado para o canal com ID: ```" + args[1] + "```")
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.channel.send(embed);
	}
};