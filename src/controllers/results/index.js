import { Scenes } from "telegraf";
import { getBackKeyboard, getInlineKeyboard, } from "../../utils/keyboards.js";
import { getGameDaysButtons, getLastGameDays } from "./helpers.js";
import { exposeGameDay, exposeGame, exposeGameScore, saveResultGame } from "./middlewares.js";
import { editResult, setResultForGames } from "./actions.js";
import leaveFromScene from "../../utils/leaveFromScene.js";

const result = new Scenes.BaseScene('setResults')
const { backKeyboard, backKeyboardText } = getBackKeyboard()

result.enter(
    async (ctx) => {
        const lastGames = await getLastGameDays(ctx)

        await ctx.replyWithHTML(
            `Меню ввода/просмотра результатов игр.`,
            backKeyboard
        )

        await ctx.replyWithHTML(
            `Для какого игрового дня смотрим/заполняем?👇👇👇`,
            getInlineKeyboard(getGameDaysButtons(lastGames), 1)
        )
    }
)

result.leave(
    async (ctx) => {
        await leaveFromScene(ctx, ['GameDays', 'Game'])
    }
)


result.action('done', (ctx) => ctx.scene.leave())
result.action(/gameDay/, exposeGameDay, setResultForGames)
result.action(/gamez/, exposeGame, editResult)
result.action(/score/, exposeGameScore, editResult)
result.action('back', saveResultGame, setResultForGames)
result.hears(/-/, exposeGameScore, editResult)
result.hears(backKeyboardText, (ctx) => ctx.scene.leave())


export default result