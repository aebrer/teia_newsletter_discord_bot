import mongoose from 'mongoose'
import { client } from './index.js';
import { TeiaGraphQL, FxhashGraphQL } from './queries.js';
import { MessageEmbed } from 'discord.js';

import notifySchema from "./schemas/notify-schema.js"
import serverSchema from "./schemas/server-schema.js"

const ServerList = mongoose.model("server", serverSchema)
const NotificationList = mongoose.model("notification", notifySchema)

// Initialize Checker Variables
var notifierAddresses = [];
var notifierIndex = 0;

async function NotifierPopulate(){
    notifierAddresses = [];
    let _notifiers = await NotificationList.find();
    console.log("checking: populating");
    _notifiers.forEach(_notifier => {
        notifierAddresses.push(_notifier);
    })
    console.log(notifierAddresses)
}

export async function NotifierCheck(){
    
    // If there are no addresses populated (most likely when the bot is just launched)
    if(notifierAddresses.length === 0){
        await NotifierPopulate();
    // If addresses are populated
    }else{
        // Make sure address index is within bounds
        notifierIndex = notifierIndex % notifierAddresses.length;
        let _current = notifierAddresses[notifierIndex];

        // Start Checking for new drops
        console.log("checking " + _current.address + ":")

        // TEIA
        if(_current.structTeia.users.length > 0 || _current.structTeia.tags.length > 0){
            console.log("checking: teia")
            let _responseTeia = await TeiaGraphQL(_current.address);
            if(_responseTeia){
                let _tokenTeia = _responseTeia.data.hic_et_nunc_token[0];
                var _timestampTeia = Date.parse(_tokenTeia.timestamp);
                let _timestampNew = Date.parse(_current.structTeia.timestamp);
                if(_timestampTeia > _timestampNew){
                    // NEW THING!! NOTIFY!!
                    console.log("new teia piece just dropped");
                    await NotifyDrop(_current.structTeia, {
                        platform: "teia",
                        platformUrl: "https://teia.art/objkt/",
                        id: _tokenTeia.id,
                        name: _tokenTeia.title,
                        artist: _tokenTeia.creator.name,
                        artistUrl: "https://teia.art/tz/" + _current.address,
                        thumbnail: "https://ipfs.teia.rocks/" + _tokenTeia.display_uri.replace("://", "/"),
                        timestamp: _timestampNew
                    });
                    // Update the timestamp
                    _current.structTeia.timestamp = new Date(Date.now()).toISOString();
                    _current.markModified("structTeia")
                    await _current.save();
                }else{
                    console.log("nothing new");
                }
            }
        }

        // FX HASH
        if(_current.structFxhash.users.length > 0 || _current.structFxhash.tags.length > 0){
            console.log("checking: fxhash")
            let _responseFxhash = await FxhashGraphQL(_current.address);
            if(_responseFxhash){
                let _tokenFxhash = _responseFxhash.data.user.generativeTokens[0];
                var _timestampFxhash = Date.parse(_tokenFxhash.createdAt);
                let _timestampNew = Date.parse(_current.structFxhash.timestamp);
                if(_timestampFxhash > _timestampNew){
                    // NEW THING!! NOTIFY!!
                    console.log("new fxhash piece just dropped");
                    await NotifyDrop(_current.structFxhash, {
                        platform: "fx(hash)",
                        platformUrl: "https://www.fxhash.xyz/generative/",
                        id: _tokenFxhash.id,
                        name: _tokenFxhash.name,
                        artist: _responseFxhash.data.user.name,
                        artistUrl: "https://www.fxhash.xyz/pkh/" + _current.address,
                        thumbnail: "https://gateway.fxhash2.xyz/" + _tokenFxhash.thumbnailUri.replace("://", "/"),
                        timestamp: _timestampNew
                    });
                    // Update the timestamp
                    _current.structFxhash.timestamp = new Date(Date.now()).toISOString();
                    _current.markModified("structFxhash")
                    await _current.save();
                }else{
                    console.log("nothing new");
                }
            }
        }

        notifierIndex++;
    }

    // Execute the function again after 8 seconds
    setTimeout(NotifierCheck, 8000);
}

