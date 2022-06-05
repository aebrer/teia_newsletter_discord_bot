import { NotifierAdd, SetNotifierChannel } from './notifier.js'

export async function CommandHandler(interaction){
    const {guildId, commandName, options, user} = interaction;

    // NotifyAdd
    if(commandName === "notifyadd"){
        let _platform = options.getString("platform").toLowerCase();
        let _address = options.getString("address");
        let _tag = options.getString("tag");

        let _reply = "`" + _platform + "` is not a valid platform. Accepted platforms are `teia` and `fxhash`."
        
        // If the platform is valid, add the notifier
        if(_platform === "teia" || _platform === "fxhash"){
            var _user = {
                user: user,
                server: guildId,
                channel: ""
            };
            _reply = await NotifierAdd(_user, _platform, _address, _tag);
        }

        // Reply with a message only the person who typed the command can see
        interaction.reply({
            content: _reply,
            ephemeral: true,
        });
    }

    // NotifyAddRole
    else if(commandName === "notifyaddrole"){
        let _role = options.getRole("role");
        let _platform = options.getString("platform").toLowerCase();
        let _address = options.getString("address");
        let _tag = options.getString("tag");
        let _channel = options.getChannel("channel");
        if(_channel !== null) _channel = _channel.id;
        else _channel = "";

        let _reply = "You can only perform this command if you are a server administrator."

        if(interaction.channel.permissionsFor(interaction.user).has("ADMINISTRATOR") === true){
            
            if(!_role.mentionable){
                // Return error if role is not mentionable
                _reply = "The specified role must be mentionable in order to notify it."
            }else if(_platform === "teia" || _platform === "fxhash"){
                // If the platform is valid, add the notifier
                var _user = {
                    user: _role.id,
                    server: guildId,
                    channel: _channel
                };
                _reply = await NotifierAdd(_user, _platform, _address, _tag);
            }else{
                // Otherwise, return error
                _reply = "`" + _platform + "` is not a valid platform. Accepted platforms are `teia` and `fxhash`."
            }
        }

        // Reply with a message only the person who typed the command can see
        interaction.reply({
            content: _reply,
            ephemeral: true,
        });
    }

    // NotifyChannel
    else if(commandName === "notifychannel"){
        let _reply = "You can only perform this command if you are a server administrator."

        if(interaction.channel.permissionsFor(interaction.user).has("ADMINISTRATOR") === true){
            let _channel = options.getChannel("channel")

            await SetNotifierChannel(interaction.guild, _channel);
            _reply = "The channel has been successfully set to `#" + _channel.name + "`"
        }

        // Reply with a message only the person who typed the command can see
        interaction.reply({
            content: _reply,
            ephemeral: true,
        });
    }
}