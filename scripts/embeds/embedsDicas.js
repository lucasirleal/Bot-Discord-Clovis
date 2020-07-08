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
	//This nothing more than a chain of embeds that together form a section of a channel.
	Dicas1: async function (message, avatarURL) {
		//Updating JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());
		messageListener = JSON.parse(fs.readFileSync(pathToJson2).toString());
		//Presentation.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":thought_balloon: Dicas")
			.setDescription("Aqui vão algumas dicas pra você utilizar todo o potencial do nosso servidor:\n"+ 
							"É só reagir à essa mensagem com a categoria que você quer ver.")
			.setFooter(new Date().toLocaleString(), avatarURL);
		//Setting up reactions.
		var listen = await message.channel.send(embed);
		listen.react(emojiMap.dicas_1);
		listen.react(emojiMap.dicas_2);
		listen.react(emojiMap.dicas_3);
		listen.react(emojiMap.dicas_4);
		listen.react(emojiMap.dicas_5);
		listen.react(emojiMap.dicas_6);
		//Telling the object to list for the sent message.
		messageListener.dicas.push(listen.id);
		//Writing to file.
		fs.writeFileSync(pathToJson2, JSON.stringify(messageListener));
	},
	Dicas2: async function (message, avatarURL) {
		//Updating JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());
		//How to see fixed messages.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":information_source: Central de Informações")
			.setDescription("**Os canais possuem explicações sobre seu funcionamento em suas mensagens fixadas!**\n" +
				"\n" +
				"Não sabe acessar? Olha só:")
			.setImage("https://i.imgur.com/X9WPeT8.gif")
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.edit(embed);
	},
	Dicas3: async function (message, avatarURL) {
		//Updating JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());
		//How to mute the server.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":information_source: Central de Informações")
			.setDescription("**A gente fala demais né?**\n" +
				"Olha só como você pode silenciar o nosso servidor:")
			.setImage("https://i.imgur.com/SRJZqqU.gif")
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.edit(embed);
	},
	Dicas4: async function (message, avatarURL) {
		//Updating JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());
		//How to mute a channel.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":information_source: Central de Informações")
			.setDescription("**A gente fala demais né?**\n" +
				"Olha só como você pode silenciar somente um canal:")
			.setImage("https://i.imgur.com/8V73Jim.gif")
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.edit(embed);
	},
	Dicas5: async function (message, avatarURL) {
		//Updating JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());
		//How to get new roles.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":information_source: Central de Informações")
			.setDescription("Lembre-se também de pegar **novos cargos** na sala <#729036918725148672> **para ter acesso à todas as funcionalidades do servidor**.\n" +
				"É só clicar na reação:")
			.setImage("https://i.imgur.com/oKLLyKN.gif")
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.edit(embed);
	},
	Dicas6: async function (message, avatarURL) {
		//Updating JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());
		//How to call the staff.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":information_source: Central de Informações")
			.setDescription("**Não é complicado né? :thinking:**.\n" +
				"Qualquer coisa chama alguém da <@&614952386464579584> pra te ajudar ;)")
			.setImage("https://i.imgur.com/mWTroke.gif")
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.edit(embed);
	},
	DicasInicio: async function (message, avatarURL) {
		//Updating JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());
		//Same as the presentation, but without setting up reactions.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":thought_balloon: Dicas")
			.setDescription("Aqui vão algumas dicas pra você utilizar todo o potencial do nosso servidor:\n" +
				"É só reagir à essa mensagem com a categoria que você quer ver.")
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.edit(embed);
	}
};