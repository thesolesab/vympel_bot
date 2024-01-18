import User from '../../models/User.js';
import { saveToSession } from '../../utils/session.js';
import { getChangeNameKeyboard } from './helpers.js';


export const changeName = async (ctx) => {
    saveToSession(ctx, 'changeName', true)
    await ctx.answerCbQuery()
    await ctx.reply(`Напиши мне как тебя называть?`)
}

export const changeNameHandler = async (ctx) => {
    const changeNameKeys = getChangeNameKeyboard()
    const { userId } = ctx.session.user
    const { changeName } = ctx.session

    if (changeName) {
        saveToSession(ctx, 'user', { userName: ctx.message.text })

        await User.findByIdAndUpdate(userId, { name: ctx.message.text })

        await ctx.reply(`Готово, теперь тебя зовут ${ctx.message.text}`)
        return ctx.scene.leave()
    }

    ctx.reply(`Я тебя не понимаю. Хочешь изменить имя?`, changeNameKeys)
}