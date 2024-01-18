export const handleCreaterText = {
    teamRed: `КРА 🟥`,
    teamBlue: `СИН 🟦`,
    teamGreen: `ЗЕЛ 🟩`,
    newTeams: `🆕 Новые`,
    editTeams: `✏️ Изменить`,
    done: '✅ Готово',
    back: `◀️ Назад`,
    fillAll: `Добавить всех`,
    exit: `🛑 Выход`
}

export const existPlayer = (player, team) => {
    return team.captain === player._id || team.players.includes(player._id)
}

export const replaysPlayers = (team, newPlayer, oldPlayer) => {
    if (team.players.includes(oldPlayer._id)) {
        team.players.splice(team.players.indexOf(oldPlayer._id), 1, newPlayer._id)
    } else {
        team.captain = newPlayer._id
    }
}