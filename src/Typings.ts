import { Client, Message } from "discord.js";
import Bot from "./Bot";

export type EventHandler = {
    name: string;
    init(client: Client, bot: Bot): void;
};

export type BotCommand = {
    name: string;
    command: string;
    description: string;
    exec(bot: Bot, cmd: Message, args: string[]): void;
};

export type SpecialReplies = {
    name: string;
    priority: number;
    exec(bot: Bot, msg: Message): boolean;
}
