import { Client, Message } from "discord.js";
import Bot from "./Bot";

export type EventHandler = {
    // displayed name
    name: string;
    // register event listener for client
    init(bot: Bot): void;
};

export type BotCommand = {
    // displayed name
    name: string;
    // command led by "n?"
    command: string;
    // brief discription
    description: string;
    // execute command
    exec(bot: Bot, cmd: Message, args: string[]): Promise<void>;
};

export type SpecialReplies = {
    // displayed name
    name: string;
    // the higher, the earlier this rule gets checked
    priority: number;
    // check & do reply. ends checking if returned ture
    exec(bot: Bot, msg: Message): boolean;
};
