import { EventHandler } from "src/Typings";

import { Client, Message } from "discord.js";
import Bot from "../Bot";
import { botId } from "../config.json";

let handler: EventHandler = {
    name: "messageCreate",
    init: (client: Client, bot: Bot): void => {
        client.on("messageCreate", async (message: Message) => {
            // let name: string = "(anonymous)";
            // if (message.member && message.member.user) {
            //     name = message.member.user.tag;
            // }
            // console.log(`${name} created message at [${message.createdTimestamp}]: ${message.content} (${message.content.length})`);

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
