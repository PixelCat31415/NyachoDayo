import { SpecialReplies } from "src/Typings";
import { Message } from "discord.js";
import Bot from "../Bot";

let reply: SpecialReplies = {
    name: "wei",
    priority: 10,
    exec: (bot: Bot, msg: Message): boolean => {
        if (
            msg.content.match(/^[\s]*<:wei:1006227804070883358>[\s]*$/)
        ) {
            msg.channel.send({
                files: [
                    "https://c.tenor.com/kFQDJcTksN8AAAAC/%E6%9D%B0%E5%93%A5.gif",
                ],
            });
            return true;
        }
        return false;
    },
};

module.exports = reply;
