//Main dependencies.
const Discord    = require('discord.js');
const fs         = require('fs');
//JSON paths.
const path       = require('path');
const pathToJson = path.resolve(__dirname, '../JSON/config.json');

module.exports = {
	//Single command for displaying someones avatar.
	Display: function (message, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		//Constructing the base of the embed.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":frame_photo: Avatar")
			.setFooter(new Date().toLocaleString(), avatarURL);

		//If there is nothing after /avatar, we display our own picture.
		if (!message.mentions.users.size)
		{
			embed.setImage(message.author.displayAvatarURL())
		}
		//Or the person mentioned.
		else
		{
			var user = message.mentions.users.first();
			embed.setImage(user.displayAvatarURL());
        }

		//Picking random lines to make it a little better.
		var random = Math.random() * (100 - 0) + 0;

		     if (random < 20) { embed.setDescription("Esse aqui tá com cara de derrota, viu?"); }
		else if (random < 40) { embed.setDescription("Ai papai, que belezura é essa!"); }
		else if (random < 60) { embed.setDescription("Você não é rebelião de cadeia mas tá botando fogo no colchãozinho, hein?"); }
		else if (random < 80) { embed.setDescription("Fiu fiuuu"); }
			             else { embed.setDescription("Ordinááária!"); }

		return message.channel.send(embed);
	}
};