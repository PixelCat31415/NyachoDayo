import {
    Message,
    Snowflake,
    EmbedBuilder,
    User,
    UserResolvable,
    Collection,
    GuildMember,
} from "discord.js";
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

async function DoOrz(bot: Bot, msg: Message, args: string[]) {
    let reply_msg = "";
    let orzing = 0;

    let DoOrzSingle = async (data: UserResolvable) => {
        let user: User = await bot.client.users.fetch(data);
        let cnt: number | undefined = orzed_count.get(user.id);
        if (cnt == undefined) cnt = 0;
        cnt++;
        orzed_count.set(user.id, cnt);
        reply_msg += `${user.toString()} 好強！已經發電 ${cnt} 次了！\n`;
        orzing++;
    };
    let orz_list: Promise<void>[] = [];

    let guild_members: Collection<string, GuildMember> | undefined;
    if (msg.guild) guild_members = await msg.guild.members.fetch();
    args.forEach((arg) => {
        arg = arg.toLowerCase();
        // check by id
        if ((() => {
            let user = bot.client.users.cache.get(`${arg}`);
            if (user) return orz_list.push(DoOrzSingle(user));
        })()) return;
        // check by username (users seen before)
        if ((() => {
            let match = Array.from(orzed_count.keys()).filter((id) => {
                let user = bot.client.users.resolve(id);
                if (user) {
                    let username: string = user.username.toLowerCase();
                    if (username.includes(arg)) return true;
                }
                return false;
            });
            if (match.length == 1) return orz_list.push(DoOrzSingle(match[0]));
        })()) return;;
        // check by username (guild members)
        if ((() => {
            if (guild_members) {
                let match = Array.from(guild_members.keys()).filter((id) => {
                    let user = bot.client.users.resolve(id);
                    if (user) {
                        let username: string = user.username.toLowerCase();
                        if (username.includes(arg)) return true;
                    }
                    return false;
                });
                if (match.length == 1)
                    return orz_list.push(DoOrzSingle(match[0]));
            }
        })()) return;
    });
    if (msg.mentions.members) {
        msg.mentions.members.each((member) => {
            orz_list.push(DoOrzSingle(member));
        });
    }
    await Promise.all(orz_list);

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
    cnt += orzing;
    orzing_count.set(msg.author.id, cnt);

    SaveOrzCount();
}

function ListOrzRank(bot: Bot, msg: Message, args: string[]) {
    let list_all = false;
    if (args.includes("--bot") || args.includes("-b")) list_all = true;
    let rev = false;
    if (args.includes("--reverse") || args.includes("-r")) rev = true;

    let embed = new EmbedBuilder().setColor(0x1f1e33);
    if (rev) embed.setTitle("n?orz 膜拜排行榜");
    else embed.setTitle("n?orz 發電排行榜");

    let cur_rank = 0;
    let last_count = Infinity;
    let entries: any[];
    if (rev) entries = Array.from(orzing_count.entries());
    else entries = Array.from(orzed_count.entries());
    entries
        .sort((a, b) => {
            if (a[1] > b[1]) return -1;
            if (a[1] < b[1]) return 1;
            return 0;
        })
        .filter((it) => {
            if (list_all) return true;
            let id = it[0];
            let user = bot.client.users.cache.get(`${id}`);
            if (!user) return false;
            return !user.bot;
        })
        .forEach((it, i) => {
            let [id, cnt] = it;

            if (last_count != cnt) cur_rank = i;
            last_count = cnt;

            let msg: string;
            if (rev) msg = `<@${id}> - orzing ${cnt} times`;
            else msg = `<@${id}> - orzed ${cnt} times`;
            embed.addFields({
                name: `#${cur_rank}`,
                value: msg,
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
            ListOrzRank(bot, cmd, args);
        } else {
            DoOrz(bot, cmd, args);
        }
    },
};

LoadOrzCount();
module.exports = cmd;
