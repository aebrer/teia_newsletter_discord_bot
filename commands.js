import DiscordJS, { Intents } from 'discord.js'

// Create Commands
export function InitCommands(commands){

    // NotifyAdd
    commands?.create({
        name: "notifyadd",
        description: "Get notified of OBJKT/GENTK releases from a wallet address (optional tag filter)",
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

    // NotifyRemove
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
                description: "The wallet address you'd like to stop fetching from",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
            },
            {
                name: "tag",
                description: "The tag you'd like to remove",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
            }
        ]
    })

    // NotifyAddRole
    commands?.create({
        name: "notifyaddrole",
        description: "Get notified of OBJKT/GENTK releases from a wallet address to a specified role (optional tag filter)",
        options: [
            {
                name: "role",
                description: "The role you'd like to notify",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.ROLE,
                required: true,
            },
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
            },
            {
                name: "channel",
                description: "The channel to push notifications to",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.CHANNEL
            }
        ]
    })

    // NotifyRemoveRole
    commands?.create({
        name: "notifyremoverole",
        description: "Stop receiving notifications for specific releases to a specified role",
        options: [
            {
                name: "role",
                description: "The role you'd like to stop notifying",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.ROLE,
                required: true,
            },
            {
                name: "platform",
                description: "`teia` or `fxhash`",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
            },
            {
                name: "address",
                description: "The wallet address you'd like to stop fetching from",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
            },
            {
                name: "tag",
                description: "The tag you'd like to remove",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
            }
        ]
    })

    // NotifyChannel
    commands?.create({
        name: "notifychannel",
        description: "Set the notification channel",
        options: [
            {
                name: "channel",
                description: "The channel to output notifications to",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.CHANNEL,
                required: true,
            }
        ]
    })
}