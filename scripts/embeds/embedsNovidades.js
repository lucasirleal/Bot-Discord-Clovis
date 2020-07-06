//Main dependencies.
const Discord       = require('discord.js');
const fs            = require('fs');
//JSON paths.
const path          = require('path');
const pathToJson1   = path.resolve(__dirname, '../JSON/config.json');
const pathToJson2   = path.resolve(__dirname, '../JSON/messageListener.json');
const pathToJson3   = path.resolve(__dirname, '../JSON/emojiMap.json');
//JSON objects.
var configs         = JSON.parse(fs.readFileSync(pathToJson1).toString());
var messageListener = JSON.parse(fs.readFileSync(pathToJson2).toString());
var emojiMap        = JSON.parse(fs.readFileSync(pathToJson3).toString());

module.exports = {
	Setup: async function (message) {
		//Single section.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setDescription(":warning: **Seja alertado quando chegarem novidades sobre o servidor, canal ou outras coisas importantes!**\n" +
				"\n" +
				"Nesta sala, você será notificado toda vez que postarmos alguma novidade por aqui ;) \n" +
				"Clique na reação para adicionar ou remover o cargo <@&729049075755778079> para receber as notificações. :loudspeaker:");
		//Setting up reactions.
		var sentMessage = await message.channel.send(embed);
		sentMessage.react(emojiMap.novidades);
		//Setting up the reaction listener.
		messageListener.novidades[0].messageID = "" + sentMessage.id;
		//Writing to file.
		fs.writeFileSync(pathToJson2, JSON.stringify(messageListener));

		message.delete();
	}
};