import { getButtonFrom, getInlineKeyboard, getPlayersButtons, implementButtons } from "../../../utils/keyboards.js"
import { existPlayer, handleCreaterText, replaysPlayers } from "./helpers.js"
import teamMain from "../index.js"
import { Markup } from "telegraf"
import { exposePlayer, exposeTeam } from "./middlewares.js"
import { deleteFromSession } from "../../../utils/session.js"

export const handleCreateTeameAction = async (ctx) => {
    const { game } = ctx.session
    const { newTeams, editTeams } = getButtonFrom(handleCreaterText)

    const teams = game.getTeams()

    teamMain.action('newTeams', newTeamAction)
    teamMain.action('editTeams', editTeamAction)
    teamMain.action(/team/, exposeTeam, changeTeam)
    teamMain.action(/user/, exposePlayer, changePlayer)



    if (teams) {
        return await ctx.editMessageText(`Хочешь изменить существующие или создать новые?`, getInlineKeyboard([newTeams, editTeams]))
    } else {
        return await newTeamAction(ctx)
    }
}

const newTeamAction = async (ctx) => {
    await ctx.editMessageText(`новые`)
}

const editTeamAction = async (ctx) => {
    const { game } = ctx.session
    const { exit } = getButtonFrom(handleCreaterText)
    const teams = game.getTeams()
    const teamsbtn = teams.map(
        (team, i) => {
            return Markup.button.callback(team.colour, JSON.stringify({ a: `team`, id: team._id }))
        }
    )

    const teamMsg = await game.allTeamsMsg()
    await ctx.editMessageText(
        `${teamMsg}Какую команду будем менять?`,
        {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            ...implementButtons(getInlineKeyboard(teamsbtn), [exit])
        }
    )
}

const changeTeam = async (ctx) => {
    const { game, team } = ctx.session
    const msg = await game.oneTeamMsg(team)
    const players = await Promise.all(team.players.map(player => game.returnPlayer(player)))
    players.push(await game.returnPlayer(team.captain))

    await ctx.editMessageText(
        `${msg}\nКого меняем?`,
        {
            disable_web_page_preview: true,
            parse_mode: 'HTML',
            ...getInlineKeyboard(getPlayersButtons(players))
        }
    )
}

const changePlayer = async (ctx) => {
    const { game, team: oldTeam, oldPlayer, newPlayer } = ctx.session

    if (newPlayer) {

        const newTeam = game.getTeamOfPlayer(newPlayer)

        replaysPlayers(oldTeam, newPlayer, oldPlayer)
        replaysPlayers(newTeam, oldPlayer, newPlayer)

        await game.saveGameDay()
        deleteFromSession(ctx, ['oldPlayer', 'newPlayer'])
        return editTeamAction(ctx)
    }

    const plInTeam = [...oldTeam.players, oldTeam.captain].map(pl => JSON.stringify(pl))

    const condidates = game.getAllPlayers().filter((el) => !plInTeam.includes(JSON.stringify(el._id)))

    await ctx.editMessageText(
        `На кого поменяем ${oldPlayer.name}?`,
        {
            parse_mode: 'HTML',
            ...getInlineKeyboard(getPlayersButtons(condidates))
        }
    )

}