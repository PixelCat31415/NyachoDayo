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

let db = BotDatabase.getDB();

type Record = {
    user_id: Snowflake;
    cnt_orzed: number;
    cnt_orzing: number;
}

async function GetCount(user_id: Snowflake): Promise<Record> {
    let res = await db.get(`
        SELECT * FROM Orz WHERE user_id = ${user_id};
    `);
    if(res == undefined) {
        await db.exec(`
            INSERT INTO Orz (user_id) VALUES (${user_id});
        `);
        res = {
            user_id: user_id,
            cnt_orzed: 0,
            cnt_orzing: 0
        };
    }
    return res;
}

async function UpdateCount(user_id: Snowflake, orzed: number, orzing: number): Promise<void> {
    let cur_cnt = await GetCount(user_id);
    orzed += cur_cnt.cnt_orzed;
    orzing += cur_cnt.cnt_orzing;
    await db.exec(`
        UPDATE Orz SET cnt_orzed = ${orzed} WHERE user_id = ${user_id};
        UPDATE Orz SET cnt_orzing = ${orzing} WHERE user_id = ${user_id};
    `);
}

async function DoOrz(bot: Bot, msg: Message, args: string[]) {
    let reply_msg = "";
    let orzing = 0;

    let DoOrzSingle = async (data: UserResolvable) => {
        let user: User = await bot.client.users.fetch(data);
        await UpdateCount(user.id, 1, 0);
        let cnt: number = (await GetCount(user.id)).cnt_orzed;
        reply_msg += `${user.toString()} 好強！已經發電 ${cnt} 次了！\n`;
        orzing++;
    };
    let orz_list: Promise<void>[] = [];

    let seen_ids: Record[] = await db.all(`
        SELECT user_id FROM Orz;
    `);

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
            let match = seen_ids.filter((it) => {
                let user = bot.client.users.resolve(it.user_id);
                if (user) {
                    let username: string = user.username.toLowerCase();
                    if (username.includes(arg)) return true;
                }
                return false;
            });
            if (match.length == 1) return orz_list.push(DoOrzSingle(match[0].user_id));
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

    UpdateCount(msg.author.id, 0, orzing);
}

async function ListOrzRank(bot: Bot, msg: Message, args: string[]) {
    let list_all = false;
    if (args.includes("all") || args.includes("a")) list_all = true;
    let rev = false;
    if (args.includes("rev") || args.includes("r")) rev = true;

    let embed = new EmbedBuilder().setColor(0x1f1e33);
    if (rev) embed.setTitle("n?orz 膜拜排行榜");
    else embed.setTitle("n?orz 發電排行榜");

    let cur_rank = 0;
    let last_count = Infinity;

    let sort_key = (rev ? "cnt_orzing" : "cnt_orzed");
    let entries: Record[] = await db.all(`
        SELECT * FROM Orz ORDER BY ${sort_key} DESC;
    `);

    entries
        .filter((it) => {
            let id = it.user_id;
            let user = bot.client.users.cache.get(`${id}`);
            if (!user) return false;
            if (list_all) return true;
            return !user.bot;
        })
        .forEach((it, i) => {
            let id = it.user_id;
            let cnt = (rev ? it.cnt_orzing: it.cnt_orzed);

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
    enabled: true,
    exec: async (bot: Bot, cmd: Message, args: string[]): Promise<void> => {
        if (args[0] == "rank") {
            ListOrzRank(bot, cmd, args);
        } else {
            DoOrz(bot, cmd, args);
        }
    },
    init: async (bot: Bot): Promise<void> => {
        let is_table_exist = await db.get(`
            SELECT name FROM sqlite_schema WHERE type = 'table' AND name = 'Orz';
        `);
        if(!is_table_exist) {
            await db.exec(
                `CREATE TABLE Orz(
                    user_id TEXT PRIMARY KEY,
                    cnt_orzed INT DEFAULT 0,
                    cnt_orzing INT DEFAULT 0
                );`
            )
        }
    }
};

module.exports = cmd;
