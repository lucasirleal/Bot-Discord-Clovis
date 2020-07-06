module.exports = {

	//Sigle command for the SAY function.
	Say: function (message, args) {
		//If no text is given, we just delete the message.
		if (!args.length) {
			message.delete();
			return;
		}
		//Grouping up all arguments on a single string.
		var text = "";

		for (i = 0; i < args.length; i++) {
			text += args[i];
			text += " ";
		}
		//Re-sending the message.
		message.channel.send(text);
		message.delete();
    }
};