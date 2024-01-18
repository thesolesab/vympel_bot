const getGameSchedule = (teams = []) => {
    const laps = teams.length === 2 ? 1 : 9 / teams.length
    const games = []
    const lap = []

    for (let i = 0; i < teams.length - 1; i++) {
        const team = teams[i]
        for (const condidate of teams) {
            if (condidate !== team) {
                const game = {
                    teams: [team._id, condidate._id],
                    score: [0, 0]
                }
                if (!games.includes(game)) {
                    lap.push(game)
                }
            }
        }

    }
    lap.splice(teams.length - 1, 1)

    for (let i = 0; i < laps; i++) {
        games.push(...lap)
    }

    return games;
}

export default getGameSchedule