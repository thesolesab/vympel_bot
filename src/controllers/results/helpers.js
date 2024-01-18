import { Markup } from "telegraf"
import { deleteFromSession, saveToSession } from "../../utils/session.js"
import getNextDateGame from "../../utils/nextGame.js"
import GameDay from "../../models/GameDay.js"

export const resultButtons = {
    back: `◀️ Назад`,
    done: '✅ Готово',
    exit: `🛑 Выход`
}


export const getGameDaysButtons = (gameDays = []) => {
    return gameDays.map(item =>
        Markup.button.callback(
            `${item.date}`,
            JSON.stringify({ a: 'gameDay', p: item.date }),
            false
        )
    )
}

export const getGamesButtons = (games = [], gameDay) => {
    return games.map(
        item => {
            const { teams, score } = item

            return Markup.button.callback(
                `${gameDay.getTeams(teams[0]).colour.substring(0, 3)} ${score[0]} - ${score[1]} ${gameDay.getTeams(teams[1]).colour.substring(0, 3)}`,
                JSON.stringify({ a: 'gamez', p: item._id }),
                false
            )
        }
    )
}

export const getButtonsForScore = () => {
    return [
        Markup.button.callback(
            `➕`,
            JSON.stringify({ a: 'score', p: 0 })
        ),
        Markup.button.callback(
            `➕`,
            JSON.stringify({ a: 'score', p: 1 })
        ),
    ]
}

export const getLastGameDays = async (ctx) => {
    const lastGames = await GameDay.find({})
        .populate(
            [
                { path: 'legioners', populate: { path: 'whoAdd' } },
                // { path: 'games', populate: { path: 'teams', populate: { path: 'captain' } } },
                { path: 'games', populate: { path: 'teams', populate: { path: 'players' } } },
                { path: 'games', populate: { path: 'winner' } },
                { path: 'teams' },
                { path: 'players' }
            ]
        )
    // .then((games) => games.filter((game) => game.date != getNextDateGame()))
    deleteFromSession(ctx, 'gameDays')
    saveToSession(ctx, 'gameDays', lastGames)
    return lastGames
}