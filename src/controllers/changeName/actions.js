import User from "../../models/User.js";
import { getBackKeyboard } from "../../utils/keyboards.js";

export const changeNameHandler = async (ctx) => {
    const { backKeyboardText } = getBackKeyboard()
    if (ctx.message.text === backKeyboardText) return await ctx.scene.leave()

    await User.findOneAndUpdate({ chatId: ctx.from.id }, { name: ctx.message.text })

    await ctx.replyWithHTML(`Готово, теперь тебя зовут <b>${ctx.message.text}</b>`)
    await ctx.scene.leave()

}