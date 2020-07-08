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
var serverQueue      = {
	connection:   null,
	songs:        [],
	currentMusic: 0,
	volume:       5
};
var Spotify          = require('node-spotify-api');
var spotify          = new Spotify({
		id: "-",
		secret: "-"
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
			await Connect(voiceChannel, message, true);
			//Plays the music at the position it stopped.
			await StartPlaying(serverQueue.songs[serverQueue.currentMusic], avatarURL, message, true);
			return;
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
		else {
			//Getting song info.
			const songInfo = await ytdl.getInfo(args[0]);
			const song = {
				title: songInfo.title,
				url: songInfo.video_url,
				duration: songInfo.length_seconds
			};

			//Pushing the song.
			serverQueue.songs.push(song);
			//Connecting.
			Connect(voiceChannel, message);
			//Playing the song.
			StartPlaying(serverQueue.songs[serverQueue.currentMusic], avatarURL, message);
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
		serverQueue.currentMusic++;
		if (serverQueue.currentMusic > serverQueue.songs.length) { serverQueue.currentMusic = 0; }
		StartPlaying(serverQueue.songs[serverQueue.currentMusic], avatarURL, message, true);

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
		StartPlaying(serverQueue.songs[0], avatarURL, message);

		//Returns to music zero.
		serverQueue.currentMusic = 0;
		this.Skip(message, avatarURL);

		//Returns a little feedback.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.setDescription(":headphones: A fila foi randomizada!")
			.setFooter(new Date().toLocaleString(), avatarURL);

		return message.channel.send(embed);
	},
	//Shows an embed with a portion of the queue.
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
		if (!serverQueue || !serverQueue.songs || serverQueue.songs.length < 1) {
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
				currentSongFormatted += ":small_orange_diamond: `" + PrettyPrint_Ints(i, "0", 2) + ".` `⏱️" + PrettyPrint_Ints(minutes, "0", 2) + ":" + PrettyPrint_Ints(seconds, "0", 2) + "` " + PrettyPrint_Strings(serverQueue.songs[i].title, 40) + "\n";
				queueFormatted += "> :small_orange_diamond: `" + PrettyPrint_Ints(i, "0", 2) + ".` `⏱️" + PrettyPrint_Ints(minutes, "0", 2) + ":" + PrettyPrint_Ints(seconds, "0", 2) + "` " + PrettyPrint_Strings(serverQueue.songs[i].title, 40) + "\n";
			}
			else
			{
				queueFormatted += "> :small_blue_diamond: `" + PrettyPrint_Ints(i, "0", 2) + ".` `⏱️" + PrettyPrint_Ints(minutes, "0", 2) + ":" + PrettyPrint_Ints(seconds, "0", 2) + "` " + PrettyPrint_Strings(serverQueue.songs[i].title, 40) + "\n";
            }
		}

		text += currentSongFormatted;

		if (loopingCurrent) { text += "\n:repeat_one: Repetindo música atual: **Ativado**.\n"; }
		else { text += "\n:repeat_one: Repetindo música atual: **Desativado**.\n"; }

		if (loopingQueue) { text += ":repeat: Repetindo fila: **Ativado**.\n"; }
		else { text += ":repeat: Repetindo fila: **Desativado**.\n"; }
		
		text += "\n<:derp:615552071344717837> **Na caixinha de músicas:** (" + serverQueue.songs.length + " no total)\n";
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
	//Jumps to a desired music.
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
		StartPlaying(message.guild, serverQueue.songs[serverQueue.currentMusic], avatarURL, message, true);

		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.setDescription(":headphones: Pulado para a música **" + parseInt(args[0]) + "**.")
			.setFooter(new Date().toLocaleString(), avatarURL);

		return message.channel.send(embed);
	},
	//Sets the queue as looping the current music.
	SetLoopingOne: async function (message, avatarURL)
	{
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		loopingCurrent = !loopingCurrent;

		if (loopingCurrent) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":repeat_one: Ok, eu **vou repetir** sempre essa música.");

			let sent = await message.channel.send(embed);
			this.UpdateQueueEmbed(message, avatarURL);
			setTimeout(() => sent.delete(), 3000);
		}
		else
		{
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":repeat_one: Certo, vamos ouvir as outras músicas então.");

			let sent = await message.channel.send(embed);
			this.UpdateQueueEmbed(message, avatarURL);
			setTimeout(() => sent.delete(), 3000);
        }

	},
	//Sets the queue as looping itself.
	SetLoopingQueue: async function (message, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		loopingQueue = !loopingQueue;

		if (loopingQueue) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":repeat: Ok, eu **vou repetir** sempre essa playlist.");

			let sent = await message.channel.send(embed);
			this.UpdateQueueEmbed(message, avatarURL);
			setTimeout(() => sent.delete(), 3000);
		}
		else {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":repeat: Beleza, vou parar quando a playlist acabar.");

			let sent = await message.channel.send(embed);
			this.UpdateQueueEmbed(message, avatarURL);
			setTimeout(() => sent.delete(), 3000);
		}

	},
	//Displays the next page of the queue.
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

		this.UpdateQueueEmbed(message, avatarURL);
	},
	//Displays the previous page of the queue.
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

		this.UpdateQueueEmbed(message, avatarURL);
	},
	//Plays and resumes the current music.
	TriggerPlayPause: async function (message, avatarURL) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

		if (dispatcher.paused) {
			dispatcher.resume();
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":play_pause: Agora vamo deboxar legal com o DJ Clóvinho!");

			let sent = await message.channel.send(embed);
			setTimeout(() => sent.delete(), 3000);
		} else {
			dispatcher.pause();
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":play_pause: Esse cara aí cortou minha vibe.");

			let sent = await message.channel.send(embed);
			setTimeout(() => sent.delete(), 3000);
        }
	},
	//Updates the queue VISUALLY.
	UpdateQueueEmbed: async function (message, avatarURL) {
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

		var minNumber = queueIndex * 10;
		if (minNumber > serverQueue.songs.length) { minNumber = serverQueue.songs.length - 10; }
		if (minNumber < 0) { minNumber = 0; }

		var maxNumber = minNumber + 10;
		if (maxNumber > serverQueue.songs.length) { maxNumber = serverQueue.songs.length; }

		for (var i = 0; i < serverQueue.songs.length; i++) {
			//Calculating the duration of the song.
			var minutes = Math.floor(serverQueue.songs[i].duration / 60);
			var seconds = serverQueue.songs[i].duration - minutes * 60;

			if (serverQueue.currentMusic == i)
			{
				currentSongFormatted += ":small_orange_diamond: `" + PrettyPrint_Ints(i, "0", 2) + ".` `⏱️" + PrettyPrint_Ints(minutes, "0", 2) + ":" + PrettyPrint_Ints(seconds, "0", 2) + "` " + PrettyPrint_Strings(serverQueue.songs[i].title, 40) + "\n";
				if (i >= minNumber && i <= maxNumber)
				{
					queueFormatted += "> :small_orange_diamond: `" + PrettyPrint_Ints(i, "0", 2) + ".` `⏱️" + PrettyPrint_Ints(minutes, "0", 2) + ":" + PrettyPrint_Ints(seconds, "0", 2) + "` " + PrettyPrint_Strings(serverQueue.songs[i].title, 40) + "\n";
                }
			}
			else if (i >= minNumber && i <= maxNumber)
			{
				queueFormatted += "> :small_blue_diamond: `" + PrettyPrint_Ints(i, "0", 2) + ".` `⏱️" + PrettyPrint_Ints(minutes, "0", 2) + ":" + PrettyPrint_Ints(seconds, "0", 2) + "` " + PrettyPrint_Strings(serverQueue.songs[i].title, 40) + "\n";
			}
		}

		text += currentSongFormatted;

		if (loopingCurrent) { text += "\n:repeat_one: Repetindo música atual: **Ativado**.\n"; }
		else { text += "\n:repeat_one: Repetindo música atual: **Desativado**.\n"; }

		if (loopingQueue) { text += ":repeat: Repetindo fila: **Ativado**.\n"; }
		else { text += ":repeat: Repetindo fila: **Desativado**.\n"; }

		text += "\n<:derp:615552071344717837> **Na caixinha de músicas:** (" + serverQueue.songs.length + " no total)\n";
		text += queueFormatted;

		embed.setDescription(text);

		message.edit(embed);
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
async function StartPlaying(song, avatarURL, message, forceReset = false) {
	//JSON objects.
	var configs = JSON.parse(fs.readFileSync(pathToJson).toString());

	//If there is no song (meaning the queue ended), we return but keep the connection.
	if (!song || (playingSongs && !forceReset)) {
		return;
	}

	if (!serverQueue.connection) {
		//Check if the user is in a valid voice channel.
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":warning: Você precisa estar em um chat de voz para usar esse comando.")
				.setFooter(new Date().toLocaleString(), avatarURL);

			return message.channel.send(embed);
		}
		await Connect(voiceChannel, message);
    }

	dispatcher = serverQueue.connection
		//Plays the song.
		.play(ytdl(song.url))
		//Called when the song is finished.
		.on("finish", () => {
			playingSongs = false;
			if (!loopingCurrent) {
				serverQueue.currentMusic++;
			}
			if (loopingQueue && serverQueue.currentMusic >= serverQueue.songs.length) {
				serverQueue.currentMusic = 0;
			}
			StartPlaying(serverQueue.songs[serverQueue.currentMusic], avatarURL, message);
		})
		//Called when the song is started.
		.on("start", async function () {
			playingSongs = true;
			const embed = new Discord.MessageEmbed()
				.setColor(configs.embedColor)
				.setDescription(":headphones: **Tocando agora:** " + song.title)
				.setFooter(new Date().toLocaleString(), avatarURL);

			let sent = await message.channel.send(embed);
			setTimeout(() => sent.delete(), 3000);
		})
		//Called on errors.
		.on("error", (error) => {
			console.error(error);
		});
	//Setting volume.
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

