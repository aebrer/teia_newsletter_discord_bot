import DiscordJS, { Intents } from 'discord.js'

// Create Commands
export function InitCommands(commands){
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
}