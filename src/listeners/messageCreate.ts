import { EventHandler } from "src/Typings";

import { Client, Message, EmbedBuilder } from "discord.js";
import Bot from "../Bot";

let handler: EventHandler = {
  name: "messageCreate",
  init: (client: Client, bot: Bot): void => {
    client.on("messageCreate", async (message: Message) => {
      let name: string = "(anonymous)";
      if (message.member && message.member.user) {
        name = message.member.user.tag;
      }
      // console.log(`${name} created message at [${message.createdTimestamp}]: ${message.content} (${message.content.length})`);

      if (message.content.startsWith("n?")) {
        bot.IssueCommand(message);
      }

      if (client.user &&
        message.mentions.has(client.user.id) &&
        !(message.mentions.repliedUser && message.mentions.repliedUser.id === client.user.id)) {
        message.reply({
          files: ["https://c.tenor.com/fQ-R2Nw4OQMAAAAC/minecraft-who.gif"]
        });
      }

      if (message.content.match(/^[\s]*<:wei:1006227804070883358>[\s]*$/)) {
        message.channel.send({
          files: ["https://c.tenor.com/kFQDJcTksN8AAAAC/%E6%9D%B0%E5%93%A5.gif"]
        });
      }
    });
  }
}

module.exports = handler;