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
	FAQ1: async function (message, avatarURL) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());
		messageListener = JSON.parse(fs.readFileSync(pathToJson2).toString());
		//Presentation.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":information_source: Central de Informações")
			.setDescription("Ficou alguma dúvida sobre nosso servidor?\n"+ 
							"É só reagir à essa mensagem com a categoria que você quer ver.")
			.setFooter(new Date().toLocaleString(), avatarURL);
		//Setting up reactions.
		var listen = await message.channel.send(embed);
		listen.react(emojiMap.faq_1);
		listen.react(emojiMap.faq_2);
		listen.react(emojiMap.faq_3);
		listen.react(emojiMap.faq_4);
		listen.react(emojiMap.faq_5);
		listen.react(emojiMap.faq_6);
		//Telling the listener to watch for this message.
		messageListener.faq.push(listen.id);
		//Writing to file.
		fs.writeFileSync(pathToJson2, JSON.stringify(messageListener));
	},
	FAQ_Fuinho: async function (message, avatarURL) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());
		//Bot section.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":frog: O famigerado Clóvis")
			.setDescription("O clóvis é seu sapinho amigo. Ele foi criado pelo [Estúdio Weasel](https://estudioweasel.com/), que pertence ao <@!495984804198875136> e <@!205817378808791041>.")
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.edit(embed);
	},
	FAQ_Regras: async function (message, avatarURL) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());
		//Rules section.
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
			.addField("\u200b", "Algumas coisas são moderadas automaticamente pelos nossos bots, saiba mais usando o comando `!automod ` ou na próxima página deste faq.")
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.edit(embed);
	},
	FAQ_AutoMod: async function (message, avatarURL) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());
		//Automod section.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":rotating_light: Moderação Automática")
			.setDescription("Nossos bots nos ajudam a manter a comunidade organizada, removendo:\n"+
				"\n"+
				"1. Mensagens duplicadas;\n" +
				"2. Mensagens com seis ou mais emojis; \n"+
				"3. Mensagens com quatro ou mais menções.\n"+
				"4. Convites e links fora da sala <#729037891178594387>\n"+
				"\n" +
				":warning:** Você ficará impossibilitado de enviar mensagens nas seguintes situações: **\n"+
				"\n" +
				"1. Por 30 minutos caso tenha 3 infrações nos últimos dois dias; \n"+
				"2. Por 1 hora e 30 minutos caso tenha 6 infrações nos últimos dois dias; \n"+
				"3. Por 5 horas no caso de 12 infrações nos últimos sete dias.")
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.edit(embed);
	},
	FAQ_Inicio: async function (message, avatarURL) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());
		//First section, without reactions.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":information_source: Central de Informações")
			.setDescription("Ficou alguma dúvida sobre nosso servidor?\n" +
				"É só reagir à essa mensagem com a categoria que você quer ver.")
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.edit(embed);
	},
	FAQ_LVL: async function (message, avatarURL) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());
		//First section, without reactions.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":sparkles: Level Up")
			.setDescription(":small_orange_diamond: O servidor tem um sistema de níveis, que você ganha ao interagir no servidor.\n" +
			":white_small_square: Quanto maior o seu nível, mais poderes você tem no servidor:\n" +
				"\n" +
				"> @:shield: Guardião (Lvl 100) - Benefícios anteriores\n" +
				"> @:older_man: Ancião (Lvl 90) - Benefícios anteriores\n" +
				"> @:dragon: Mestre (Lvl 70) - Benefícios anteriores e mover membros\n" +
				"> @:mage: Mago (Lvl 50) - Benefícios anteriores e uso do TTS\n" +
				"> @:crossed_swords: Lord (Lvl 40) - Benefícios anteriores e fazer stream nos canais\n" +
				"> @:skull: Mercenário (Lvl 30) - Benefícios anteriores e criar uma guilda\n" +
				"> @:sparkles: Veterano (Lvl 20) - Benefícios anteriores e usar emojis externos\n" +
				"> @:star2: Membro Plus (Lvl 10) - Benefícios anteriores e enviar imagens no <#729037689709527081>\n" +
				"> @:star: Membro (Lvl 5) - Mudar apelido e adicionar reações\n" +
				"\n" +
				"Você ganha **aleatoriamente** entre **15~25** de xp **por mensagens em um intervalo de 3 minutos**.\n" +
				":small_orange_diamond: Veja o **ranking** do servidor e seu nível digitando `!rank` ou `!levels` em <#729037736635400233>.")
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.edit(embed);
	},
	FAQ_Comandos: async function (message, avatarURL) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());
		//First section, without reactions.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":computer: Comandos úteis")
			.setDescription("*Aprenda mais afundo sobre as funcionalidades do servidor com os tutoriais avançados:*\n" +
				"\n" +
				"> :arrow_right_hook: `!bots` - Uma explicação sobre cada bot do nosso servidor!\n" +
				"> :arrow_right_hook: `!economia` - Nosso servidor tem economia! Aprenda sobre com este comando.\n" +
				"> :arrow_right_hook: `!economiaregras` - Não se esqueça de ler as regras da nossa economia, ao usar.\n" +
				"> :arrow_right_hook: `!equipe` - Saiba quem são as pessoas por trás desse servidor maravilhoso!\n")
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.edit(embed);
	}
};