import { Scenes } from "telegraf"
import getNextDateGame from "../../utils/nextGame.js"
import { gamesMessage, mainTeamActions } from "./helpers.js"
import { getBackKeyboard, getButtonFrom, getInlineKeyboard } from "../../utils/keyboards.js"
import GameDayService from "../../utils/gameDayService.js"
import { exposeAction } from "./middlewares.js"
import { createTeamAction } from "./actions.js"
import { saveToSession } from "../../utils/session.js"
import toHyperText from "../../utils/toHyperText.js"
import leaveFromScene from "../../utils/leaveFromScene.js"


const teamMain = new Scenes.BaseScene('teamMain')
const { backKeyboard, backKeyboardText } = getBackKeyboard()


teamMain.enter(async (ctx) => {
    const { autoTeamCreate, handleCraeteTeam, exit } = getButtonFrom(mainTeamActions)
    const game = new GameDayService(getNextDateGame())
    await game.init()
    const allPlayers = game.getAllPlayers()
    saveToSession(ctx, 'game', game)

    await ctx.reply(
        `Следующая игра в ${game.day}`,
        backKeyboard
    )

    if (!!game._game.whoCreate && allPlayers.length >= 10) {
        const message = await gamesMessage(ctx)

        await ctx.replyWithHTML(
            message,
            {
                disable_web_page_preview: true
            }
        )
    } else {
        allPlayers.length === 0 ?
            null
            :
            await ctx.replyWithHTML(
                `Команды еще никто не создал, но вот кто записался на данный момент:\n\n${toHyperText(allPlayers)}\n\nТы можешь стать первым!`,
                {
                    disable_web_page_preview: true,
                }
            )
    }

    allPlayers.length < 10 ?
        ctx.replyWithHTML(
            `Слишком мало записалось 😞 Миниму 10 человек`,
            getInlineKeyboard([exit])
        )
        :
        ctx.replyWithHTML(
            `Выбери в каком режиме будем собирать команды`,
            getInlineKeyboard([autoTeamCreate, handleCraeteTeam, exit], 2)
        )

})

teamMain.leave(leaveFromScene)
teamMain.hears(backKeyboardText, (ctx) => ctx.scene.leave())
teamMain.action(Object.keys(mainTeamActions), exposeAction, createTeamAction)

export default teamMain