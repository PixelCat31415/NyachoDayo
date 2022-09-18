import { Message } from "discord.js";
import Bot from "src/Bot";
import { BotCommand } from "src/Typings";

let cmd: BotCommand = {
    name: "quit",
    command: "quit",
    description: "list bot commands",
    enabled: false,
    exec: async (bot: Bot, cmd: Message, args: string[]): Promise<void> => {
        await cmd.reply(
            "<:ringo:900994210054946816> <:oyasumi:940859903017357332>"
        );
        process.kill(process.pid, "SIGTERM");
    },
    init: async (bot: Bot): Promise<void> => {},
};

module.exports = cmd;
