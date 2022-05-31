import { NotifierCheck } from './notifier/notifier-checker.js'
import { InitCommands } from './commands.js'
import { CommandHandler } from './command-handler.js'
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

    // Initialize commands
    InitCommands(commands);

    // Start checking for new pieces
    NotifierCheck();
});

// Called on command interaction
client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()) return;

    // Handle the command
    await CommandHandler(interaction);
});

client.login(process.env.TOKEN)