import { EventHandler } from "src/Typings";

import { Client } from "discord.js";
import Bot from "../Bot";

let handler: EventHandler = {
    name: "ready",
    init: (client: Client, bot: Bot): void => {
        client.on("ready", async () => {
            if (!client.user || !client.application) {
                return;
            }

            console.log(`${client.user.username} is online`);
        });
    },
};

module.exports = handler;
