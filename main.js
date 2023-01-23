const {Bot, Context, session, InlineKeyboard} = require("grammy");
const {conversations, createConversation, Conversation} = require("@grammyjs/conversations");
require('dotenv').config({path:'./config.env'});

const createCharacterKeyBoard = require('./keyboards/createCharacterKeyBoard')


const PORT = process.env.PORT || 8080
const TOKEN = process.env.TOKEN



const bot = new Bot(process.env.TOKEN)



bot.command("start", async ctx => {
    await ctx.reply("Welcome! Here are thing you can do\n")
    await ctx.reply("Text",{reply_markup: createCharacterKeyBoard})
})


bot.use(session({initial:() => ({})}));


bot.use(conversations());



bot.start()