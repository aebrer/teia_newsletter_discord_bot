import { InitCommands } from './commands.js'
import { CommandHandler } from './command-handler.js'
import { NotifierCheck, SetNotifierChannel } from './notifier.js'
import DiscordJS, { CategoryChannel, Intents } from 'discord.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
dotenv.config()

import serverSchema from "./schemas/server-schema.js"
const ServerList = mongoose.model("server", serverSchema)

export const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

// Called on Client Ready
client.on('ready', async () => {
    await mongoose.connect(process.env.MONGO_URI, { keepAlive: true })

    console.log("ready")

    const guildId = process.env.SERVER_ID.toString();

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

// Called on server join
client.on('guildCreate', async (guild) => {
    console.log("joined new server")
    let _messageText = "Heyo! I'm here to give you notifications for teia/fx(hash) pieces. This channel has been registered as the main notification channel, but a server administrator can change that using `/notifychannel`";
    let chan = undefined;
    // Go through all channels in the newly joined server
    guild.channels.cache.map((channel) => {
        //console.log(channel);
        if(chan === undefined){
            // Only filter by text channels that the bot can view and has permission to send messages in
            if(channel.type === "GUILD_TEXT"){
                if(channel.permissionsFor(client.user).has("VIEW_CHANNEL") === true) {
                    if(channel.permissionsFor(client.user).has("SEND_MESSAGES") === true) {
                        console.log("found the channel");
                        chan = channel;
                    }
                }
            }
        }
    });

    if(chan !== undefined){
        // Once a server is found, see if it exists in the database
        let _server = await ServerList.find({id: guild.id});
        console.log(_server)
        if(_server.length == 0){
            // If it doesn't, create a new entry with the first channel found being set as the default
            let _newServer = new ServerList({
                id: guild.id,
                channel: chan.id,
            })
            await _newServer.save();
            chan.send(_messageText);
        }else{
            // If it does, check to see if the specified channel still exists
            let _channel = guild.channels.cache.get(_server[0].channel)
            if(_channel === undefined){
                // If it doesn't, specify this channel as the new channel
                _server[0].channel = chan.id;
                chan.send(_messageText);
            }else{
                // Otherwise, send the join message to the pre-existing `_channel`
                _channel.send(_messageText);
            }
        }
    }
});

client.login(process.env.TOKEN)