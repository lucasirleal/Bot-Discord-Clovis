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
			.setThumbnail("https://i.imgur.com/GwpkHWZ.png")
			.setDescription(":small_orange_diamond: **SORTEIO DE JOGOS**\n" +
				":white_small_square: Saiba como funciona os sorteios de jogos. \n"+
				"\n" +
				"**Adquira seu cargo:**\n" +
			"Para ser notificado quando uma key for divulgada, clique na reação `" + emojiMap.sorteios+"`\n" +
				"\n" +
				"**Como funciona:**\n" +
				"Quando tivermos uma key pra doar, vamos notificar todo mundo com o cargo <@&705619867440513026>, divulgando a key aqui.\n" +
				"\n" +
				"**Ativando a key na steam:**\n" +
				"É só inserir ela [nesse link](https://store.steampowered.com/account/registerkey) e clicar continuar.");
		//Setting up reactions.
		var sentMessage = await message.channel.send(embed);
		sentMessage.react(emojiMap.sorteios);
		//Setting up the reaction listener.
		messageListener.sorteios[0].messageID = "" + sentMessage.id;
		//Writing to file.
		fs.writeFileSync(pathToJson2, JSON.stringify(messageListener));

		message.delete();
	}
};