import { Client, Message } from "discord.js";

import fs from "fs";
import path from "path";

import { EventHandler, BotCommand, SpecialReplies } from "./Typings";
import { botId } from "./config.json";

class Bot {
    client: Client;
    commands: Map<string, BotCommand>;
    replies: SpecialReplies[];

    constructor(client: Client) {
        console.log("Initializing bot");
        this.client = client;
        this.commands = new Map();
        this.replies = [];

        this.LoadEventListeners();
        this.LoadCommands();
        this.loadSpecialReplies();
    }

    LoadEventListeners(): void {
        // init listeners
        const listeners_path = path.join(__dirname, "listeners");
        const listeners_files = fs.readdirSync(listeners_path);
        for (let file of listeners_files) {
            const handler: EventHandler = require(path.join(
                listeners_path,
                file
            ));
            handler.init(this.client, this);
            console.log(`Added event listener: ${handler.name}`);
        }
    }

    LoadCommands(): void {
        // init commands
        this.commands.clear();
        const commands_path = path.join(__dirname, "commands");
        const commands_files = fs.readdirSync(commands_path);
        for (let file of commands_files) {
            const command: BotCommand = require(path.join(commands_path, file));
            this.commands.set(command.name, command);
            console.log(`Added command: ${command.name}`);
        }
    }

    loadSpecialReplies(): void {
        const replies_path = path.join(__dirname, "replies");
        const replies_files = fs.readdirSync(replies_path);
        for (let file of replies_files) {
            const reply: SpecialReplies = require(path.join(
                replies_path,
                file
            ));
            this.replies.push(reply);
            console.log(`Added special reply: ${reply.name}`);
        }
        this.replies.sort((a: SpecialReplies, b: SpecialReplies): number => {
            let pa = a.priority;
            let pb = b.priority;
            if (pa > pb) return -1;
            else if (pa < pb) return 1;
            else return 0;
        });
    }

    IssueCommand(message: Message): void {
        let cmd: string | undefined = message.content;

        // parse command
        let tokens: string[] = cmd
            .slice(2)
            .split(/[\s]+/)
            .filter((tok) => tok.length > 0)
            .map((tok) => tok.toLowerCase());
        cmd = tokens.shift();

        // execute command if exists
        if (cmd) {
            let bot_cmd = this.commands.get(cmd);
            if (bot_cmd) {
                bot_cmd.exec(this, message, tokens);
                console.log("Command called!");
                console.log(`  who: \'${message.author.username}\'`);
                console.log(`  cmd: \'${cmd}\'`);
                console.log(`  arg: \'${tokens}\'`);
            } else {
                message.reply("command not found :broken_heart:");
            }
        } else {
            const emoji = this.client.emojis.cache.get("940859969710989312");
            if (emoji) message.reply(emoji.toString());
            else message.reply(":question:");
        }
    }

    CheckSpecialReplies(message: Message): void {
        for (let reply of this.replies) {
            if (reply.exec(this, message)) {
                return;
            }
        }
    }
}

export default Bot;
