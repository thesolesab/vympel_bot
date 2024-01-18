import { Markup } from "telegraf"
import spliceIntoChunks from "./spliceIntoChunks.js";


export const getBackKeyboard = () => {
    const backKeyboardText = '◀️ Hазад'
    const backKeyboard = Markup.keyboard([backKeyboardText]).resize()
    const inlineBackButton = Markup.inlineKeyboard([Markup.button.callback(backKeyboardText, 'back')])

    return {
        backKeyboard,
        backKeyboardText,
        inlineBackButton
    };
};


export const implementButtons = (buttons = [], newButtons = []) => {
    if (!Array.isArray(newButtons)) {
        newButtons = [newButtons]
    }
    buttons.reply_markup.inline_keyboard.push(newButtons)
    return buttons
}

export const getPlayersButtons = (players = []) => {
    return players.map(item =>
        Markup.button.callback(
            `${item.name}`,
            JSON.stringify({ a: 'user', p: item._id }),
            false
        )
    )
}

export const getInlineKeyboard = (buttons = [], chunksLength = 3) => {
    return Markup.inlineKeyboard(spliceIntoChunks(buttons, chunksLength))
}


export const getButtonFrom = (actionButtons) => {
    const btns = {}
    for (let key in actionButtons) {
        btns[key] = Markup.button.callback(actionButtons[key], `${key}`)
    }

    return btns
}

export const getMainKeyboard = () => {
    const mainKeyboardProfile = '👤 Профиль'
    const mainKeyboardSignIn = 'Запись ✍️'
    const mainKeyboardTeamCreate = '👨‍👦‍👦 Команды'
    const testMeTest = `тест тест тест`
    const setResults = `Результаты 📋`

    const mainKeyboard = Markup.keyboard([
        [mainKeyboardProfile, mainKeyboardSignIn],
        [mainKeyboardTeamCreate, setResults],
        [testMeTest],
    ]).resize()

    return {
        mainKeyboard,
        mainKeyboardProfile,
        mainKeyboardSignIn,
        mainKeyboardTeamCreate,
        testMeTest,
        setResults
    }

}
