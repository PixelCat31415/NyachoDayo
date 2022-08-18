// import BotDatabase from "./BotDatabase";

// const db = BotDatabase.getInstance();

// (async () => {
//   console.log(`owo: ${await db.GetValue("owo")}`);
//   await db.SetValue("owo", 48763);
//   console.log(`owo: ${await db.GetValue("owo")}`);
//   console.log(`owo: ${await db.GetValue("owo")}`);
//   await db.RemoveValue("owo");
// })();

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {
    console.log(`You pressed the "${str}" key`);
    console.log();
    console.log(key);
    console.log();
  }
});
console.log('Press any key...');
