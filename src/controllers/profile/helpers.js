import table from 'text-table'
import { getButtonFrom, getInlineKeyboard } from '../../utils/keyboards.js'

export const profileButtons = {
    changeName: `Изменить имя`,
    changeScores: `Забитые мячи`,
    exit: `🛑 Выход`
}

export const getStatTable = (stat = {}) => {
    const { w, l, d, scores } = stat

    const all = w + l + d
    const p = Math.round((w / all) * 100)

    const tdata = [
        [`Всего тобой забито:`, scores],
        [`Всего Побед:`, w],
        [`Всего Поражений:`, l],
        [`Всего Ничьих:`, d],
        [`Процент побед:`, `${p || 0}%`],

    ]

    const tOpt = {
        align: ['l', 'r'],
        hsep: '    ',
    }

    return table(tdata, tOpt)
}

export const getMessageStat = async (ctx) => {
    const { changeName, changeScores, exit } = getButtonFrom(profileButtons)
    const { user } = ctx.session

    return await ctx.replyWithHTML(
        `Вот твоя статистика 📊\n<pre>${getStatTable(user.getStats())}</pre>`,
        getInlineKeyboard([changeName, changeScores, exit])
    )
}