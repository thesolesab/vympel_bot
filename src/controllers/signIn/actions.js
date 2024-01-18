import errorHandle from "../../utils/errorHandle.js";
import { getButtonFrom, getInlineKeyboard, getPlayersButtons, implementButtons } from '../../utils/keyboards.js';
import { signCommands } from './helpers.js';

const { back } = getButtonFrom(signCommands)


export const signInAction = async (ctx) => {
    try {
        const { gameDay, user } = ctx.session

        await gameDay.signIn(user._user)

        await ctx.answerCbQuery()
        await ctx.editMessageText(
            `Ты записан на игру в <code><b>${gameDay.day}</b></code>\n\nМожешь вернуться в меню или добавить легионера, просто написав его имя`,
            {
                parse_mode: 'HTML',
                ...getInlineKeyboard([back])
            }
        )
    } catch (e) {
        errorHandle(ctx, e)
    }
}

export const signOutAction = async (ctx) => {
    try {
        const { gameDay, user } = ctx.session

        gameDay.signOut(user._user)
        await ctx.answerCbQuery()
        await ctx.editMessageText(
            `Гoтово!😞\nТы больше не в команде`,
            {
                parse_mode: 'HTML',
                ...getInlineKeyboard([back])
            }
        )
    } catch (e) {
        errorHandle(ctx, e)
    }
}


export const addLegionerAction = async (ctx) => {
    try {
        let { gameDay, user } = ctx.session
        const allPlayers = await gameDay.getAllPlayers()

        if (allPlayers.length < 15) {
            const leg = {
                name: ctx.message.text,
                whoAdd: user._user
            }

            await gameDay.addLegioner(leg)

            await ctx.replyWithHTML(`Твой человек - <code><b>${leg.name}</b></code>, записан\n${++allPlayers.length} всего.`, getInlineKeyboard([back]))
        } else {
            await ctx.replyWithHTML(`⛔️ Упс, уже набранно максимум человек`, getInlineKeyboard([back]))
        }

    } catch (e) {
        errorHandle(ctx, e)
    }
}



export const deletePlayersFromDb = async (ctx) => {
    const { gameDay } = ctx.session
    const { player } = ctx
    let text = `Выбери кого удалим из состава`

    if (player) {
        text = `${player.name} - удален, кто то еще?`
        if (ctx.player.whoAdd) {
            await gameDay.removeLegioner(player)
        } else {
            await gameDay.signOut(player)
        }
    }

    const buttons = getInlineKeyboard(getPlayersButtons(gameDay.getAllPlayers()))
    implementButtons(buttons, back)

    await ctx.editMessageText(
        text,
        {
            ...buttons
        }
    )
}