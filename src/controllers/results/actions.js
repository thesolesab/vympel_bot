import { getButtonFrom, getInlineKeyboard } from "../../utils/keyboards.js";
import { getButtonsForScore, getGamesButtons, resultButtons } from "./helpers.js";

const { back, done } = getButtonFrom(resultButtons)

export const setResultForGames = async (ctx) => {
    const { gameDay } = ctx.session
    const teamText = await gameDay.teamMessage()

    await ctx.editMessageText(
        `Такие были команды:${teamText}\n\nТы можешь изменить результат любой игры!`,
        {
            disable_web_page_preview: true,
            parse_mode: 'HTML',
            ...getInlineKeyboard([...getGamesButtons(gameDay.getGames(), gameDay), done])
        }
    )
}


export const editResult = async (ctx) => {
    const { game, gameDay } = ctx.session
    const { score } = game
    const teams = gameDay.getTeams(game.teams)
    const { message } = ctx

    const mes = {
        text: `${teams[0].colour} <b>${score[0]} - ${score[1]}</b> ${teams[1].colour}\n<i>Используй кнопки либо пиши текст в формате "1-1"</i>`,
        options: {
            parse_mode: 'HTML',
            ...getInlineKeyboard([...getButtonsForScore(), back], 2)
        }
    }

    if (message) {
        return await ctx.reply(mes.text, mes.options)
    }

    await ctx.editMessageText(mes.text, mes.options)
}