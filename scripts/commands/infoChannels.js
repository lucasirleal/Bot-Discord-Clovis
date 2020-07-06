//Main dependencies.
const Discord    = require('discord.js');
const fs         = require('fs');
//JSON paths.
const path       = require('path');
const pathToJson = path.resolve(__dirname, '../JSON/config.json');

module.exports = {
	//Updates all info channels.
	Update: function (client, isForced, message, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());
		//Updates the Membros count.
		if (configs.canalMembros != "0")
		{
			client.channels.cache.find(ch => ch.id === configs.canalMembros).setName("👥 Membros: " + client.guilds.cache.first().memberCount).catch(console.error);
		}
		//Updates the Canais count.
		if (configs.canalCanais != "0")
		{
			client.channels.cache.find(ch => ch.id === configs.canalCanais).setName("📚 Canais: " + client.guilds.cache.first().channels.cache.filter((c) => c.type === "text" || c.type === "voice").size).catch(console.error);
		}
		//If the message was forced, we send a reply.
		if (isForced && message) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setTitle(":calling: Os canais de informação foram atualizados.")
				.setDescription("Não viu a mudança? O discord bloqueia mudanças muito frequentes no nome dos canais. Tente novamente em alguns minutos.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			message.channel.send(embed);
        }
	}
};