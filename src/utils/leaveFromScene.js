import { getMainKeyboard } from "./keyboards.js"
import { deleteFromSession } from "./session.js"

const leaveFromScene = async (ctx, toFlash = null) => {

    if (toFlash) {
        flashSession(ctx, toFlash)
    }
    const { mainKeyboard } = getMainKeyboard()
    !ctx.message && await ctx.answerCbQuery()

    if (!ctx.bye) {
        await ctx.deleteMessage()
        await ctx.reply(`Что делаем дальше?`, mainKeyboard)
    }
}

const flashSession = (ctx, name) => {
    if (Array.isArray(name)) {
        for (const i of name) {
            flashSession(ctx, i)
        }
    } else {
        deleteFromSession(ctx, name)
    }
}

export default leaveFromScene