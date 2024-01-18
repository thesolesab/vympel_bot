import User from "../models/User.js"
import toHyperText from "./toHyperText.js"
import table from 'text-table'

const teamMessage = async (teams = []) => {
    const message = []

    for (const team of teams) {
        const teamText = [`\nКоманда <b>${team.colour.toUpperCase()}</b>\n`]
        const captain = await User.findById(team.captain) || await Legioner.findById(team.captain).populate('whoAdd')
        const players = await Promise.all(
            team.players.map(
                async (player) => {
                    const el = await User.findById(player) || await Legioner.findById(player).populate('whoAdd')
                    return el
                }
            )
        )
        teamText.push(`Капитан - ${toHyperText(captain, 0)}`)
        teamText.push(toHyperText(players))

        message.push(teamText.join(''))
    }
    if (teams.length > 2) {
        const tableText = [
            ['Команда', 'W', 'L', 'D', 'P']
        ]

        teams.sort(
            function (a, b) {
                return b.stat.p - a.stat.p
            }
        ).forEach(
            (team) => {
                const { w = 0, l = 0, d = 0, p = 0 } = team.stat
                tableText.push([team.colour, w, l, d, p])
            }
        )

        const tOpt = {
            hsep: '  |  ',
        }

        message.push(`\n<pre>${table(tableText, tOpt)}</pre>`)
    }

    return message.join('')
}




// export default teamMessage