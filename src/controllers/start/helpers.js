import { Markup } from "telegraf";

export function getChangeNameKeyboard(ctx) {
    return Markup.inlineKeyboard([
        Markup.button.callback('✅ Да', 'yes'),
        Markup.button.callback('Нет ⛔️', 'no')
    ])
}