import { BotCommand } from "src/Typings";

import { Client, Message } from "discord.js";
import Bot from "../Bot";

let cmd: BotCommand = {
    name: "ping",
    command: "ping",
    description: "see if NyachoDayo is still alive",
    enabled: true,
    exec: async (bot: Bot, cmd: Message, args: string[]): Promise<void> => {
        cmd.reply("pong!");
    },
    init: async (bot: Bot): Promise<void> => {},
};

module.exports = cmd;
