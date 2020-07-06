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
	Registro1: function (message) {
		//Presentation.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":scroll: Registro")
			.setDescription("Aqui é onde nós vamos nos conhecer melhor!\n" +
				            "Tudo que você precisa fazer é **reagir com o emoji que representa sua resposta**. O bot do nosso servidor vai adicionar o cargo corresponde pra você!");

			message.channel.send(embed);
	},
	Registro2: async function (message) {
		//Pronouns section.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":performing_arts: Pronomes")
			.addField("Como nós devemos te chamar?",
				emojiMap.registro_pronomes_1 + " Ele\n" +
				emojiMap.registro_pronomes_2 + " Ela\n" +
				emojiMap.registro_pronomes_3 + " Elu");
		//Setting up reactions.
		var sentMessage = await message.channel.send(embed);
		sentMessage.react(emojiMap.registro_pronomes_1);
		sentMessage.react(emojiMap.registro_pronomes_2);
		sentMessage.react(emojiMap.registro_pronomes_3);
		//Setting up the reaction listener.
		messageListener.registro2[0].messageID = "" + sentMessage.id;
		//Writing to file.
		fs.writeFileSync(pathToJson2, JSON.stringify(messageListener));
	},
	Registro3: async function (message) {
		//Age section.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":alarm_clock: Idade")
			.addField("Quantos anos de sedução você tem?",
				emojiMap.registro_idade_1 + " Mais de 18\n" +
				emojiMap.registro_idade_2 + " Menos de 18");
		//Setting up reactions.
		var sentMessage = await message.channel.send(embed);
		sentMessage.react(emojiMap.registro_idade_1);
		sentMessage.react(emojiMap.registro_idade_2);
		//Setting up the reaction listener.
		messageListener.registro3[0].messageID = "" + sentMessage.id;
		//Writing to file.
		fs.writeFileSync(pathToJson2, JSON.stringify(messageListener));
	},
	Registro4: async function (message) {
		//Relationship section.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":woman_detective: Relacionamento")
			.addField("E esse coraçãozinho, como anda?",
				emojiMap.registro_relacionamento_1 + " Solteiro(a)\n" +
				emojiMap.registro_relacionamento_2 + " Namorando\n" +
				emojiMap.registro_relacionamento_3 + " Só nos rolos\n" +
				emojiMap.registro_relacionamento_4 + " Casado(a)");
		//Setting up reactions.
		var sentMessage = await message.channel.send(embed);
		sentMessage.react(emojiMap.registro_relacionamento_1);
		sentMessage.react(emojiMap.registro_relacionamento_2);
		sentMessage.react(emojiMap.registro_relacionamento_3);
		sentMessage.react(emojiMap.registro_relacionamento_4);
		//Setting up the reaction listener.
		messageListener.registro4[0].messageID = "" + sentMessage.id;
		//Writing to file.
		fs.writeFileSync(pathToJson2, JSON.stringify(messageListener));
	}
};