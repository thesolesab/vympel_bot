import toHyperText from "../../utils/toHyperText.js";

export const mainTeamActions = {
    autoTeamCreate: `Автоматически`,
    handleCraeteTeam: `В ручную`,
    exit: `🛑 Выход`
}

export const gamesMessage = async (ctx) => {
    const { game: gameService } = ctx.session
    const games = gameService.getGames()

    const message = [`Команды 👨‍👦‍👦:`]
    message.push(await gameService.teamMessage())

    for (const game of games) {
        const { teams, score } = game
        message.push(
            `\nИгра:\n`
        )
        message.push(
            `${gameService.getTeams(teams[0]).colour.toUpperCase()} ${score[0]} - ${score[1]} ${gameService.getTeams(teams[1]).colour.toUpperCase()}`
        )
    }

    const time = gameService._game?.updatedAt ?
        gameService._game?.updatedAt
        :
        gameService._game?.createdAt

    const options = {
        weekday: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }

    message.push(`\n\nСозданно: ${toHyperText(gameService._game.whoCreate, 0)} (${time.toLocaleDateString('ru-RU', options)})`)
    return message.join('')
}