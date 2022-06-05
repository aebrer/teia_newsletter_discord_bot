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
                server: guildId
            };
            _reply = await NotifierAdd(_user, _platform, _address, _tag);
        }

        // Reply with a message only the person who typed the command can see
        interaction.reply({
            content: _reply,
            ephemeral: true,
        });
    }

    // NotifyChannel
    if(commandName === "notifychannel"){
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