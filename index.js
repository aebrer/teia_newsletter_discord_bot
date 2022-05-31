import { NotifierCheck } from './notifier/notifier-checker.js'
import { NotifierAdd } from './notifier/notifier.js'
import { InitCommands } from './commands.js'
import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

// Called on Client Ready
client.on('ready', async () => {
    await mongoose.connect(process.env.MONGO_URI, { keepAlive: true })

    console.log("ready")

    const guildId = '887099999362633830';
    const guild = client.guilds.cache.get(guildId);
    let commands;

    if(guild){
        commands = guild.commands;
    }else{
        commands = client.application?.commands;
    }

    InitCommands(commands);

    NotifierCheck();
});

// Called on command interaction
client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()) return;

    const {commandName, options, user} = interaction;

    // NotifyAdd Command
    if(commandName === "notifyadd"){
        let _platform = options.getString("platform").toLowerCase();
        let _address = options.getString("address");
        let _tag = options.getString("tag");

        let _reply = "`" + _platform + "` is not a valid platform. Accepted platforms are `teia` and `fxhash`."
        
        // If the platform is valid, add the notifier
        if(_platform === "teia" || _platform === "fxhash"){
            NotifierAdd(user.toString(), _platform, _address, _tag);
            _reply = "You will be notified";
        }

        // Reply with a message only the person who typed the command can see
        interaction.reply({
            content: _reply,
            ephemeral: true,
        });
    }
});

client.login(process.env.TOKEN)