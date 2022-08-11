// create front end for keeping bot alive
import http from "http";
http.createServer((req, res) => res.end("Bot is alive!")).listen(3000);

// NyachoDayo bot
// literally copied all intents
import { Client, GatewayIntentBits } from "discord.js";

console.log("Bot is starting...");
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
    ],
    presence: { status: "online" },
});

// create bot functionality
import Bot from "./Bot";
let bot = new Bot(client);

// login as NyachoDayo
import { TOKEN } from "./config.json";
client.login(TOKEN);
