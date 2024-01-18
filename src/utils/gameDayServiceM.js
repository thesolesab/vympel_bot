import GameDayService from "./gameDayService.js";

class GameDayServiceM extends GameDayService {
    constructor(gameDay) {
        super()
        this._game = gameDay
        this.day = this._game.date
    }

    async updatePlayerStat(player, type, p) {
        if (Array.isArray(player)) {
            player.forEach(
                (el) => {
                    this.updatePlayerStat(el, type, p)
                }
            )
        } else {
            if (player) {
                const condidate = this._game.players.find(el => JSON.stringify(el._id) === JSON.stringify(player))
                if (condidate) {
                    await condidate.updateOne(
                        { $inc: { [`stat.${type}`]: p } }
                    )
                }
            }
        }
    }

    async updateTeamStat(team, type, points, rem = false) {
        const typeP = rem ? -1 : 1
        try {
            const cond = this._game.teams.id(team._id)
            cond.stat[type] += typeP
            cond.stat.p += points
        } catch (error) {
            console.error('Error updating team stat:', error)
        }
    }
}

export default GameDayServiceM;