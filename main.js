const {Bot, session, Context} = require("grammy");
const {Menu, MenuRange} = require("@grammyjs/menu");
const { conversations, createConversation, Conversation } = require("@grammyjs/conversations");
require("dotenv").config({path:"./config.env"});

const PORT = process.env.PORT || 8080;
const TOKEN = process.env.TOKEN;

const bot = new Bot(process.env.TOKEN);

bot.api.setMyCommands([
    {command: "start", description: "lets start!"},
    {command: "characters", description: "list characters"}
])

//ORDER MATTERS!!!!   ORDER MATTERS!!!!   ORDER MATTERS!!!!   ORDER MATTERS!!!!   
const characters = {}

/**
 * 
 * @param {*} conversation 
 * @param {Context} ctx 
 */
async function createCharacter(conversation, ctx) {
    const user_id = ctx.from.id;
    await ctx.reply("Alright! Lets create a character!");
    await ctx.reply("What the name would be?");
    let {message} = await conversation.wait();
    let name = message.text;
    if (!characters[user_id]) {characters[user_id] = []};
    characters[user_id].push(name)
    await ctx.reply(`You have created ${name}`)
    console.log(characters[user_id])

    //await ctx.reply("Hi there! What is your name?");
    //const { message } = await conversation.wait();
    //await ctx.reply(`Welcome to the chat, ${message.text}!`);
}

bot.use(session({
    initial(){
        return {}
    }}));
    
bot.use(conversations());
bot.use(createConversation(createCharacter));

const startMenu = new Menu("startMenu").text("Create new character", ctx => ctx.conversation.enter("createCharacter"))
bot.use(startMenu)

bot.command("start", async ctx => {
    await ctx.reply("Welcome! Here are some things you can do", {reply_markup: startMenu});
});

// bot.command("characters", ctx => {
//     const user_id = ctx.from.id
//     if (!characters[user_id]) {
//         ctx.reply("There are no characters yet!")
//         return
//     }

//     const charactersString = characters[user_id].join("\n");

//     ctx.reply(charactersString)

// })

const charactersMenu = new Menu("charactersMenu");

charactersMenu
    .dynamic(ctx => {
        user_id = ctx.from.id
        const range = new MenuRange();
        for (let character of characters[user_id]) {
            range
                .text(character, async ctx => {
                    await ctx.reply(`You chose ${character}`)
                    await ctx.deleteMessage()
                })
                .row()
        }
        return range
    })

bot.use(charactersMenu)

bot.command("characters", async ctx => {
    ctx.reply("Here are your characters!", {reply_markup: charactersMenu})
})

bot.start();