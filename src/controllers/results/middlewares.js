import GameDayServiceM from "../../utils/gameDayServiceM.js";
import { deleteFromSession, saveToSession } from "../../utils/session.js";


export function exposeGameDay(ctx, next) {
    const action = JSON.parse(ctx.callbackQuery.data)

    const store = ctx.session.gameDays

    ctx.session.gameDay = new GameDayServiceM(store.find((item) => item.date === action.p))

    return next();
}

export function exposeGame(ctx, next) {
    const action = JSON.parse(ctx.callbackQuery.data)

    const { gameDay } = ctx.session

    ctx.session.game = gameDay.getGames().find((item) => JSON.parse(JSON.stringify(item._id)) === action.p)

    return next();
}

export function exposeGameScore(ctx, next) {

    const { message } = ctx
    let { game, oldScore } = ctx.session

    if (!oldScore) {
        oldScore = JSON.parse(JSON.stringify(game.score))
        saveToSession(ctx, 'oldScore', oldScore)
    }

    if (message && game) {
        const { text } = message
        const newScore = text.split('-').map((el) => +el)
        game.score = newScore
    } else {
        const action = JSON.parse(ctx.callbackQuery.data)
        game.score[action.p]++
    }

    return next();
}

// export function exposeGameScoreFromText(ctx, next) {
//     const { message } = ctx
//     const { text } = message
//     const { game } = ctx.session


//     if (message && game && text) {
//         const newScore = text.split('-').map((el) => +el)

//         const oldScore = JSON.parse(JSON.stringify(game.score))
//         game.score = newScore

//         saveToSession(ctx, 'oldScore', oldScore)
//         return next();
//     }
// }

export async function saveResultGame(ctx, next) {
    const { game, oldScore, gameDay } = ctx.session
    const teams = gameDay.getTeams(game.teams)
    const { score } = game

    if (oldScore) {
        const updateTeamPlayersStat = async (team, type, points) => {
            await gameDay.updatePlayerStat(team.players, type, points)
            await gameDay.updatePlayerStat(team.captain, type, points)
        }
        const findWinner = (teams, score) => {
            const max = Math.max(...score)
            const min = Math.min(...score)
            const winners = teams[score.indexOf(max)]
            const loosers = teams[score.indexOf(min)]

            return { winners, loosers }
        }

        //Удаление старых очков
        if (game.status) {
            switch (game.status) {
                case 'w':
                    const { winners, loosers } = findWinner(teams, oldScore)
                    await updateTeamPlayersStat(winners, 'w', -1)
                    await updateTeamPlayersStat(loosers, 'l', -1)

                    await gameDay.updateTeamStat(winners, 'w', -3, true)
                    await gameDay.updateTeamStat(loosers, 'l', 0, true)
                    break
                case 'd':
                    for (const team of teams) {
                        await updateTeamPlayersStat(team, 'd', -1)
                        await gameDay.updateTeamStat(team, 'd', -1, true)
                    }
                    break
                default:
                    break
            }
        }

        //Присвоение новых очков
        if (score[0] != score[1]) {
            const { winners, loosers } = findWinner(teams, score)
            game.status = 'w'

            await updateTeamPlayersStat(winners, 'w', 1)
            await updateTeamPlayersStat(loosers, 'l', 1)

            await gameDay.updateTeamStat(winners, 'w', 3)
            await gameDay.updateTeamStat(loosers, 'l', 0)
        } else {
            game.status = 'd'
            for (const team of teams) {
                await updateTeamPlayersStat(team, 'd', 1)
                await gameDay.updateTeamStat(team, 'd', 1)
            }
        }

        gameDay.saveGameDay()
        deleteFromSession(ctx, 'oldScore')
    }

    return next();
}