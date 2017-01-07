const auth = require("./auth.json");
const blizzard = require('blizzard.js').initialize({
    apikey: auth.blizzardAPIKey
});
const Discord = require('discord.js');
const bot = new Discord.Client();
const token = auth.botToken;


var players = [];


var setPlayerItemLevel = function(player) {
    console.log(player);

    blizzard.wow.character(['profile', 'items'], {
        realm: player.realm,
        name: player.name,
        origin: 'us'
    })
    .then(response => {
        player.averageItemLevel = response.data.items.averageItemLevel;
    });
};

var getClass = function(id) {
    switch(id) {
        case 1:
            return "Warrior";
        case 2:
            return "Paladin";
        case 3:
            return "Hunter";
        case 4:
            return "Rogue";
        case 5:
            return "Priest";
        case 6:
            return "Death Knight";
        case 7:
            return "Shaman";
        case 8:
            return "Mage";
        case 9:
            return "Warlock";
        case 10:
            return "Monk";
        case 11:
            return "Druid";
        case 12:
            return "Demon Hunter";
    }
}

var getRace = function(id) {
    switch(id) {
        case 1:
            return "Human";
        case 2:
            return "Orc";
        case 3:
            return "Dwarf";
        case 4:
            return "Night Elf";
        case 5:
            return "Undead";
        case 6:
            return "Tauren";
        case 7:
            return "Gnome";
        case 8:
            return "Troll";
        case 9:
            return "Goblin";
        case 10:
            return "Blood Elf";
        case 11:
            return "Draenei";
        case 22:
            return "Worgen";
        case 24:
            return "Pandaren";
        case 25:
            return "Pandaren";
        case 26:
            return "Pandaren";
    }
}

var getGender = function(id) {
    switch(id) {
        case 0:
            return "Male";
        case 1:
            return "Female";
    }
}

bot.on('ready', () => {
    console.log('DOSBOT ENGAGE');

    blizzard.wow.guild(['profile', 'members'], {
        realm: 'burning-blade',
        name: 'Denial of Service',
        origin: 'us'
    })
    .then(response => {
        for (var member of response.data.members) {
            if (member.rank < 4) {
                players.push({ 
                    name: member.character.name,
                    class: getClass(member.character.class),
                    race: getRace(member.character.race),
                    gender: getGender(member.character.gender),
                    level: member.character.level,
                    achievementPoints: member.character.achievementPoints,
                    realm: member.character.realm
                });
            }
        }

        for (var player of players) {
            setPlayerItemLevel(player);   
        }
    });

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
        var content = '';
        for(var player of players) {
            var line = player.name + ' ' + player.class + ' ' + player.race + ' ' + player.gender + ' ' + player.level + ' ' + player.achievementPoints + ' ' + player.realm + ' ' + player.averageItemLevel;
            content += line + "\n"
        }

        message.channel.sendMessage(content);
    }
});

// log the bot in
bot.login(token);