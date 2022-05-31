import { NotifierAdd } from './notifier/notifier.js'

export async function CommandHandler(interaction){
    const {commandName, options, user} = interaction;

    // NotifyAdd
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

    // NotifyChannel
    if(commandName === "notifychannel"){
        
        let _reply = "You can only perform this command if you are a server administrator."

        // Reply with a message only the person who typed the command can see
        interaction.reply({
            content: _reply,
            ephemeral: true,
        });
    }
}