import fs from "fs";
import path from "path";

import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

import { data_path } from "./data/config.json";

const abs_data_path = path.join(__dirname, data_path);

class BotDatabase {
    private db: Database<sqlite3.Database, sqlite3.Statement> | undefined;

    public getDB(): Database<sqlite3.Database, sqlite3.Statement> {
        if (this.db) return this.db;
        throw Error("database not exist: db is not opened");
    }
    public async open() {
        this.db = await open({
            filename: abs_data_path,
            driver: sqlite3.Database,
        });
        console.log("Database opened");
    }
    public async close() {
        if (this.db != undefined) {
            await this.db.close();
        }
        console.log("Database closed");
    }
}

let db = new BotDatabase();

export default db;
