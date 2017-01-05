const auth = require("./auth.json");
const blizzard = require('blizzard.js').initialize({
    apikey: auth.blizzardAPIKey
});
const Discord = require('discord.js');
const bot = new Discord.Client();
const token = auth.botToken;

bot.on('ready', () => {
    console.log('DOSBOT ENGAGE');
});

// Event listener for channel messages
bot.on('message', message => {
	// TODO: break into separate functions and have this be a clean point of entry to delegate from

    // stupid test command to fiddle with - remove later
    if (message.content === '!armory aelwyd') {
        blizzard.wow.character(['profile'], {
                origin: 'us',
                realm: 'burning-blade',
                name: 'aelwyd'
            })
            .then(response => {
                message.channel.sendMessage(JSON.stringify(response.data));
            });

    }

    // kills the bot to make testing easy because I'm lazy - remove later
    if (message.content === '!exit') {
    	console.log('DOSBOT TERMINATE');
        process.exit();
    }

    // fetch the current raid roster
    if (message.content === '!roster') {
        blizzard.wow.guild(['profile', 'members'], {
                realm: 'burning-blade',
                name: 'Denial of Service',
                origin: 'us'
            })
            .then(response => {
                var roster = [];
                for (var member of response.data.members) {
                    if (member.rank < 4) {
                        roster.push(member.character.name);
                    }
                }
                message.channel.sendMessage(roster);
            });

    }
});

// log the bot in
bot.login(token);