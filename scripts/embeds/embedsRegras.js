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
			.setThumbnail("https://cdn.discordapp.com/attachments/303232406691774464/624996017804410881/AVATAR-MAX_PALARO.png")
			.setDescription(":woman_judge: **Regras**\n" +
				"\n" +
				":small_orange_diamond: Olá! Seja bem vinde ao servidor **MaxPalaro** !\n" +
				"Criamos as regras para que tenhamos um ambiente tranquilo, por favor, leia atentamente: \n" +
				"\n" +
				"```• Tenha bom senso: \n" +
				"- Qualquer discurso homofóbico, racista, misógino, xenofóbico, transfóbico é punido com permaban. Tente também não levantar discussões políticas ou militâncias desnecessárias.\n" +
				"\n" +
				"• Não faça spam!\n" +
				"- Spam é tudo que é chato: divulgação, enviar muitas mensagens, emojis ou símbolos em um curto período, pedir admin ou cargos, entre outros\n" +
				"\n" +
				"• Respeite a Staff: \n" +
				"- Sempre que alguém da staff te der um aviso, respeite. Vamos evitar confusão e punições desnecessárias!\n" +
				"\n" +
				"• Não mencione atoa: \n" +
				"- Não mencione ninguém sem motivo, principalmente cargos da Staff. As pessoas param o que estão fazendo para visualizar menções!```\n" +
				"\n" +
			    "Algumas coisas são moderadas automaticamente pelos nossos bots, saiba mais usando o comando`!automod` na sala <#729037736635400233>.\n" +
				"\n" +
				"> *Lembrando, você precisa concordar com as regras para ter acesso ao servidor:*")
			.setImage("https://i.imgur.com/wNQtUZZ.gif");
		//Setting up reactions.
		var sentMessage = await message.channel.send(embed);
		sentMessage.react(emojiMap.regras);
		//Setting up the reaction listener.
		messageListener.regras[0].messageID = "" + sentMessage.id;
		//Writing to file.
		fs.writeFileSync(pathToJson2, JSON.stringify(messageListener));

		message.delete();
	}
};