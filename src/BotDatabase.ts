const Database = require("@replit/database");

class BotDatabase {
  private static instance_: BotDatabase | undefined = undefined;
  public static getInstance(): BotDatabase {
    if (!this.instance_)
      this.instance_ = new BotDatabase();
    return this.instance_;
  }

  private db: any;

  private constructor() {
    this.db = new Database();
  }

  public async GetValue(key: string) {
    return await this.db.get(key);
  }
  public async SetValue(key: string, value: any) {
    return await this.db.set(key, value);
  }
  public async RemoveValue(key: string) {
    return await this.db.delete(key);
  }
  public async ListKeys(pre: string = "") {
    return await this.db.list(pre);
  }
}

export default BotDatabase;
