import User from "../../../models/User.js";
import { getButtonFrom, getInlineKeyboard, getPlayersButtons, implementButtons } from "../../../utils/keyboards.js";
import { saveToSession } from "../../../utils/session.js";
import toHyperText from "../../../utils/toHyperText.js";
import { autoCreaterText, createTeams, gaussRound } from "./helpers.js";
import teamMain from "../index.js";
import { exposeAction, exposePlayer } from "../middlewares.js";
import { gamesMessage } from "../helpers.js";


const { captain, basket1, basket2, back, fillAll, done, random, finishRnd, exit } = getButtonFrom(autoCreaterText)


export const autoCreateTeameAction = async (ctx) => {
    const { game } = ctx.session
    const allPlayers = await game.getAllPlayers()
    const { teamNum } = game


    const maxBasket = gaussRound((allPlayers.length - teamNum) / 2)

    const sortPlayers = {
        captain: {
            max: teamNum,
            players: []
        },
        basket1: {
            max: maxBasket,
            players: []
        },
        basket2: {
            max: (allPlayers.length - teamNum - maxBasket),
            players: []
        },
        unsorted: allPlayers
    }

    saveToSession(ctx, 'sortPlayers', sortPlayers)

    teamMain.action(/user/, exposePlayer, fillBasket);
    teamMain.action(['captain', 'basket1', 'basket2'], exposeAction, fillBasket)
    teamMain.action(['done', 'back'], backToMain);
    teamMain.action('fillAll', fillAllToBasket);
    teamMain.action('random', getRandomTeams);
    teamMain.action('finishRnd', saveDataInDd);


    ctx.editMessageText(
        `Записалось ${allPlayers.length} человек, давай создадим ${teamNum} команды на игру в ${game.day}\n\nС чего начнем?`,
        getInlineKeyboard([captain, basket1, basket2])
    )
}

const fillBasket = async (ctx) => {

    const { currentAction } = ctx.session
    const { unsorted } = ctx.session.sortPlayers
    const { max, players } = ctx.session.sortPlayers[currentAction]

    if (ctx.player) {
        unsorted.splice(unsorted.indexOf(ctx.player), 1)
        players.push(ctx.player)

        if (players.length > max) {
            const p = players.shift()
            unsorted.push(p)
        }
    }

    const playersText = toHyperText(players)

    const btnText = players.length === max ? [done] : [back]

    if (unsorted.length === max && players.length === 0 || max - players.length === unsorted.length) {
        btnText.push(fillAll)
    }

    const buttons = getInlineKeyboard(getPlayersButtons(unsorted))

    implementButtons(buttons, btnText)

    await ctx.editMessageText(`${autoCreaterText[currentAction]}:\n\n${playersText}\n${players.length} из ${max}`, {
        disable_web_page_preview: true,
        parse_mode: 'HTML',
        ...buttons
    })
}

const fillAllToBasket = async (ctx) => {
    const { currentAction } = ctx.session
    const { unsorted } = ctx.session.sortPlayers
    const { max, players } = ctx.session.sortPlayers[currentAction]
    players.push(...unsorted)
    unsorted.splice(0, unsorted.length)

    const playersText = toHyperText(players)

    await ctx.editMessageText(`${autoCreaterText[currentAction]}:\n\n${playersText}\n${players.length} из ${max}`, {
        disable_web_page_preview: true,
        parse_mode: 'HTML',
        ...getInlineKeyboard([done])
    })
}

const backToMain = async (ctx) => {
    try {
        const { sortPlayers } = ctx.session

        const message = []
        for (const key in sortPlayers) {
            if (key !== 'unsorted') {
                if (sortPlayers[key].players.length > 0) message.push(`<b>${autoCreaterText[key]} (${sortPlayers[key].players.length} из ${sortPlayers[key].max}):</b>\n\n${toHyperText(sortPlayers[key].players)}\n`)
            }
        }

        const buttons = sortPlayers.unsorted.length === 0 ? getInlineKeyboard([random]) : getInlineKeyboard([captain, basket1, basket2])

        await ctx.editMessageText(`${message.join('') || 'Выбери корзину и начни добавлять игроков'}`, {
            disable_web_page_preview: true,
            parse_mode: 'HTML',
            ...buttons,
        })
    } catch (error) {
        console.log(error);
    }
}

const getRandomTeams = async (ctx) => {
    try {
        const { captain, basket1, basket2 } = ctx.session.sortPlayers

        const teams = createTeams(captain.players, basket1.players, basket2.players)
        saveToSession(ctx, 'teams', teams)

        const message = [`Вот что у нас получилось:`]

        for (const team of teams) {
            const teamText = [`\nКоманда <b>${team.colour}</b>\n\n`]
            teamText.push(`Капитан - ${toHyperText(team.captain, 0)}`)
            teamText.push(toHyperText(team.players))

            message.push(teamText.join(''))
        }

        await ctx.editMessageText(message.join(''),
            {
                disable_web_page_preview: true,
                parse_mode: 'HTML',
                ...getInlineKeyboard([random, finishRnd]),
            }
        )
    } catch (error) {
        console.log(error);
    }
}

const saveDataInDd = async (ctx) => {
    const { teams, game } = ctx.session
    const author = await User.findOne({ chatId: ctx.from.id })

    await game.clearGameDay()

    const res = await game.createDaySchedule(teams, author)

    if (!!res) {
        const message = await gamesMessage(ctx)

        return await ctx.editMessageText(
            message,
            {
                disable_web_page_preview: true,
                parse_mode: 'HTML',
                ...getInlineKeyboard([exit])
            }
        )
    }

    await ctx.editMessageText(`Похоже что-то пошло не так...`)
    await ctx.scene.leave()
}