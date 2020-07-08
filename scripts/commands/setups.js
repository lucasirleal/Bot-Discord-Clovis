//Main dependencies.
const Discord        = require('discord.js');
const fs             = require('fs');
const EmbedsRegistro = require('../embeds/embedsRegistro.js');
const EmbedCargos    = require('../embeds/embedsAdquiraCargos.js');
const EmbedRegras    = require('../embeds/embedsRegras.js');
const EmbedNovidades = require('../embeds/embedsNovidades.js');
const EmbedNotifica  = require('../embeds/embedsNotificacoes.js');
const EmbedsSorteios = require('../embeds/embedsSorteios.js');
//JSON paths.
const path           = require('path');
const pathToJson     = path.resolve(__dirname, '../JSON/config.json');

module.exports = {

	//Commands for every "setup". They are basically a chain of embeds.
	Registro: async function (message, args, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		//If no number argument is given, we'll run all the setup.
		if (!args.length) {

			await EmbedsRegistro.Registro1(message);
			await EmbedsRegistro.Registro2(message);
			await EmbedsRegistro.Registro3(message);
			await EmbedsRegistro.Registro4(message);
			message.delete();
			return;

		}
		else if (args.length > 1) {
			//Multiple arguments are not supported.
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Você pode digitar um número de **1 a 4** para executar uma etapa específica. Ou nenhum número para executar todas.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}
		//Specific tasks handling.
		     if (args[0] === "1") { await EmbedsRegistro.Registro1(message); message.delete(); }
		else if (args[0] === "2") { await EmbedsRegistro.Registro2(message); message.delete(); }
		else if (args[0] === "3") { await EmbedsRegistro.Registro3(message); message.delete(); }
		else if (args[0] === "4") { await EmbedsRegistro.Registro4(message); message.delete(); }
		else
		{
			//Invalid number inputs.
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: As etapas vão de **1 a 4**.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}
	},
	Cargos: async function (message, args, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		//If no number argument is given, we'll run all the setup.
		if (!args.length) {

			await EmbedCargos.AdquiraCargos1(message);
			await EmbedCargos.AdquiraCargos2(message);
			await EmbedCargos.AdquiraCargos3(message);
			await EmbedCargos.AdquiraCargos4(message);
			message.delete();
			return;

		}
		else if (args.length > 1) {
			//Multiple arguments are not supported.
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Você pode digitar um número de **1 a 4** para executar uma etapa específica. Ou nenhum número para executar todas.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}
		//Specific tasks handling.
		     if (args[0] === "1") { await EmbedCargos.AdquiraCargos1(message); message.delete(); }
		else if (args[0] === "2") { await EmbedCargos.AdquiraCargos2(message); message.delete(); }
		else if (args[0] === "3") { await EmbedCargos.AdquiraCargos3(message); message.delete(); }
		else if (args[0] === "4") { await EmbedCargos.AdquiraCargos4(message); message.delete(); }
		else {
			//Invalid number inputs.
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: As etapas vão de **1 a 4**.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}
	},
	Regras: async function (message) {
		EmbedRegras.Setup(message);
	},
	Novidades: async function (message) {
		EmbedNovidades.Setup(message);
	},
	Notificacoes: async function (message) {
		EmbedNotifica.Setup(message);
	},
	Sorteios: async function (message) {
		EmbedsSorteios.Setup(message);
    }
};