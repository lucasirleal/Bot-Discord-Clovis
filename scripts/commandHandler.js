//Main dependencies.
const Discord          = require('discord.js');
const fs               = require('fs');
const EmbedsFAQ        = require('./embeds/embedsFaq.js');
const EmbedDicas       = require('./embeds/embedsDicas.js');
const EmbedRegras      = require('./embeds/embedsRegrasSingle.js');
const InfoChannels     = require('./commands/infoChannels.js');
const Pings            = require('./commands/pings.js');
const ChangePrefix     = require('./commands/changePrefix.js');
const ChangeEmbedColor = require('./commands/changeEmbedColor.js');
const Setups           = require('./commands/setups.js');
const Say              = require('./commands/say.js');
const Embed            = require('./commands/embed.js');
const ChannelInfo      = require('./commands/chaninfo.js');
const SetInfoChannel   = require('./commands/setInfoChannel.js');
const Avatar           = require('./commands/avatar.js');
const MusicHandler     = require('./commands/musicQueue.js');
//JSON paths.
const path             = require('path');
const pathToJson       = path.resolve(__dirname, './JSON/config.json');
//JSON objects.
var configs            = JSON.parse(fs.readFileSync(pathToJson).toString());

module.exports = {
	//Calls a function to every available command.
	HandleMessage: async function (message, client) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToJson).toString());
		//Loads in the selected prefix for the bot.
		var prefix = configs.prefix;
		//If the message given doesn't start with the prefix, we just ignore it.
		if (!message.content.startsWith(prefix) || message.author.bot) return;
		//Splits all the message content and make it lower case.
		const args = message.content.slice(prefix.length).split(/ +/);
		const command = args.shift().toLowerCase();
		//Checking for permissions. Some commands don't really need any.
		if (!message.member.hasPermission('ADMINISTRATOR')) {
			if (command != "ping" && command != "pong" && command != "beep" && command != "boop" && command != "faq" && command != "dicas") {
				//Returning a "no permission" embed.
				const embed = new Discord.MessageEmbed()
					.setColor(configs.embedColor)
					.setDescription(":shrug: Você não tem permissão pra isso não, amigão.");

				return message.channel.send(embed);
            }
		}

		switch (command) {
			//Pings and boops.
			case "ping":
				Pings.Ping(message, client.user.displayAvatarURL());
				break;
			case "pong":
				Pings.Pong(message, client.user.displayAvatarURL());
				break;
			case "beep":
				Pings.Beep(message, client.user.displayAvatarURL());
				break;
			case "boop":
				Pings.Boop(message, client.user.displayAvatarURL());
				break;
			//Regras embeds.
			case "regras":
				EmbedRegras.Setup(message, client.user.displayAvatarURL());
				break;
			//Prefix changing.
			case "changeprefix":
				ChangePrefix.Change(message, args, client.user.displayAvatarURL());
				break;
			//Embed color changing.
			case "changeembedcolor":
				ChangeEmbedColor.Change(message, args, client.user.displayAvatarURL());
				break;
			//Setting up Registro.
			case "setup-registro":
				Setups.Registro(message, args, client.user.displayAvatarURL());
				break;
			//Setting up Cargos.
			case "setup-cargos":
				Setups.Cargos(message, args, client.user.displayAvatarURL());
				break;
			//Setting up Regras.
			case "setup-regras":
				Setups.Regras(message);
				break;
			//Setting up Novidades.
			case "setup-novidades":
				Setups.Novidades(message);
				break;
			//Setting up Notificações.
			case "setup-notifica":
				Setups.Notificacoes(message);
				break;
			//Setting up Sorteios.
			case "setup-sorteios":
				Setups.Sorteios(message);
				break;
			//Say command.
			case "say":
				Say.Say(message, args);
				break;
			//Embed command.
			case "embed":
				Embed.SendEmbed(message, args);
				break;
			//Chaninfo command.
			case "chaninfo":
				ChannelInfo.GetChannelInfo(message, args, client.user.displayAvatarURL());
				break;
			//SetInfoChannel command.
			case "setinfochannel":
				SetInfoChannel.Set(message, args, client.user.displayAvatarURL());
				break;
			//ForceUpdateInfoChannels command.
			case "forceupdateinfochannels":
				InfoChannels.Update(client, true, message, client.user.displayAvatarURL());
				break;
			//FAQ Embeds.
			case "faq":
				EmbedsFAQ.FAQ1(message, client.user.displayAvatarURL());
				break;
			//Dicas Embeds.
			case "dicas":
				EmbedDicas.Dicas1(message, client.user.displayAvatarURL());
				break;
			//Avatar command.
			case "avatar":
				Avatar.Display(message, client.user.displayAvatarURL());
				break;
			//Play command.
			case "play":
				MusicHandler.AddToQueue(message, args, client.user.displayAvatarURL());
				break;
			//Skip command.
			case "skip":
				MusicHandler.Skip(message, client.user.displayAvatarURL());
				break;
			//Stop command.
			case "stop":
				MusicHandler.Stop(message, args, client.user.displayAvatarURL());
				break;
			//Shuffle command.
			case "shuffle":
				MusicHandler.Shuffle(message, client.user.displayAvatarURL());
				break;
			//Queue command.
			case "queue":
				MusicHandler.ShowQueue(message, client.user.displayAvatarURL());
				break;
			//Jump command.
			case "jump":
				MusicHandler.Jump(message, args, client.user.displayAvatarURL());
				break;
			default:
				console.log("Unexpected command: " + command);
				break;
		}
	}
};