//Prettyprints ints. Used for timers and numbers that require a zero left of them.
function PrettyPrint_Ints(string, pad, length) {
	return (new Array(length + 1).join(pad) + string).slice(-length);
}

//Prettyprints a string limited to a fixed amount of characters.
function PrettyPrint_Strings(string, size) {
	if (string.length > size) { return string.substring(0, size) + "..."; }
	else { return string; }
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
			console.log(songInfo.title);
			const song = {
				title: songInfo.title,
				url: songInfo.video_url,
				duration: songInfo.length_seconds
			};

			//Pushing a song.
			serverQueue.songs.push(song);
			//Connecting to voice chats.
			Connect(voiceChannel, message);

			//Ordering the bot to play a music. This will be ignored if the bot is already playing something.
			StartPlaying(serverQueue.songs[0], avatarURL, message);
		});
		//Sets a little timer just so we don't run into memory issues.
		await Timer(100);
	}

	//Returning feedbacks.
	//In case of multiple musics being added.
	if (results.length > 1) {
		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.setDescription(":headphones: " + results.length + " músicas foram **adicionadas** à fila!")
			.setFooter(new Date().toLocaleString(), avatarURL);

		let sent = await message.channel.send(embed);
		setTimeout(() => sent.delete(), 3000);
	}
	//When only one song was added.
	else if (results.length == 1) {
		const embed = new Discord.MessageEmbed()
			.setColor(configs.embedColor)
			.setDescription(":headphones: " + serverQueue.songs[serverQueue.songs.length - 1].title + " foi **adicionada** à fila!")
			.setFooter(new Date().toLocaleString(), avatarURL);

		let sent = await message.channel.send(embed);
		setTimeout(() => sent.delete(), 3000);
	}
}

//Returns a Promise that resolves after "ms" Milliseconds
async function Timer(ms) {
	return new Promise(res => setTimeout(res, ms));
}

//Tries to connect to a valid voice channel.
async function Connect(voiceChannel, message, force = false) {
	//Constructing connection.
	if (!serverQueue.connection || force) {
		console.log("Constructing new connection.");
		//Connecting and joining.
		try {
			var connection = await voiceChannel.join();
			serverQueue.connection = connection;
		} catch (err) {
			console.log(err);
			return message.channel.send(err);
		}
	}
}
