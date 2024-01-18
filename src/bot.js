import { Scenes, Telegraf, session } from "telegraf";
import { getMainKeyboard } from "./utils/keyboards.js";


import startScene from "./controllers/start/index.js";
import changeNameScene from "./controllers/changeName/index.js";
import signInScene from "./controllers/signIn/index.js";
import teamMainScene from "./controllers/createTeams/index.js";
import resultScene from "./controllers/results/index.js";
import profileMainScene from "./controllers/profile/index.js";



export default function setupBot() {
    const bot = new Telegraf(process.env.BOT_TOKEN);
    const stage = new Scenes.Stage([
        startScene,
        changeNameScene,
        signInScene,
        teamMainScene,
        resultScene,
        profileMainScene
    ])
    const { mainKeyboardProfile, mainKeyboardSignIn, mainKeyboardTeamCreate, setResults } = getMainKeyboard()


    // bot.hears(testMeTest, ctx => menuMiddleware.replyToContext(ctx))


    bot.use(session())
    bot.use(stage.middleware())


    bot.start(ctx => ctx.scene.enter('start'))

    bot.hears(mainKeyboardProfile, (ctx) => ctx.scene.enter('profileMain'))
    bot.hears(mainKeyboardSignIn, (ctx) => ctx.scene.enter('signIn'))
    bot.hears(mainKeyboardTeamCreate, (ctx) => ctx.scene.enter('teamMain'))
    bot.hears(setResults, (ctx) => ctx.scene.enter('setResults'))
    // bot.hears(testMeTest, ctx => menuMiddleware.replyToContext(ctx))

    bot.catch(
        (err) => {
            console.log(err);
        }
    )

    return bot
} 