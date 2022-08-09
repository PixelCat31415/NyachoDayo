import BotDatabase from "../BotDatabase";

const db = BotDatabase.getInstance();

(async () => {
  console.log(`owo: ${await db.GetValue("owo")}`);
  await db.SetValue("owo", 48763);
  console.log(`owo: ${await db.GetValue("owo")}`);
  console.log(`keys: ${await db.ListKeys()}`);
  console.log(`keys: ${await db.ListKeys("o")}`);
  console.log(`keys: ${await db.ListKeys("a")}`);
  console.log(`owo: ${await db.GetValue("owo")}`);
  await db.RemoveValue("owo");
  console.log(`keys: ${await db.ListKeys()}`);
})();
