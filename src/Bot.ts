import { Client, Message } from "discord.js"

import fs from "fs"
import path from "path"

import { EventHandler, BotCommand } from "./Typings";

class Bot {
  client: Client;
  commands: Map<string, BotCommand>;

  constructor(client: Client) {
    console.log("Initializing bot");
    this.client = client;
    this.commands = new Map();

    this.LoadEventListeners();
    this.LoadCommands();
  }

  LoadEventListeners(): void {
    // init listeners
    const listeners_path = path.join(__dirname, "listeners");
    const listeners_files = fs.readdirSync(listeners_path);
    for (let file of listeners_files) {
      const handler: EventHandler = require(path.join(listeners_path, file));
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

  IssueCommand(message: Message): void {
    let cmd: string | undefined = message.content;

    // parse command
    let tokens: string[] = cmd
      .slice(2)
      .split(/[\s]+/)
      .filter(tok => tok.length > 0)
      .map(tok => tok.toLowerCase());
    cmd = tokens.shift();

    // execute command if exists
    if (cmd) {
      let bot_cmd = this.commands.get(cmd);
      if (bot_cmd) {
        bot_cmd.exec(this, message, tokens);
        console.log("Command called!")
        console.log(`  who: \'${message.author.username}\'`);
        console.log(`  cmd: \'${cmd}\'`);
      } else {
        message.reply("command not found :broken_heart:");
      }
    } else {
      message.reply("<:what:940859969710989312>");
    }
  }
}

export default Bot;
