import { EventHandler } from "src/Typings";

import { Message } from "discord.js";
import Bot from "../Bot";
import { botId } from "../data/config.json";

let handler: EventHandler = {
    name: "messageCreate",
    init: (bot: Bot): void => {
        const client = bot.client;
        client.on("messageCreate", async (message: Message) => {
            if (message.author.id == botId) {
                return;
            }

            if (message.content.startsWith("n?")) {
                bot.IssueCommand(message);
            } else {
                bot.CheckSpecialReplies(message);
            }
        });
    },
};

module.exports = handler;
