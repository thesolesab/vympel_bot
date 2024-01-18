import { getMessageStat } from "./helpers.js"
import profileMain from "./index.js"

export const renameUser = async (ctx) => {
    await ctx.answerCbQuery()
    await ctx.scene.enter('changeName')
}

export const changeScoreEnter = async (ctx) => {
    profileMain.on('text', changeScore)

    await ctx.editMessageText(
        `Напиши сколько забил?`,
    )
}

const changeScore = async (ctx) => {
    const { user } = ctx.session

    if (isFinite(ctx.message.text)) {
        await user.updateScore(ctx.message.text)
        await getMessageStat(ctx)
    } else {
        await ctx.reply(`Нужно только число!`)
    }
}