//Main dependencies.
const fs          = require('fs');
const EmbedDicas  = require('./embeds/embedsDicas.js');
const EmbedFAQ    = require('./embeds/embedsFaq.js');
const musicQueue  = require('./commands/musicQueue.js');
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
			AddRole(reaction, user, "608431408762978335"); //Registro

			//Adding desired roles.
			if (reaction.emoji.name === emojiMap.registro_pronomes_1)
			{
				AddRole(reaction, user, "526166322107777034"); //Ele
				RemoveRole(reaction, user, "526166342035046400"); //Ela
				RemoveRole(reaction, user, "526166359483088910"); //Elu 
			}
			else if (reaction.emoji.name === emojiMap.registro_pronomes_2)
			{
				AddRole(reaction, user, "526166342035046400");//Ela
				RemoveRole(reaction, user, "526166322107777034"); //Ele
				RemoveRole(reaction, user, "526166359483088910"); //Elu 
			} 
			else if (reaction.emoji.name === emojiMap.registro_pronomes_3)
			{
				AddRole(reaction, user, "526166359483088910");//Elu
				RemoveRole(reaction, user, "526166342035046400"); //Ela
				RemoveRole(reaction, user, "526166322107777034"); //Ele
			} 
		}
		//Registro - Idade.
		else if (reaction.message.id.toString() === messageListener.registro3[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.registro_idade_1 &&
				reaction.emoji.name != emojiMap.registro_idade_2)
			{ reaction.remove(); return; }

			//Adding the Registro Role.
			AddRole(reaction, user, "608431408762978335"); //Registro

			//Adding desired roles.
			if (reaction.emoji.name === emojiMap.registro_idade_1)
			{
				AddRole(reaction, user, "526166410251206667"); //+18
				RemoveRole(reaction, user, "526166424289411072"); //-18
			}
			else if (reaction.emoji.name === emojiMap.registro_idade_2)
			{
				AddRole(reaction, user, "526166424289411072");//-18
				RemoveRole(reaction, user, "526166410251206667"); //+18
			} 
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
			AddRole(reaction, user, "608431408762978335"); //Registro

			//Adding desired roles.
			if (reaction.emoji.name === emojiMap.registro_relacionamento_1)
			{
				AddRole(reaction, user, "526169088142082079");//Solteiro
				RemoveRole(reaction, user, "526169060526784522"); //Namorando
				RemoveRole(reaction, user, "526169213555965952"); //Enrolado
				RemoveRole(reaction, user, "526169198326448168"); //Casado
			} 
			else if (reaction.emoji.name === emojiMap.registro_relacionamento_2)
			{
				AddRole(reaction, user, "526169060526784522");//Namorando
				RemoveRole(reaction, user, "526169088142082079"); //Solteiro
				RemoveRole(reaction, user, "526169213555965952"); //Enrolado
				RemoveRole(reaction, user, "526169198326448168"); //Casado
			} 
			else if (reaction.emoji.name === emojiMap.registro_relacionamento_3)
			{
				AddRole(reaction, user, "526169213555965952");//Enrolado
				RemoveRole(reaction, user, "526169088142082079"); //Solteiro
				RemoveRole(reaction, user, "526169060526784522"); //Namorando
				RemoveRole(reaction, user, "526169198326448168"); //Casado
			} 
			else if (reaction.emoji.name === emojiMap.registro_relacionamento_4)
			{
				AddRole(reaction, user, "526169198326448168");//Casado
				RemoveRole(reaction, user, "526169088142082079"); //Solteiro
				RemoveRole(reaction, user, "526169060526784522"); //Namorando
				RemoveRole(reaction, user, "526169213555965952"); //Enrolado
			} 
		}
		//Cargos - Palataforma
		else if (reaction.message.id.toString() === messageListener.cargos1[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.cargos_plataforma_1 &&
				reaction.emoji.name != emojiMap.cargos_plataforma_2 &&
				reaction.emoji.name != emojiMap.cargos_plataforma_3)
			{ reaction.remove(); return; }

			//Adding the Registro Role.
			AddRole(reaction, user, "608431408762978335"); //Registro
			//Adding desired roles.
			if (reaction.emoji.name === emojiMap.cargos_plataforma_1) { AddRole(reaction, user, "526170819580395530"); } //Desktop
			else if (reaction.emoji.name === emojiMap.cargos_plataforma_2) { AddRole(reaction, user, "526170867424821249"); } //Celular
			else if (reaction.emoji.name === emojiMap.cargos_plataforma_3) { AddRole(reaction, user, "526170883010854922"); } //Console
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
				reaction.emoji.name != emojiMap.cargos_jogos_8 &&
				reaction.emoji.name != emojiMap.cargos_jogos_9)
			{ reaction.remove(); return; }

			//Adding the Registro Role.
			AddRole(reaction, user, "608431408762978335"); //Registro
			//Adding desired roles.
			if (reaction.emoji.name === emojiMap.cargos_jogos_1) { AddRole(reaction, user, "524937632971751444"); } //CSGO
			else if (reaction.emoji.name === emojiMap.cargos_jogos_2) { AddRole(reaction, user, "640649516797919263"); } //Mine
			else if (reaction.emoji.name === emojiMap.cargos_jogos_3) { AddRole(reaction, user, "551072118612426762"); } //Fortnite
			else if (reaction.emoji.name === emojiMap.cargos_jogos_4) { AddRole(reaction, user, "551071808191987733"); } //Apex
			else if (reaction.emoji.name === emojiMap.cargos_jogos_5) { AddRole(reaction, user, "551072009560391682"); } //LOL
			else if (reaction.emoji.name === emojiMap.cargos_jogos_6) { AddRole(reaction, user, "551071528322859010"); } //Rainbow
			else if (reaction.emoji.name === emojiMap.cargos_jogos_7) { AddRole(reaction, user, "551072444916695041"); } //Brawhalla
			else if (reaction.emoji.name === emojiMap.cargos_jogos_8) { AddRole(reaction, user, "680968518522503190"); } //Tarkov
			else if (reaction.emoji.name === emojiMap.cargos_jogos_9) { AddRole(reaction, user, "729730698038083585"); } //Cod
		}
		//Cargos - notificações.
		else if (reaction.message.id.toString() === messageListener.cargos3[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.cargos_notifica_1 &&
				reaction.emoji.name != emojiMap.cargos_notifica_2 &&
				reaction.emoji.name != emojiMap.cargos_notifica_3)
			{ reaction.remove(); return; }

			//Adding the Registro Role.
			AddRole(reaction, user, "608431408762978335"); //Registro
			//Adding desired roles.
			     if (reaction.emoji.name === emojiMap.cargos_notifica_1) { AddRole(reaction, user, "500288579730276372"); } //Notificar
			else if (reaction.emoji.name === emojiMap.cargos_notifica_2) { AddRole(reaction, user, "642468342120185896"); } //Lives
			else if (reaction.emoji.name === emojiMap.cargos_notifica_3) { AddRole(reaction, user, "680963908260855826"); } //Novidades
		}
		//Regras.
		else if (reaction.message.id.toString() === messageListener.regras[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.regras)
			{ reaction.remove(); return; }

			//Adding desired roles.
			AddRole(reaction, user, "620286876959506455"); //Regras
			AddRole(reaction, user, "451010259318734849"); //Inscrito
			AddRole(reaction, user, "635878165440364577"); //Ranking
			AddRole(reaction, user, "635877686333407253"); //Conquistas
			AddRole(reaction, user, "608431388730982402"); //Guilda
			AddRole(reaction, user, "608430989609533453"); //Economia
			AddRole(reaction, user, "608431408762978335"); //Registro
			AddRole(reaction, user, "609386621753884682"); //Jogos
		}
		//Novidades.
		else if (reaction.message.id.toString() === messageListener.novidades[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.novidades) { reaction.remove(); return; }

			//Adding desired roles.
			AddRole(reaction, user, "680963908260855826"); //Novidades
		}
		//Notificações.
		else if (reaction.message.id.toString() === messageListener.notificacoes[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.notificacoes) { reaction.remove(); return; }

			//Adding desired roles.
			AddRole(reaction, user, "642468342120185896"); //Lives
			AddRole(reaction, user, "500288579730276372"); //Notificar
		}
		//Sorteios.
		else if (reaction.message.id.toString() === messageListener.sorteios[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.sorteios) { reaction.remove(); return; }

			//Adding desired roles.
			AddRole(reaction, user, "705619867440513026"); //Sorteios
		}
		//Musical Queue.
		else if (reaction.message.id.toString() === messageListener.queue[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.queue_1 &&
				reaction.emoji.name != emojiMap.queue_2 &&
				reaction.emoji.name != emojiMap.queue_3 &&
				reaction.emoji.name != emojiMap.queue_4 &&
				reaction.emoji.name != emojiMap.queue_5 &&
				reaction.emoji.name != emojiMap.queue_6)
			{ reaction.remove(); return; }

			if (reaction.emoji.name == emojiMap.queue_1) { await musicQueue.SetLoopingOne(reaction.message); }
			else if (reaction.emoji.name == emojiMap.queue_2) { await musicQueue.SetLoopingQueue(reaction.message); }
			else if (reaction.emoji.name == emojiMap.queue_3) { await musicQueue.Stop(reaction.message, client.user.displayAvatarURL()); }
			else if (reaction.emoji.name == emojiMap.queue_4) { await musicQueue.PreviousQueue(reaction.message, client.user.displayAvatarURL()); }
			else if (reaction.emoji.name == emojiMap.queue_5) { await musicQueue.NextQueue(reaction.message, client.user.displayAvatarURL()); }
			else if (reaction.emoji.name == emojiMap.queue_6) { await musicQueue.TriggerPlayPause(reaction.message, client.user.displayAvatarURL()); }

			reaction.users.remove(user.id);
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
	},
	//Handles all reactions on listened messages.
	HandleReactionRemove: async function (reaction, user, client) {
		//Updating the message listener.
		var messageListener = JSON.parse(fs.readFileSync(pathToJson1).toString());

		//Checking for each corresponding message.
		//Cargos - Palataforma
		if (reaction.message.id.toString() === messageListener.cargos1[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.cargos_plataforma_1 &&
				reaction.emoji.name != emojiMap.cargos_plataforma_2 &&
				reaction.emoji.name != emojiMap.cargos_plataforma_3) { reaction.remove(); return; }

			//Adding the Registro Role.
			AddRole(reaction, user, "608431408762978335"); //Registro
			//Adding desired roles.
			if (reaction.emoji.name === emojiMap.cargos_plataforma_1) { RemoveRole(reaction, user, "526170819580395530"); } //Desktop
			else if (reaction.emoji.name === emojiMap.cargos_plataforma_2) { RemoveRole(reaction, user, "526170867424821249"); } //Celular
			else if (reaction.emoji.name === emojiMap.cargos_plataforma_3) { RemoveRole(reaction, user, "526170883010854922"); } //Console
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
				reaction.emoji.name != emojiMap.cargos_jogos_8 &&
				reaction.emoji.name != emojiMap.cargos_jogos_9) { reaction.remove(); return; }

			//Adding the Registro Role.
			AddRole(reaction, user, "608431408762978335"); //Registro
			//Adding desired roles.
			if (reaction.emoji.name === emojiMap.cargos_jogos_1) { RemoveRole(reaction, user, "524937632971751444"); } //CSGO
			else if (reaction.emoji.name === emojiMap.cargos_jogos_2) { RemoveRole(reaction, user, "640649516797919263"); } //Mine
			else if (reaction.emoji.name === emojiMap.cargos_jogos_3) { RemoveRole(reaction, user, "551072118612426762"); } //Fortnite
			else if (reaction.emoji.name === emojiMap.cargos_jogos_4) { RemoveRole(reaction, user, "551071808191987733"); } //Apex
			else if (reaction.emoji.name === emojiMap.cargos_jogos_5) { RemoveRole(reaction, user, "551072009560391682"); } //LOL
			else if (reaction.emoji.name === emojiMap.cargos_jogos_6) { RemoveRole(reaction, user, "551071528322859010"); } //Rainbow
			else if (reaction.emoji.name === emojiMap.cargos_jogos_7) { RemoveRole(reaction, user, "551072444916695041"); } //Brawhalla
			else if (reaction.emoji.name === emojiMap.cargos_jogos_8) { RemoveRole(reaction, user, "680968518522503190"); } //Tarkov
			else if (reaction.emoji.name === emojiMap.cargos_jogos_9) { RemoveRole(reaction, user, "729730698038083585"); } //Cod
		}
		//Cargos - notificações.
		else if (reaction.message.id.toString() === messageListener.cargos3[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.cargos_notifica_1 &&
				reaction.emoji.name != emojiMap.cargos_notifica_2 &&
				reaction.emoji.name != emojiMap.cargos_notifica_3) { reaction.remove(); return; }

			//Adding the Registro Role.
			AddRole(reaction, user, "608431408762978335"); //Registro
			//Adding desired roles.
			if (reaction.emoji.name === emojiMap.cargos_notifica_1) { RemoveRole(reaction, user, "500288579730276372"); } //Notificar
			else if (reaction.emoji.name === emojiMap.cargos_notifica_2) { RemoveRole(reaction, user, "642468342120185896"); } //Lives
			else if (reaction.emoji.name === emojiMap.cargos_notifica_3) { RemoveRole(reaction, user, "680963908260855826"); } //Novidades
		}
		//Regras.
		else if (reaction.message.id.toString() === messageListener.regras[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.regras) { reaction.remove(); return; }

			//Adding desired roles.
			AddRole(reaction, user, "620286876959506455"); //Regras
			AddRole(reaction, user, "451010259318734849"); //Inscrito
			AddRole(reaction, user, "635878165440364577"); //Ranking
			AddRole(reaction, user, "635877686333407253"); //Conquistas
			AddRole(reaction, user, "608431388730982402"); //Guilda
			AddRole(reaction, user, "608430989609533453"); //Economia
			AddRole(reaction, user, "608431408762978335"); //Registro
			AddRole(reaction, user, "609386621753884682"); //Jogos
		}
		//Novidades.
		else if (reaction.message.id.toString() === messageListener.novidades[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.novidades) { reaction.remove(); return; }

			//Adding desired roles.
			RemoveRole(reaction, user, "680963908260855826"); //Novidades
		}
		//Notificações.
		else if (reaction.message.id.toString() === messageListener.notificacoes[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.notificacoes) { reaction.remove(); return; }

			//Adding desired roles.
			RemoveRole(reaction, user, "642468342120185896"); //Lives
			RemoveRole(reaction, user, "500288579730276372"); //Notificar
		}
		//Sorteios.
		else if (reaction.message.id.toString() === messageListener.sorteios[0].messageID) {
			//Checking for valid emojis.
			if (reaction.emoji.name != emojiMap.sorteios) { reaction.remove(); return; }

			//Adding desired roles.
			RemoveRole(reaction, user, "705619867440513026"); //Sorteios
		}
	}
};

