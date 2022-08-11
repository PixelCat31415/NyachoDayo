import { Message, Snowflake } from "discord.js";
import { BotCommand } from "../Typings";
import Bot from "../Bot";
import BotDatabase from "../BotDatabase";

let db = BotDatabase.getInstance();

let orz_count: Map<Snowflake, number>;

async function LoadOrzCount() {
    orz_count = new Map();
    let data = await db.GetValue("orz_count");
    if (data) {
        for (let it of data) {
            orz_count.set(it[0], it[1]);
        }
    }
}

async function SaveOrzCount() {
    db.SetValue("orz_count", Array.from(orz_count.entries()));
    db.Save();
}

let cmd: BotCommand = {
    name: "orz",
    command: "orz",
    description: "orz a person",
    exec: (bot: Bot, cmd: Message, args: string[]): void => {
        const channel = cmd.channel;
        if (cmd.mentions.members) {
            let msg = "";
            cmd.mentions.members.each((user) => {
                let cnt: number | undefined = orz_count.get(user.id);
                if (cnt == undefined) cnt = 1;
                else cnt++;
                orz_count.set(user.id, cnt);
                msg += `\`${user.displayName}\` 好強！已經發電 ${cnt} 次了！\n`;
            });
            if (msg.length > 0) {
                cmd.channel.send(msg);
            } else {
                cmd.channel.send("<:asleep:940860160736391228>")
            }
            SaveOrzCount();
        }
    },
};

LoadOrzCount();
module.exports = cmd;