// NotifyAdd Command
export async function NotifierAdd(_user, _platform, _address, _tag = ""){
    let _hasAddress = false;
    notifierAddresses.forEach(_not => {
        if(_not.address === _address){
            _hasAddress = true;
        }
    })
    if(!_hasAddress){
        // If the address isn't being tracked already, create a new one for the database
        console.log("adding: new index");
        await NotifierCreate(_user, _platform, _address, _tag);
    }else{
        // If the address is already being tracked, update the existing entry
        let _notifier = await NotificationList.find({address: _address});
        console.log("adding: updating");
        let _struct = _notifier[0].structTeia;
        if(_platform === "fxhash") _struct = _notifier[0].structFxhash;
        let _hasUser = false;
        for(var i=0; i<_struct.users.length; i++){
            if(_struct.users[i].user === _user.user.id) _hasUser = true;
        }
        if(_tag === null || _tag === ""){
            // If no tag, add user to the list if they weren't already there
            // TODO: If you are subscribed to tags, remove all subscribed tags
            if(!_hasUser) _struct.users.push(_user);
            else return "You are already tracking " + _platform + " pieces from `" + _address + "`";
        }else{
            if(_hasUser) return "You are already tracking " + _platform + " pieces from `" + _address + "`. You'll have to use `/notifyremove` in order to track individual tags again."
            // If a tag is specified, check to see if it's already being tracked
            var _tagIndex = -1;
            for(var i=0; i<_struct.tags.length; i++){
                if(_struct.tags[i].tag === _tag){
                    _tagIndex = i;
                    break;
                }
            }

            if(_tagIndex > -1){
                // If the tag's being tracked, check to see if the user is already tracking it
                let _hasUser = false;
                for(var i=0; i<_struct.tags[_tagIndex].users.length; i++){
                    if(_struct.tags[_tagIndex].users[i].user === _user.user) _hasUser = true;
                }
                // Add if the user isn't already there
                if(!_hasUser) _struct.tags[_tagIndex].users.push(_user)
                else return "You are already tracking " + _platform + " pieces with the tag `" + _tag + "` from `" + _address + "`";
            }else{
                // If the tag isn't being tracked, add a new entry
                _struct.tags.push({
                    tag: _tag,
                    users: [_user]
                });
            }
        }
        // Update the entry in mongoose
        if(_platform === "teia") _notifier[0].markModified("structTeia");
        else _notifier[0].markModified("structFxhash");
        await _notifier[0].save();
    }
    return "You will be notified!";
}

// First-time Notifier Creation
export async function NotifierCreate(_user, _platform, _address, _tag = null){
    let _timestamp = new Date(Date.now()).toISOString();
    let _structTeia = { timestamp: _timestamp, users: [], tags: [] };
    let _structFxhash = { timestamp: _timestamp, users: [], tags: [] };
    let _struct = _structTeia;
    if(_platform === "fxhash") _struct = _structFxhash;
    if(_tag === null || _tag === ""){
        _struct.users.push(_user);
    }else{
        _struct.tags.push({
            tag: _tag,
            users: [_user]
        });
    }
    const _notifier = new NotificationList({
        address: _address,
        structTeia: _structTeia,
        structFxhash: _structFxhash,
    })
    await _notifier.save();
}

export async function SetNotifierChannel(_guild, _channel){
    let _server = await ServerList.find({id: _guild.id})
    if(_server.length > 0 && _server[0].channel !== _channel.id){
        _server[0].channel = _channel.id;
        _server[0].markModified("channel");
        _server[0].save();
    }
}

// NOTIFICATION
async function NotifyDrop(_struct, _drop){
    let _servers = [];
    let _users = [];
    let _other = [];

    // Populate Channels and Users
    for(var i=0; i<_struct.users.length; i++){
        let _userStruct = _struct.users[i];
        if(_userStruct.channel !== ""){
            // If a channel is specified, process is separately
            _other.push(_userStruct);
        }else{
            // Otherwise, determine the users that are assigned to each server
            let _server = _userStruct.server;
            let _user = _userStruct.user;
            let _serverIndex = -1;
            for(var j=0; j<_servers.length; j++){
                if(_servers[j] === _server){
                    _serverIndex = i;
                    break;
                }
            }
            if(_serverIndex == -1){
                _servers.push(_server);
                _users.push([_user]);
            }else{
                _users[_serverIndex].push(__user);
            }
        }
    }

    // Send all the messages to each channel
    for(var i=0; i<_servers.length; i++){
        let _serverDatas = await ServerList.find({id: _servers[i]})
        if(_serverDatas.length > 0){
            NotifyMessage(_serverDatas[0].channel, _users[i], _drop);
        }
    }

    // Send messages to specified channels (typically these are role notifications)
    for(var i=0; i<_other.length; i++){
        NotifyMessage(_other[i].channel, [_other[i].user], _drop);
    }
}

async function NotifyMessage(_channelId, _users, _drop){

    let _embed = new MessageEmbed()
        .setTitle(_drop.name)
        .setURL(_drop.platformUrl + _drop.platform)
        .setAuthor({ name: _drop.artist, url: _drop.artistUrl})
        .setImage(_drop.thumbnail)
        .setTimestamp(_drop.timestamp)

    let _messageText = "A new " + _drop.platform + " piece from " + _drop.artist + " just dropped!\n";
    // Ping all the users
    for(var i=0; i<_users.length; i++){
        _messageText += _users[i];
    }
    let _channel = await client.channels.fetch(_channelId);
    _channel.send({
        content: _messageText,
        embeds: [_embed]
    })
}

async function NotifyMessageOld(_channelId, _users, _drop){
    let _messageText = "A new " + _drop.platform + " piece from " + _drop.artist + " just dropped!\n";
    if(_drop.img !== ""){
        _messageText += _drop.platformUrl + _drop.id + "\n";
    }else{
        _messageText += "<" + _drop.platformUrl + _drop.id + ">\n";
    }
    // Ping all the users
    for(var i=0; i<_users.length; i++){
        _messageText += _users[i];
    }
    let _channel = await client.channels.fetch(_channelId);
    _channel.send(_messageText)
}