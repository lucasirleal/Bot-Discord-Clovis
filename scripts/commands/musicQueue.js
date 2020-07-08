//Main dependencies.
const Discord        = require('discord.js');
const fs             = require('fs');
const yts            = require('yt-search')
const ytdl           = require('ytdl-core');
//JSON paths.
const path           = require('path');
const pathToJson	 = path.resolve(__dirname, '../JSON/config.json');
const pathToJson2	 = path.resolve(__dirname, '../JSON/emojiMap.json');
const pathToJson3  	 = path.resolve(__dirname, '../JSON/messageListener.json');
//MusicQueue
var musicQueue       = new Map();
var serverQueue      = null;
var Spotify          = require('node-spotify-api');
var spotify          = new Spotify({
		id: "SPOTIFYID",
		secret: "SPOTIFYSECRET"
});
var loopingCurrent   = false;
var loopingQueue     = false;
var queueIndex       = 1;
var dispatcher       = null;
var playingSongs     = false;

module.exports = {
	//Commands that handle all music functions.

	//Adding songs and playlists to queue. This command can also be user to reconect the bot to a voice chat.
	AddToQueue: async function (message, args, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		//Setting up server queue.
		serverQueue = musicQueue.get(message.guild.id);

		//Check if the user is in a valid voice channel.
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel)
		{
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Você precisa estar em um chat de voz para usar esse comando.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}

		//Checkinf for a valid music argument, if none is given, just reconnect.
		if (!args.length)
		{
			if (!serverQueue || !serverQueue.songs.length) {
				const embed = new Discord.MessageEmbed()
					.setColor(configs.embedColor)
					.setDescription(":warning: Você precisa digitar um link de música!")
					.setFooter(new Date().toLocaleString(), avatarURL);

				return message.channel.send(embed);
			}
			//Reconnecing to a voice channel.
			try {
				var connection = await voiceChannel.join();

				//Getting the current guild.
				serverQueue = musicQueue.get(message.guild.id);
				serverQueue.connection = connection;

				//Plays the music at the position it stopped.
				await StartPlaying(message.guild, serverQueue.songs[serverQueue.currentMusic], avatarURL, message);
				return;
			} catch (err) {
				console.log(err);
				return message.channel.send(err);
			}
		}

		//Handling spotify single track requests.
		if (args[0].startsWith("https://open.spotify.com/track/")) {
			//First we separate the link to get the actual song ID.
			var firstSeparator = "/track/";
			var secondSeparator = "?si=";

			var text = args[0].split(firstSeparator);
			var text2 = text[1].split(secondSeparator);
			var spotifyResults = [];
			//Now, we use the Spotify API to get the song metadata.
			await spotify
				.request('https://api.spotify.com/v1/tracks/' + text2[0])
				.then(function (data) {
					//Fetching the song name and the artist name.
					spotifyResults.push(data.artists[0].name + " - " + data.name);
					//Handling the results.
					HandleSpotifyResults(spotifyResults, message, voiceChannel, avatarURL);
				})
				.catch(function (err) {
					console.error('Error occurred while fetching spotify data: ' + err);
					return;
				});
		}
		//Handling spotify playlist requests.
		else if (args[0].startsWith("https://open.spotify.com/playlist/")) {
			//First we separate the link to get the actual song ID.
			var firstSeparator = "/playlist/";
			var secondSeparator = "?si=";

			var text = args[0].split(firstSeparator);
			var text2 = text[1].split(secondSeparator);
			var spotifyResults = [];

			await spotify
				.request('https://api.spotify.com/v1/playlists/' + text2[0])
				.then(function (data) {
					//Fetching the song name and the artist name for all the playlist tracks.
					for (var i = 0; i < data.tracks.items.length; i++) {
						spotifyResults.push(data.tracks.items[i].track.name + " - " + data.tracks.items[i].track.artists[0].name);
					}
					//Handling the data.
					HandleSpotifyResults(spotifyResults, message, voiceChannel, avatarURL);
				})
				.catch(function (err) {
					console.error('Error occurred on spotify request: ' + err);
					return;
				});
		}
		//Youtube direct link Commands.
		else
		{
			//Getting song info.
			const songInfo = await ytdl.getInfo(args[0]);
			const song = {
				title: songInfo.title,
				url: songInfo.video_url,
				duration: songInfo.length_seconds
			};
			//Creating a new queue if none is present.
			if (!serverQueue) {
				const queueContruct = {
					textChannel: message.channel,
					voiceChannel: voiceChannel,
					connection: null,
					songs: [],
					currentMusic: 0,
					volume: 5,
					playing: true
				};

				musicQueue.set(message.guild.id, queueContruct);
				queueContruct.songs.push(song);

				//Connecting and joining.
				try {
					var connection = await voiceChannel.join();
					queueContruct.connection = connection;

					//Getting the current guild.
					serverQueue = musicQueue.get(message.guild.id);

					await StartPlaying(message.guild, queueContruct.songs[0], avatarURL, message);
				} catch (err) {
					console.log(err);
					queue.delete(message.guild.id);
					return message.channel.send(err);
				}
			}
			else {
				serverQueue.songs.push(song);
				const embed = new Discord.MessageEmbed()
					.setColor(configs.embedColor)
					.setDescription(":headphones: " + song.title + " foi **adicionada** à fila!")
					.setFooter(new Date().toLocaleString(), avatarURL);

				message.channel.send(embed);

				//If the dispatcher is not playing, restart it.
				if (!playingSongs) {
					await StartPlaying(message.guild, serverQueue.songs[serverQueue.currentMusic + 1], avatarURL, message);
				}

				return message.delete();
			}
		}
	},
	//Skips one song.
	Skip: async function (message, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());
		//Checking for a valid voice channel.
		if (!message.member.voice.channel)
		{
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Você precisa estar em um chat de voz para usar esse comando.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}
		//Checking if there is any music in the queue.
		if (!serverQueue)
		{
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Eu só posso pular músicas se tiver alguma música na fila, ora bolas!")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}
		//Ending connection of the current song.
		serverQueue.connection.dispatcher.end();
		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.setDescription(":headphones: Uma música foi pulada!")
			.setFooter(new Date().toLocaleString(), avatarURL);

		message.channel.send(embed);
	},
	//Stops the queue and removes all songs when asked for.
	Stop: async function (message, args, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());
		//Checking for a valid voice channel.
		if (!message.member.voice.channel) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Você precisa estar em um chat de voz para usar esse comando.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}

		//If the is no argument given, we'll always remove the queue.
		if (!args.length || args[0] != "keep") {
			//Ending queue.
			serverQueue.songs = [];
			if (serverQueue.connection.dispatcher) {
				serverQueue.connection.dispatcher.end();
            }
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":headphones: A fila foi **removida**.\nSe quiser apenas parar o bot, use **/stop keep**.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}
		else {
			//Ending connection.
			if (serverQueue.connection.dispatcher) {
				serverQueue.connection.dispatcher.end();
			}
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":headphones: Tudo bem então, vou pro meu cantinho.\nA fila de músicas foi **mantida**.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
        }

	},
	//Shuffles the queue.
	Shuffle: async function (message, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		//Checking for a valid voice channel.
		if (!message.member.voice.channel) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Você precisa estar em um chat de voz para usar esse comando.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}
		//Checking if there is any music in the queue.
		if (!serverQueue) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Eu só posso misturar as músicas se tiver alguma música na fila, diacho!")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}
		//Shuffles.
		serverQueue.songs = Shuffle(serverQueue.songs);
		StartPlaying(message.guild, serverQueue.songs[0], avatarURL, message);

		//Returns to music zero.
		serverQueue.currentMusic = 0;
		StartPlaying()

		//Returns a little feedback.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.setDescription(":headphones: A fila foi randomizada!")
			.setFooter(new Date().toLocaleString(), avatarURL);

		return message.channel.send(embed);
	},
	ShowQueue: async function (message, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());
		var emojis = JSON.parse(fs.readFileSync(pathToJson2).toString());
		var messageListener = JSON.parse(fs.readFileSync(pathToJson3).toString());

		queueIndex = 1;

		//Checking for a valid voice channel.
		if (!message.member.voice.channel) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Você precisa estar em um chat de voz para usar esse comando.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}
		//Checking if there is any music in the queue.
		if (!serverQueue) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Não há nenhuma música na fila!")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}
		var text = ":headphones: **Vitrola do Clóvinho:** \n\n<:love:615552071474741259> **Tocando agora:**\n";
		var currentSongFormatted = "";
		var queueFormatted = "";

		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.setFooter(new Date().toLocaleString(), avatarURL);

		var minNumber = serverQueue.currentMusic - 1;
		if (minNumber < 0) { minNumber = 0; }

		var maxNumber = serverQueue.currentMusic + 10;
		if (maxNumber > serverQueue.songs.length) { maxNumber = serverQueue.songs.length; }

		if (serverQueue.songs.length < 12) { minNumber = 0; maxNumber = serverQueue.songs.length;}

		for (var i = minNumber; i < maxNumber; i++)
		{
			//Calculating the duration of the song.
			var minutes = Math.floor(serverQueue.songs[i].duration / 60);
			var seconds = serverQueue.songs[i].duration - minutes * 60;

			if (serverQueue.currentMusic == i)
			{
				currentSongFormatted += ":small_orange_diamond: `" + PrettyPrint_Ints(i, "0", 2) + ".` `⏱️" + PrettyPrint_Ints(minutes, "0", 2) + ":" + PrettyPrint_Ints(seconds, "0", 2) + "` " + serverQueue.songs[i].title + "\n";
				queueFormatted += "> :small_orange_diamond: `" + PrettyPrint_Ints(i, "0", 2) + ".` `⏱️" + PrettyPrint_Ints(minutes, "0", 2) + ":" + PrettyPrint_Ints(seconds, "0", 2) + "` " + serverQueue.songs[i].title + "\n";
			}
			else
			{
				queueFormatted += "> :small_blue_diamond: `" + PrettyPrint_Ints(i, "0", 2) + ".` `⏱️" + PrettyPrint_Ints(minutes, "0", 2) + ":" + PrettyPrint_Ints(seconds, "0", 2) + "` " + serverQueue.songs[i].title + "\n";
            }
		}

		text += currentSongFormatted;

		if (loopingCurrent) { text += "\n:repeat_one: **Repetindo música atual:** Ativado.\n"; }
		else { text += "\n:repeat_one: **Repetindo música atual:** Desativado.\n"; }

		if (loopingQueue) { text += ":repeat: **Repetindo fila:** Ativado.\n"; }
		else { text += ":repeat: **Repetindo fila:** Desativado.\n"; }
		
		text += "\n<:derp:615552071344717837> **Essas aqui são foda:**\n";
		text += queueFormatted;

		embed.setDescription(text);

		let sent = await message.channel.send(embed);

		sent.react(emojis.queue_1);
		sent.react(emojis.queue_2);
		sent.react(emojis.queue_3);
		sent.react(emojis.queue_6);
		sent.react(emojis.queue_4);
		sent.react(emojis.queue_5);

		messageListener.queue[0].messageID = "" + sent.id;
		fs.writeFileSync(pathToJson3, JSON.stringify(messageListener));
	},
	Jump: async function (message, args, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		//Checkinf for a valid music argument.
		if (!args.length || args.length > 1) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Você precisa digitar um número para onde quer pular!")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}

		//Checking for a valid voice channel.
		if (!message.member.voice.channel) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Você precisa estar em um chat de voz para usar esse comando.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}
		//Checking if there is any music in the queue.
		if (!serverQueue) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Não há nenhuma música na fila!")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}

		//Checking if there is a music with the given number.
		if (serverQueue.songs.length - 1 < parseInt(args[0])) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: A fila só vai até a música **" + (serverQueue.songs.length - 1) + "**")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}

		serverQueue.currentMusic = parseInt(args[0]);
		StartPlaying(message.guild, serverQueue.songs[serverQueue.currentMusic], avatarURL, message);

		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.setDescription(":headphones: Pulado para a música **" + parseInt(args[0]) + "**.")
			.setFooter(new Date().toLocaleString(), avatarURL);

		return message.channel.send(embed);
	},
	SetLoopingOne: async function (message)
	{
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		loopingCurrent = !loopingCurrent;

		if (loopingCurrent) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":repeat_one: Ok, eu **vou repetir** sempre essa música.");

			let sent = await message.channel.send(embed);
			setTimeout(() => sent.delete(), 3000);
		}
		else
		{
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":repeat_one: Certo, vamos ouvir as outras músicas então.");

			let sent = await message.channel.send(embed);
			setTimeout(() => sent.delete(), 3000);
        }

	},
	SetLoopingQueue: async function (message) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		loopingQueue = !loopingQueue;

		if (loopingQueue) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":repeat: Ok, eu **vou repetir** sempre essa playlist.");

			let sent = message.channel.send(embed);
			setTimeout(() => message.delete(), 3000);
		}
		else {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":repeat: Beleza, vou parar quando a playlist acabar.");

			let sent = message.channel.send(embed);
			setTimeout(() => message.delete(), 3000);
		}

	},
	NextQueue: async function (message, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		if (serverQueue.songs.length <= 10) { return; }

		queueIndex++;

		if (serverQueue.songs.length <= queueIndex * 10) { queueIndex--; return; }

		//Checking for a valid voice channel.
		if (!message.member.voice.channel) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Você precisa estar em um chat de voz para usar esse comando.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}

		var text = ":headphones: **Vitrola do Clóvinho:** \n\n<:love:615552071474741259> **Tocando agora:**\n";
		var currentSongFormatted = "";
		var queueFormatted = "";

		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.setFooter(new Date().toLocaleString(), avatarURL);

		var minNumber = queueIndex * 10;
		if (minNumber > serverQueue.songs.length) { minNumber = serverQueue.songs.length - 10; }
		if (minNumber < 0) { minNumber = 0; }

		var maxNumber = (queueIndex * 10) + 10;
		if (maxNumber > serverQueue.songs.length) { maxNumber = serverQueue.songs.length; }

		if (serverQueue.songs.length < 11) { minNumber = 0; maxNumber = serverQueue.songs.length; }

		for (var i = minNumber; i < maxNumber; i++) {
			//Calculating the duration of the song.
			var minutes = Math.floor(serverQueue.songs[i].duration / 60);
			var seconds = serverQueue.songs[i].duration - minutes * 60;

			if (serverQueue.currentMusic == i)
			{
				queueFormatted += "> :small_orange_diamond: `" + PrettyPrint_Ints(i, "0", 2) + ".` `⏱️" + PrettyPrint_Ints(minutes, "0", 2) + ":" + PrettyPrint_Ints(seconds, "0", 2) + "` " + serverQueue.songs[i].title + "\n";
			}
			else {
				queueFormatted += "> :small_blue_diamond: `" + PrettyPrint_Ints(i, "0", 2) + ".` `⏱️" + PrettyPrint_Ints(minutes, "0", 2) + ":" + PrettyPrint_Ints(seconds, "0", 2) + "` " + serverQueue.songs[i].title + "\n";
			}
		}

		currentSongFormatted += ":small_orange_diamond: `" + PrettyPrint_Ints(serverQueue.currentMusic, "0", 2) + ".` `⏱️" + PrettyPrint_Ints(minutes, "0", 2) + ":" + PrettyPrint_Ints(seconds, "0", 2) + "` " + serverQueue.songs[serverQueue.currentMusic].title + "\n";
		text += currentSongFormatted;

		if (loopingCurrent) { text += "\n:repeat_one: **Repetindo música atual:** Ativado.\n"; }
		else { text += "\n:repeat_one: **Repetindo música atual:** Desativado.\n"; }

		if (loopingQueue) { text += ":repeat: **Repetindo fila:** Ativado.\n"; }
		else { text += ":repeat: **Repetindo fila:** Desativado.\n"; }

		text += "\n<:derp:615552071344717837> **Essas aqui são foda:**\n";
		text += queueFormatted;

		embed.setDescription(text);

		message.edit(embed);
	},
	PreviousQueue: async function (message, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		if (serverQueue.songs.length <= 10) { return; }

		queueIndex--;

		if (queueIndex < 0) { queueIndex = 0; return; }

		//Checking for a valid voice channel.
		if (!message.member.voice.channel) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Você precisa estar em um chat de voz para usar esse comando.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}

		var text = ":headphones: **Vitrola do Clóvinho:** \n\n<:love:615552071474741259> **Tocando agora:**\n";
		var currentSongFormatted = "";
		var queueFormatted = "";

		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.setFooter(new Date().toLocaleString(), avatarURL);

		var minNumber = queueIndex * 10;
		if (minNumber > serverQueue.songs.length) { minNumber = serverQueue.songs.length - 10; }
		if (minNumber < 0) { minNumber = 0; }

		var maxNumber = (queueIndex * 10) + 10;
		if (maxNumber > serverQueue.songs.length) { maxNumber = serverQueue.songs.length; }

		if (serverQueue.songs.length < 11) { minNumber = 0; maxNumber = serverQueue.songs.length; }

		for (var i = minNumber; i < maxNumber; i++) {
			//Calculating the duration of the song.
			var minutes = Math.floor(serverQueue.songs[i].duration / 60);
			var seconds = serverQueue.songs[i].duration - minutes * 60;

			if (serverQueue.currentMusic == i) {
				queueFormatted += "> :small_orange_diamond: `" + PrettyPrint_Ints(i, "0", 2) + ".` `⏱️" + PrettyPrint_Ints(minutes, "0", 2) + ":" + PrettyPrint_Ints(seconds, "0", 2) + "` " + serverQueue.songs[i].title + "\n";
			}
			else {
				queueFormatted += "> :small_blue_diamond: `" + PrettyPrint_Ints(i, "0", 2) + ".` `⏱️" + PrettyPrint_Ints(minutes, "0", 2) + ":" + PrettyPrint_Ints(seconds, "0", 2) + "` " + serverQueue.songs[i].title + "\n";
			}
		}

		currentSongFormatted += ":small_orange_diamond: `" + PrettyPrint_Ints(serverQueue.currentMusic, "0", 2) + ".` `⏱️" + PrettyPrint_Ints(minutes, "0", 2) + ":" + PrettyPrint_Ints(seconds, "0", 2) + "` " + serverQueue.songs[serverQueue.currentMusic].title + "\n";
		text += currentSongFormatted;

		if (loopingCurrent) { text += "\n:repeat_one: **Repetindo música atual:** Ativado.\n"; }
		else { text += "\n:repeat_one: **Repetindo música atual:** Desativado.\n"; }

		if (loopingQueue) { text += ":repeat: **Repetindo fila:** Ativado.\n"; }
		else { text += ":repeat: **Repetindo fila:** Desativado.\n"; }

		text += "\n<:derp:615552071344717837> **Essas aqui são foda:**\n";
		text += queueFormatted;

		embed.setDescription(text);

		message.edit(embed);
	},
	TriggerPlayPause: async function (message, avatarURL) {
		if (dispatcher.paused) {
			dispatcher.resume();
		} else {
			dispatcher.pause();
        }
	}
};


