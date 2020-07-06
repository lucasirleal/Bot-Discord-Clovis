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
	AdquiraCargos1: function (message) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());

		//Presentation.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":books: Adquira cargos")
			.setDescription("Aqui você pode adquirir alguns cargos importantes para sabermos quais são seus interesses.\n" +
				            "Tudo que você precisa fazer é **reagir com o emoji que representa sua resposta**. O bot do nosso servidor vai adicionar o cargo corresponde pra você!");
			message.channel.send(embed);
	},
	AdquiraCargos2: async function (message) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());

		//Platform asking.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":joystick: Plataforma")
			.addField("Onde você costuma jogar?",
				emojiMap.cargos_plataforma_1 + " Computador\n" +
				emojiMap.cargos_plataforma_2 + " Celular\n" +
				emojiMap.cargos_plataforma_3 + " Console");
		//Setting up reactions.
		var sentMessage = await message.channel.send(embed);
		sentMessage.react(emojiMap.cargos_plataforma_1);
		sentMessage.react(emojiMap.cargos_plataforma_2);
		sentMessage.react(emojiMap.cargos_plataforma_3);
		//Changing the JSON object to listen for the sent message.
		messageListener.cargos1[0].messageID = "" + sentMessage.id;
		//Writing to file.
		fs.writeFileSync(pathToJson2, JSON.stringify(messageListener));
	},
	AdquiraCargos3: async function (message) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());

		//Common games asking.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":black_joker: Jogos")
			.addField("Quais jogos você costuma jogar?",
				emojiMap.cargos_jogos_1 + " CS:GO\n" +
				emojiMap.cargos_jogos_2 + " Minecraft\n" +
				emojiMap.cargos_jogos_3 + " Fortnite\n" +
				emojiMap.cargos_jogos_4 + " Apex Legends\n" +
				emojiMap.cargos_jogos_5 + " League of Legends\n" +
				emojiMap.cargos_jogos_6 + " Rainbow Six Siege\n" +
				emojiMap.cargos_jogos_7 + " Brawhalla\n" +
				emojiMap.cargos_jogos_8 + " Escape from Tarkov");
		//Setting up reactions.
		var sentMessage = await message.channel.send(embed);
		sentMessage.react(emojiMap.cargos_jogos_1);
		sentMessage.react(emojiMap.cargos_jogos_2);
		sentMessage.react(emojiMap.cargos_jogos_3);
		sentMessage.react(emojiMap.cargos_jogos_4);
		sentMessage.react(emojiMap.cargos_jogos_5);
		sentMessage.react(emojiMap.cargos_jogos_6);
		sentMessage.react(emojiMap.cargos_jogos_7);
		sentMessage.react(emojiMap.cargos_jogos_8);
		//Changing the JSON object to listen for the sent message.
		messageListener.cargos2[0].messageID = "" + sentMessage.id;
		//Writing to file.
		fs.writeFileSync(pathToJson2, JSON.stringify(messageListener));
	},
	AdquiraCargos4: async function (message) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson1).toString());

		//Notification asking.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle("📢 Notificações")
			.addField("Sobre o que você quer ser notificado?",
				emojiMap.cargos_notifica_1 + " Vídeos do @MaxPalaro e parceiros\n" +
				emojiMap.cargos_notifica_2 + " Lives do @MaxPalaro e parceiros\n" +
				emojiMap.cargos_notifica_3 + " Novidades do servidor");
		//Setting up reactions.
		var sentMessage = await message.channel.send(embed);
		sentMessage.react(emojiMap.cargos_notifica_1);
		sentMessage.react(emojiMap.cargos_notifica_2);
		sentMessage.react(emojiMap.cargos_notifica_3);
		//Changing the JSON object to listen for the sent message.
		messageListener.cargos3[0].messageID = "" + sentMessage.id;
		//Writing to file.
		fs.writeFileSync(pathToJson2, JSON.stringify(messageListener));
	}
};