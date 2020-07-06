//Main dependencies.
const fs          = require('fs');
const EmbedDicas  = require('./embeds/embedsDicas.js');
const EmbedFAQ    = require('./embeds/embedsFaq.js');
//JSON paths.
const path        = require('path');
const pathToJson  = path.resolve(__dirname, './JSON/emojiMap.json');
const pathToJson1 = path.resolve(__dirname, './JSON/messageListener.json');
//JSON objects.
var emojiMap      = JSON.parse(fs.readFileSync(pathToJson).toString());

module.exports = {
	//Handles all reactions on listened messages.
	HandleReactionAdd: async function (reaction, user, client) {
		//Updating the message listener.
		var messageListener = JSON.parse(fs.readFileSync(pathToJson1).toString());

		//Checking for each corresponding message.
		//Registro - Pronomes.
		if (reaction.message.id.toString() === messageListener.registro2[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.registro_pronomes_1 &&
				reaction.emoji.name != emojiMap.registro_pronomes_2 &&
				reaction.emoji.name != emojiMap.registro_pronomes_3)
			{ reaction.remove(); return; }

			//Adding the Registro Role.
			AddRole(reaction, user, "ㅤㅤㅤㅤㅤRegistroㅤㅤㅤㅤㅤ");
			//Removing all other roles from the pronomes field.
			RemoveRole(reaction, user, "Ele");
			RemoveRole(reaction, user, "Ela");
			RemoveRole(reaction, user, "Elu");
			//Adding desired roles.
			     if (reaction.emoji.name === emojiMap.registro_pronomes_1) { AddRole(reaction, user, "Ele"); }
			else if (reaction.emoji.name === emojiMap.registro_pronomes_2) { AddRole(reaction, user, "Ela"); }
			else if (reaction.emoji.name === emojiMap.registro_pronomes_3) { AddRole(reaction, user, "Elu"); }
		}
		//Registro - Idade.
		else if (reaction.message.id.toString() === messageListener.registro3[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.registro_idade_1 &&
				reaction.emoji.name != emojiMap.registro_idade_2)
			{ reaction.remove(); return; }

			//Adding the Registro Role.
			AddRole(reaction, user, "ㅤㅤㅤㅤㅤRegistroㅤㅤㅤㅤㅤ");
			//Removing all other roles from the pronomes field.
			RemoveRole(reaction, user, "-18");
			RemoveRole(reaction, user, "+18");
			//Adding desired roles.
			     if (reaction.emoji.name === emojiMap.registro_idade_1) { AddRole(reaction, user, "+18"); }
			else if (reaction.emoji.name === emojiMap.registro_idade_2) { AddRole(reaction, user, "-18"); }
		}
		//Registro - Relacionamento.
		else if (reaction.message.id.toString() === messageListener.registro4[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.registro_relacionamento_1 &&
				reaction.emoji.name != emojiMap.registro_relacionamento_2 &&
				reaction.emoji.name != emojiMap.registro_relacionamento_3 &&
				reaction.emoji.name != emojiMap.registro_relacionamento_4)
			{ reaction.remove(); return; }

			//Adding the Registro Role.
			AddRole(reaction, user, "ㅤㅤㅤㅤㅤRegistroㅤㅤㅤㅤㅤ");
			//Removing all other roles from the pronomes field.
			RemoveRole(reaction, user, "Solteiro(a)");
			RemoveRole(reaction, user, "Namorando");
			RemoveRole(reaction, user, "Enrolado(a)");
			RemoveRole(reaction, user, "Casado(a)");
			//Adding desired roles.
			     if (reaction.emoji.name === emojiMap.registro_relacionamento_1) { AddRole(reaction, user, "Solteiro(a)"); }
			else if (reaction.emoji.name === emojiMap.registro_relacionamento_2) { AddRole(reaction, user, "Namorando"); }
			else if (reaction.emoji.name === emojiMap.registro_relacionamento_3) { AddRole(reaction, user, "Enrolado(a)"); }
			else if (reaction.emoji.name === emojiMap.registro_relacionamento_4) { AddRole(reaction, user, "Casado(a)"); }
		}
		//Cargos - Palataforma
		else if (reaction.message.id.toString() === messageListener.cargos1[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.cargos_plataforma_1 &&
				reaction.emoji.name != emojiMap.cargos_plataforma_2 &&
				reaction.emoji.name != emojiMap.cargos_plataforma_3)
			{ reaction.remove(); return; }

			//Adding the Registro Role.
			AddRole(reaction, user, "ㅤㅤㅤㅤㅤRegistroㅤㅤㅤㅤㅤ");
			//Adding desired roles.
			     if (reaction.emoji.name === emojiMap.cargos_plataforma_1) { AddRole(reaction, user, "Desktop"); }
			else if (reaction.emoji.name === emojiMap.cargos_plataforma_2) { AddRole(reaction, user, "Celular"); }
			else if (reaction.emoji.name === emojiMap.cargos_plataforma_3) { AddRole(reaction, user, "Console"); }
		}
		//Cargos - Jogos
		else if (reaction.message.id.toString() === messageListener.cargos2[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.cargos_jogos_1 &&
				reaction.emoji.name != emojiMap.cargos_jogos_2 &&
				reaction.emoji.name != emojiMap.cargos_jogos_3 &&
				reaction.emoji.name != emojiMap.cargos_jogos_4 &&
				reaction.emoji.name != emojiMap.cargos_jogos_5 &&
				reaction.emoji.name != emojiMap.cargos_jogos_6 &&
				reaction.emoji.name != emojiMap.cargos_jogos_7 &&
				reaction.emoji.name != emojiMap.cargos_jogos_8)
			{ reaction.remove(); return; }

			//Adding the Registro Role.
			AddRole(reaction, user, "ㅤㅤㅤㅤㅤRegistroㅤㅤㅤㅤㅤ");
			//Adding desired roles.
			     if (reaction.emoji.name === emojiMap.cargos_jogos_1) { AddRole(reaction, user, "CS:GO"); }
			else if (reaction.emoji.name === emojiMap.cargos_jogos_2) { AddRole(reaction, user, "Minecraft"); }
		    else if (reaction.emoji.name === emojiMap.cargos_jogos_3) { AddRole(reaction, user, "Fortnite"); }
			else if (reaction.emoji.name === emojiMap.cargos_jogos_4) { AddRole(reaction, user, "Apex Legends"); }
			else if (reaction.emoji.name === emojiMap.cargos_jogos_5) { AddRole(reaction, user, "LOL"); }
			else if (reaction.emoji.name === emojiMap.cargos_jogos_6) { AddRole(reaction, user, "Rainbow Six"); }
			else if (reaction.emoji.name === emojiMap.cargos_jogos_7) { AddRole(reaction, user, "Brawhalla"); }
			else if (reaction.emoji.name === emojiMap.cargos_jogos_8) { AddRole(reaction, user, "Escape from Tarkov"); }
		}
		//Cargos - notificações.
		else if (reaction.message.id.toString() === messageListener.cargos3[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.cargos_notifica_1 &&
				reaction.emoji.name != emojiMap.cargos_notifica_2 &&
				reaction.emoji.name != emojiMap.cargos_notifica_3)
			{ reaction.remove(); return; }

			//Adding the Registro Role.
			AddRole(reaction, user, "ㅤㅤㅤㅤㅤRegistroㅤㅤㅤㅤㅤ");
			//Adding desired roles.
			     if (reaction.emoji.name === emojiMap.cargos_notifica_1) { AddRole(reaction, user, "Notificar 📢"); }
			else if (reaction.emoji.name === emojiMap.cargos_notifica_2) { AddRole(reaction, user, "Lives 📢"); }
			else if (reaction.emoji.name === emojiMap.cargos_notifica_3) { AddRole(reaction, user, "Novidades 📢"); }
		}
		//Regras.
		else if (reaction.message.id.toString() === messageListener.regras[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.regras)
			{ reaction.remove(); return; }

			//Adding desired roles.
			AddRole(reaction, user, "✅ Regras");
		}
		//Novidades.
		else if (reaction.message.id.toString() === messageListener.novidades[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.novidades) { reaction.remove(); return; }

			//Adding desired roles.
			AddRole(reaction, user, "Novidades 📢");
		}
		//Notificações.
		else if (reaction.message.id.toString() === messageListener.notificacoes[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.notificacoes) { reaction.remove(); return; }

			//Adding desired roles.
			AddRole(reaction, user, "Lives 📢");
			AddRole(reaction, user, "Notificar 📢");
		}
		//Listening for FAQ's reactions.
		else if (messageListener.faq.some(id => id === reaction.message.id.toString())) {
			//Declines if the reaction was made by the bot.
			if (reaction.me === user) { return; }
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.faq_1 &&
				reaction.emoji.name != emojiMap.faq_2 &&
				reaction.emoji.name != emojiMap.faq_3 &&
				reaction.emoji.name != emojiMap.faq_4 &&
				reaction.emoji.name != emojiMap.faq_5 &&
				reaction.emoji.name != emojiMap.faq_6)
			{ reaction.remove(); return; }
			//Changing the embed.
			     if (reaction.emoji.name === emojiMap.faq_1)
			{
				await EmbedFAQ.FAQ_Inicio(reaction.message, client.user.displayAvatarURL());
				reaction.users.remove(user.id);
			}
			else if (reaction.emoji.name === emojiMap.faq_2)
			{
				await EmbedFAQ.FAQ_Regras(reaction.message, client.user.displayAvatarURL());
				reaction.users.remove(user.id);
			}
			else if (reaction.emoji.name === emojiMap.faq_3)
			{
				await EmbedFAQ.FAQ_AutoMod(reaction.message, client.user.displayAvatarURL());
				reaction.users.remove(user.id);
			}
			else if (reaction.emoji.name === emojiMap.faq_4)
			{
				await EmbedFAQ.FAQ_Fuinho(reaction.message, client.user.displayAvatarURL());
				reaction.users.remove(user.id);
			}
			else if (reaction.emoji.name === emojiMap.faq_5)
			{
				await EmbedFAQ.FAQ_LVL(reaction.message, client.user.displayAvatarURL());
				reaction.users.remove(user.id);
			}
			else if (reaction.emoji.name === emojiMap.faq_6)
			{
				await EmbedFAQ.FAQ_Comandos(reaction.message, client.user.displayAvatarURL());
				reaction.users.remove(user.id);
			}
		}
		//Listening for Dicas reactions.
		else if (messageListener.dicas.some(id => id === reaction.message.id.toString())) {
			//Declines if the reaction was made by the bot.
			if (reaction.me === user) { return; }
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.dicas_1 &&
				reaction.emoji.name != emojiMap.dicas_2 &&
				reaction.emoji.name != emojiMap.dicas_3 &&
				reaction.emoji.name != emojiMap.dicas_4 &&
				reaction.emoji.name != emojiMap.dicas_5 &&
				reaction.emoji.name != emojiMap.dicas_6)
			{ reaction.remove(); return; }

			//Changing the embed.
			    if (reaction.emoji.name === emojiMap.dicas_1)
			{
				await EmbedDicas.DicasInicio(reaction.message, client.user.displayAvatarURL());
				reaction.users.remove(user.id);
			}
			else if (reaction.emoji.name === emojiMap.dicas_2)
			{
				await EmbedDicas.Dicas2(reaction.message, client.user.displayAvatarURL());
				reaction.users.remove(user.id);
			}
			else if (reaction.emoji.name === emojiMap.dicas_3)
			{
				await EmbedDicas.Dicas3(reaction.message, client.user.displayAvatarURL());
				reaction.users.remove(user.id);
			}
			else if (reaction.emoji.name === emojiMap.dicas_4)
			{
				await EmbedDicas.Dicas4(reaction.message, client.user.displayAvatarURL());
				reaction.users.remove(user.id);
			}
			else if (reaction.emoji.name === emojiMap.dicas_5)
			{
				await EmbedDicas.Dicas5(reaction.message, client.user.displayAvatarURL());
				reaction.users.remove(user.id);
			}
			else if (reaction.emoji.name === emojiMap.dicas_6)
			{
				await EmbedDicas.Dicas6(reaction.message, client.user.displayAvatarURL());
				reaction.users.remove(user.id);
			}
		}
	}
};

//Add a role if the user don't already have it.
async function AddRole(reaction, user, roleName) {
	//First we need to get the desired user.
	let member = await reaction.message.guild.members.fetch(user.id);
	//Then we get the role ID.
	let role = reaction.message.guild.roles.cache.find(role => role.name === roleName);

	//If the user don't have the role, we add it.
	if (!member.roles.cache.has(role.id)) { await member.roles.add(role).catch(console.error); }
}

//Removes a role from a user.
async function RemoveRole(reaction, user, roleName) {
	//First we need to get the desired user.
	let member = await reaction.message.guild.members.fetch(user.id);
	//Then we get the role ID.
	let role = reaction.message.guild.roles.cache.find(role => role.name === roleName);

	//If the user don't have the role, we add it.
	if (member.roles.cache.has(role.id)) { await member.roles.remove(role).catch(console.error); }
}