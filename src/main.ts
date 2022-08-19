console.log("Process starting");

// create front end for keeping bot alive
import http from "http";
const server = http.createServer((req, res) => res.end("Bot is alive!"));
server.listen(3000);

// create bot
import Bot from "./Bot";
let bot = new Bot();

// start bot as NyachoDayo
import { TOKEN } from "./data/config.json";
bot.start(TOKEN);

// listen to & destruct on process terminating
process.on("SIGTERM", () => {
    bot.quit();
    server.close(() => {
        console.log("Process terminated");
        process.exit(0);
    });
});

// listen to & terminate on CLI interrupt
const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on("keypress", (str, key) => {
    if (key.ctrl && key.name === "c") {
        process.kill(process.pid, "SIGTERM");
    }
});