//Shuffles the music queue.
function Shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

//Plays the desired song on the current voice chat connection.
async function StartPlaying(guild, song, avatarURL, message) {
	//JSON objects.
	var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

	//If there is no song (meaning the queue ended), we return but keep the connection.
	if (!song) {
		return;
	}

	dispatcher = serverQueue.connection
		.play(ytdl(song.url))
		.on("finish", () => {
			playingSongs = false;
			if (!loopingCurrent) {
				serverQueue.currentMusic++;
			}
			if (loopingQueue && serverQueue.currentMusic >= serverQueue.songs.length) {
				serverQueue.currentMusic = 0;
			}
			StartPlaying(guild, serverQueue.songs[serverQueue.currentMusic], avatarURL, message);
		})
		.on("start", () => {
			playingSongs = true;
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":headphones: **Tocando agora:** " + song.title)
				.setFooter(new Date().toLocaleString(), avatarURL);

			message.channel.send(embed);
        })
		.on("error", (error) => {
			console.error(error);
			if (!loopingCurrent)
			{
				serverQueue.currentMusic++;
			}
			if (loopingQueue && serverQueue.currentMusic >= serverQueue.songs.length)
			{
				serverQueue.currentMusic = 0;
            }
			StartPlaying(guild, serverQueue.songs[serverQueue.currentMusic], avatarURL, message);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

//Prettyprints ints. Used for timers and numbers that require a zero left of them.
function PrettyPrint_Ints(string, pad, length) {
	return (new Array(length + 1).join(pad) + string).slice(-length);
}

//Handles spotify results by searching them on youtube first.
async function HandleSpotifyResults(results, message, voiceChannel, avatarURL) {
	//JSON objects.
	var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

	//First we iterate through the whole list.
	for (var i = 0; i < results.length; i++) {
		//Then we pass it through a web scrapper to get titles from youtube.
		await yts(results[i], async function (err, r) {
			if (err) throw err;
			//Getting a list of videos from the query.
			var videos = r.videos;
			//Getting the video metadata from YTDL.
			const songInfo = await ytdl.getInfo(videos[0].url);
			const song = {
				title: songInfo.title,
				url: songInfo.video_url,
				duration: songInfo.length_seconds
			};

			//Constructing queue.
			if (!serverQueue) {
				const queueContruct = {
					textChannel: message.channel,
					voiceChannel: voiceChannel,
					connection: null,
					songs: [],
					currentMusic: 0,
					volume: 5,
					playing: true
				};
				//Setting a new queue.
				musicQueue.set(message.guild.id, queueContruct);
				queueContruct.songs.push(song);

				//Connecting and joining.
				try {
					var connection = await voiceChannel.join();
					queueContruct.connection = connection;

					//Getting the current guild.
					serverQueue = musicQueue.get(message.guild.id);
					//Ordering for the bot to start playing the first song.
					await StartPlaying(message.guild, queueContruct.songs[0], avatarURL, message);
				} catch (err) {
					console.log(err);
					queue.delete(message.guild.id);
					return message.channel.send(err);
				}
			}
			else {
				//If there is already a queue going on, we just add it to the list.
				serverQueue.songs.push(song);

				//Returning feedbacks.
				//In case of multiple musics being added.
				if (results.length > 1 && i == results.length - 1) {
					const embed = new Discord.MessageEmbed()
						.setColor(configs.embedColor)
						.setDescription(":headphones: " + results.length + " músicas foram **adicionadas** à fila!")
						.setFooter(new Date().toLocaleString(), avatarURL);

					message.channel.send(embed);
					return message.delete();
				}
				//When only one song was added.
				else if (results.length == 1) {
					const embed = new Discord.MessageEmbed()
						.setColor(configs.embedColor)
						.setDescription(":headphones: " + serverQueue.songs[serverQueue.songs.length - 1].title + " foi **adicionada** à fila!")
						.setFooter(new Date().toLocaleString(), avatarURL);

					message.channel.send(embed);
					return message.delete();
				}

				//If the dispatcher is not playing, restart it.
				if (!playingSongs) {
					await StartPlaying(message.guild, serverQueue.songs[serverQueue.currentMusic + 1], avatarURL, message);
                }
			}
		});
    }
}