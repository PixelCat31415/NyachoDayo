import { Message, Snowflake, EmbedBuilder } from "discord.js";
import { BotCommand } from "../Typings";
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

function DoOrz(msg: Message) {
    if (msg.mentions.members) {
        let reply_msg = "";
        msg.mentions.members.each((user) => {
            let cnt: number | undefined = orzed_count.get(user.id);
            if (cnt == undefined) cnt = 0;
            cnt++;
            orzed_count.set(user.id, cnt);
            reply_msg += `${user.toString()} 好強！已經發電 ${cnt} 次了！\n`;
        });
        if (reply_msg.length > 0) {
            msg.channel.send({
                content: reply_msg,
                allowedMentions: { users: [] },
            });
        } else {
            msg.channel.send("<:asleep:940860160736391228>");
        }

        let cnt: number | undefined = orzing_count.get(msg.author.id);
        if (cnt == undefined) cnt = 0;
        cnt += msg.mentions.members.size;
        orzing_count.set(msg.author.id, cnt);

        SaveOrzCount();
    }
}

function ListOrzRank(msg: Message) {
    let embed = new EmbedBuilder().setTitle("n?orz 排行榜").setColor(0x1f1e33);
    Array.from(orzed_count.entries())
        .sort((a, b) => {
            if (a[1] > b[1]) return -1;
            if (a[1] < b[1]) return 1;
            return 0;
        })
        .forEach((it, i) => {
            let [id, cnt] = it;
            embed.addFields({
                name: `#${i}`,
                value: `<@${id}> - orzed ${cnt} times`,
            });
        });
    embed.setTimestamp().setFooter({ text: "NyachoDayo bot" });
    msg.channel.send({
        embeds: [embed],
        allowedMentions: { users: [] },
    });
}

let cmd: BotCommand = {
    name: "orz",
    command: "orz",
    description: "orz a person",
    exec: (bot: Bot, cmd: Message, args: string[]): void => {
        if (args[0] == "rank") {
            ListOrzRank(cmd);
        } else {
            DoOrz(cmd);
        }
    },
};

LoadOrzCount();
module.exports = cmd;
