import { NotifierCheck } from './notifier/notifier-checker.js'
import { NotifierAdd } from './notifier/notifier.js'
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

    commands?.create({
        name: "notifyadd",
        description: "Get notifications for new OBJKT/GENTK releases from a specified wallet address (optional tag filter)",
        options: [
            {
                name: "platform",
                description: "`teia` or `fxhash`",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
            },
            {
                name: "address",
                description: "The wallet address you'd like to fetch from",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
            },
            {
                name: "tag",
                description: "The tag you'd like to be notified of",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
            }
        ]
    })

    commands?.create({
        name: "notifyremove",
        description: "Stop receiving notifications for specific releases",
        options: [
            {
                name: "platform",
                description: "`teia` or `fxhash`",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
            },
            {
                name: "address",
                description: "The wallet address you'd like to fetch from",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
            },
            {
                name: "tag",
                description: "The tag you'd like to be notified of",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
            }
        ]
    })

    NotifierCheck();
});

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()) return;

    const {commandName, options, user} = interaction;

    if(commandName === "notifyadd"){
        let _platform = options.getString("platform").toLowerCase();
        let _address = options.getString("address");
        let _tag = options.getString("tag");

        let _reply = "`" + _platform + "` is not a valid platform. Accepted platforms are `teia` and `fxhash`."
        
        if(_platform === "teia" || _platform === "fxhash"){
            NotifierAdd(user.toString(), _platform, _address, _tag);
            _reply = "You will be notified";
        }

        interaction.reply({
            content: _reply,
            ephemeral: true,
        });
    }
});

client.login(process.env.TOKEN)