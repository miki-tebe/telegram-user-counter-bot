const { Telegraf } = require('telegraf');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ users: [], count: 0 })
    .write()

const bot = new Telegraf(process.env.BOT_TOKEN);


bot.start((ctx) => {
    // check if userId already exists 
    let exists = db.get('users').find({ id: ctx.chat.id }).value();
    if (exists == undefined) {
        // save telegramId and Username to db.json
        db.get('users')
            .push({ id: ctx.chat.id, userName: ctx.chat.username })
            .write();

        // count the number of /start commands
        db.update('count', n => n + 1)
            .write();
    }
});

bot.launch()
    .then(() => console.log("Bot Launched"))
    .catch(console.log);