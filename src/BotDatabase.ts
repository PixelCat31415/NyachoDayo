import fs from "fs";
import path from "path";

import { data_path } from "./data/config.json";

const abs_data_path = path.join(__dirname, data_path);

class BotDatabase {
    private static instance_: BotDatabase | undefined = undefined;
    public static getInstance(): BotDatabase {
        if (!this.instance_) this.instance_ = new BotDatabase();
        return this.instance_;
    }

    private db: any;

    private constructor() {
        if (fs.existsSync(abs_data_path)) {
            let raw_json: string = fs.readFileSync(abs_data_path).toString();
            this.db = JSON.parse(raw_json);
        } else {
            this.db = {};
        }
    }

    public GetValue(key: string): any {
        if (this.Count(key)) {
            return this.db[key];
        } else {
            return undefined;
        }
    }
    public GetValueMap(key: string): Map<any, any> {
        let res = new Map();
        let data = this.GetValue(key);
        if (data) {
            for (let it of data) {
                res.set(it[0], it[1]);
            }
        }
        return res;
    }
    public SetValue(key: string, value: any) {
        this.db[key] = value;
    }
    public RemoveValue(key: string) {
        if (this.Count(key)) {
            delete this.db[key];
        }
    }
    public Count(key: string) {
        return this.db.hasOwnProperty(key);
    }
    public Save() {
        fs.writeFileSync(abs_data_path, JSON.stringify(this.db));
    }
}

export default BotDatabase;