//Add a role if the user don't already have it.
async function AddRole(reaction, user, roleID) {
	//First we need to get the desired user.
	let member = await reaction.message.guild.members.fetch(user.id);
	//Then we get the role ID.
	let role = reaction.message.guild.roles.cache.find(role => role.id === roleID);

	//If the user don't have the role, we add it.
	if (!member.roles.cache.has(role.id)) { await member.roles.add(role).catch(console.error); }
}

//Removes a role from a user.
async function RemoveRole(reaction, user, roleID) {
	//First we need to get the desired user.
	let member = await reaction.message.guild.members.fetch(user.id);
	//Then we get the role ID.
	let role = reaction.message.guild.roles.cache.find(role => role.id === roleID);

	//If the user don't have the role, we add it.
	if (member.roles.cache.has(role.id)) { await member.roles.remove(role).catch(console.error); }
}

//Trigger a role.
async function TriggerRole(reaction, user, roleID) {
	//First we need to get the desired user.
	let member = await reaction.message.guild.members.fetch(user.id);
	//Then we get the role ID.
	let role = reaction.message.guild.roles.cache.find(role => role.id === roleID);

	//If the user don't have the role, we add it, else, we remove it.
	if (!member.roles.cache.has(role.id)) { await member.roles.add(role).catch(console.error); }
	else { await member.roles.remove(role).catch(console.error); }
}