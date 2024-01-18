import { Markup } from "telegraf"

export const signCommands = {
    signin: `✅ Записаться`,
    signout: `❌ Выписаться`,
    back: `◀️ Hазад`,
    deletePlayer: `Удалить игрока`
}


// export const signInButton = () => {
//     return Markup.inlineKeyboard([Markup.button.callback('✅ Записаться', 'signin')])
// }

// export const signOutButton = () => {
//     return Markup.inlineKeyboard([Markup.button.callback('❌ Выписаться', 'signout')])
// }

// export const inlineBackButton = () => {
//     return Markup.inlineKeyboard([Markup.button.callback('◀️ Hазад', 'back')])
// }