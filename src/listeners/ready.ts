import { EventHandler } from "src/Typings";
import Bot from "../Bot";

let handler: EventHandler = {
    name: "ready",
    init: (bot: Bot): void => {
        const client = bot.client;
        client.on("ready", async () => {
            if (!client.user || !client.application) {
                return;
            }

            console.log(`${client.user.username} is online`);
        });
    },
};

module.exports = handler;
