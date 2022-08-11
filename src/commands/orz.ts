import { Message, Snowflake } from "discord.js";
import { BotCommand } from "../Typings";
import { botId } from "../config.json"
import Bot from "../Bot";
import BotDatabase from "../BotDatabase";

let db = BotDatabase.getInstance();

let orzed_count: Map<Snowflake, number>;
let orzing_count: Map<Snowflake, number>;

function LoadOrzCount() {
    orzed_count = db.GetValueMap("orzed_count");
    orzing_count = db.GetValueMap("orzing_count");
}

function SaveOrzCount() {
    db.SetValue("orzed_count", Array.from(orzed_count.entries()));
    db.SetValue("orzing_count", Array.from(orzing_count.entries()));
    db.Save();
}

let cmd: BotCommand = {
    name: "orz",
    command: "orz",
    description: "orz a person",
    exec: (bot: Bot, cmd: Message, args: string[]): void => {
        if (cmd.mentions.members) {
            let msg = "";
            cmd.mentions.members.each((user) => {
                let cnt: number | undefined = orzed_count.get(user.id);
                if (cnt == undefined) cnt = 0;
                cnt++;
                orzed_count.set(user.id, cnt);
                msg += `${user.toString()} 好強！已經發電 ${cnt} 次了！\n`;
            });
            if (msg.length > 0) {
                cmd.channel.send({
                    content: msg,
                    allowedMentions: { users: [] },
                });
            } else {
                cmd.channel.send("<:asleep:940860160736391228>");
            }

            let cnt: number | undefined = orzing_count.get(cmd.author.id);
            if(cnt == undefined) cnt = 0;
            cnt += cmd.mentions.members.size;
            orzing_count.set(cmd.author.id, cnt);

            SaveOrzCount();
        }
    },
};

LoadOrzCount();
module.exports = cmd;
