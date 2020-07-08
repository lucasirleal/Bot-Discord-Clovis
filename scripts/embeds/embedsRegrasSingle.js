//Main dependencies.
const Discord       = require('discord.js');
const fs            = require('fs');
//JSON paths.
const path          = require('path');
const pathToJson1   = path.resolve(__dirname, '../JSON/config.json');
//JSON objects.
var configs         = JSON.parse(fs.readFileSync(pathToJson1).toString());

module.exports = {
	Setup: async function (message, avatarURL) {
		//Single section.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":woman_judge: Regras")
			.setDescription("*Para usar nosso servidor, você precisa respeitar as seguintes regras:*")
			.addField("\u200b", "```• Tenha bom senso:\n" +
				"- Qualquer discurso homofóbico, racista, misógino, xenofóbico, transfóbico é punido com permaban.Tente também não levantar discussões políticas ou militâncias desnecessárias.\n" +
				"\n" +
				"• Não faça spam!\n" +
				"- Spam é tudo que é chato: divulgação, enviar muitas mensagens, emojis ou símbolos em um curto período, pedir admin ou cargos, entre outros\n" +
				"\n" +
				"• Respeite a Staff:\n" +
				"- Sempre que alguém da staff te der um aviso, respeite.Vamos evitar confusão e punições desnecessárias!\n" +
				"\n" +
				"• Não mencione atoa:\n" +
				"- Não mencione ninguém sem motivo, principalmente cargos da Staff.As pessoas param o que estão fazendo para visualizar menções!```")
			.addField("\u200b", "Algumas coisas são moderadas automaticamente pelos nossos bots, saiba mais usando o comando `!automod`.")
			.setFooter(new Date().toLocaleString(), avatarURL);

		//Setting up reactions.
		await message.channel.send(embed);
	}
};