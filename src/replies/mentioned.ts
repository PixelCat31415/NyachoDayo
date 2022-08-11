import { SpecialReplies } from "src/Typings";
import { Message } from "discord.js";
import Bot from "../Bot";
import { botId } from "../config.json";

let reply: SpecialReplies = {
    name: "who_pinged_me",
    priority: 10,
    exec: (bot: Bot, msg: Message): boolean => {
        if (
            // check if Nyacho get mentioned
            msg.mentions.has(botId) &&
            // don't act if mentioning by replying to Nyacho
            !(msg.mentions.repliedUser && msg.mentions.repliedUser.id === botId)
        ) {
            msg.reply({
                files: [
                    "https://c.tenor.com/fQ-R2Nw4OQMAAAAC/minecraft-who.gif",
                ],
            });
            return true;
        }
        return false;
    },
};

module.exports = reply;
