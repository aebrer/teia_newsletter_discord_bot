# Teia/fx(hash) Discord Notification Bot
A discord notification bot for subscribing to teia and fx(hash) pieces from certain artists.

## How to use the bot
When in a discord server with the bot, you can use `/notifyadd` to start getting notified of new pieces from a valid tezos address that you specify. You will then be notified in that server's notification channel moving forward (The notification channel is specified by server owner).

If you no longer wish to receive notifications, you can use `/notifyremove` with the same arguments. If you're unsure of what you're set to be notified of, use `/notifiers` to see a full list of your current subscriptions.

If you're a server administrator and wish to notify members of your newest mints or the mints of another address, you can create a new role and use `/notifyaddrole` to notify an entire role of new pieces. This is very handy if you have an on-chain newsletter that you always tag with `newsletter`, then you can use another Discord bot such as [Reaction Roles](https://top.gg/bot/550613223733329920) to allow your server members to opt-in to a role that is always notified of your mints with the same tag.

## How to deploy the bot
If you'd like to deploy this bot in your own server, just fork the `main` repository and use `npm install` for first-time setup, and then `npm run dev` each time you'd like to run the bot. Before running for the first time however, you're gonna need a few prerequisites:

### 1. Make a new Application in the [Discord Developer Portal](https://discord.com/developers)

- Hit the `New Application` button in the top-right of the "Applications" menu and create a new application and name it whatever you'd like
- Click on the newly created application and then under the "Bot" tab on the left, press the `Add Bot` button next to "Build-A-Bot"
- The "Bot" tab should now show your Bot's information. Save the `TOKEN` underneath the username, you'll need it for the final step (if you don't see a token, press `Reset Token` to get a new one)

### 2. Make a new Database with [MongoDB](https://www.mongodb.com/)

(You can skip this if you are familiar with MongoDB and wish to host the database yourself without the use of their website. Just know you might have to make some minor changes to the code if this is what you end up doing.)

- Create an account or sign in if you already have one
- Create a new Project and give it whatever name you'd like
- After creating the Project, you should be brought to the "Database" menu. From there, press the `Build a Database` button and choose `Shared` to start a free database.
- Change the server provider and region to your discretion and then hit `Create Cluster` at the bottom of the page
- After creating the Cluster, you should be brought to the "Quickstart" menu. From there, setup a Username and Password for the database in step 1
- In step 2, you can either hit `Add My Current IP Address` if you plan on hosting the bot locally, or enter `0.0.0.0/0` as the IP Address if you plan on using a service such as herokuto host the bot.
- After the Cluster finished initializing, press the `Connect` button and in the window that pops up, choose `Connect your application`.
- Make sure the Driver is set to `node.js` with the version being `4.1 or later`. Save the connection string shown underneath, you'll also need it for the final step.

### 3. Set your environment variables

__**If you are hosting the bot locally do the following:**__

- Create a new file in the root directory of the bot's folder called `.env`
- Use the following template populated with the values saved from steps 1 and 2:

```
TOKEN=<discord token from step 1>
MONGO_URI=<mongodb connection string from step 2>
SERVER_ID=
```

`SERVER_ID` is meant to be left blank and is only to be used for development purposes. When a Discord Server ID is specified instead of an empty string, commands are registered exclusively for the specified server instead of globally.


__**If you are hosting the bot using heroku, do the following:**__

- Go to your [Heroku App Dashboard](https://dashboard.heroku.com/apps) and click on your bot
- Navigate to the `Settings` tab and press `Reveal Config Vars` under "Config Vars"
- Create a new entry with a key of `TOKEN` and a value of whatever you saved from step 1 and press `Add`
- Create a new entry with a key of `MONGO_URI` and a value of whatever you saved from step 2 and press `Add`
- Create one final entry with a key of `SERVER_ID` and no value and press `Add`

`SERVER_ID` is meant to be left blank and is only to be used for development purposes. It's recommended to leave this blank on heroku hosts, and to put your heroku server in Maintenence Mode when testing locally. However, if you do specify a Discord Server ID instead of an empty string, commands will be registered exclusively for the specified server instead of globally.