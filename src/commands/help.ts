import { Message } from "discord.js";
import Bot from "src/Bot";
import { BotCommand } from "src/Typings";

let cmd: BotCommand = {
    name: "help",
    command: "help",
    description: "list bot commands",
    enabled: true,
    exec: async (bot: Bot, cmd: Message, args: string[]): Promise<void> => {
        cmd.reply(
            `Commands available: ${Array.from(bot.commands.keys()).join(", ")}`
        );
    },
};

module.exports = cmd;
