import GameDay from "../models/GameDay.js";
import User from "../models/User.js";
import getGameSchedule from "./gameSchedule.js";
import toHyperText from "./toHyperText.js";
import UserService from "./userService.js";
import table from 'text-table';



class GameDayService {
    constructor(day) {
        this.day = day;
    }

    async init() {
        this._game = await GameDay.findOne({ date: this.day }).populate([
            { path: 'whoCreate' },
            { path: 'players' },
            { path: 'teams' },
            { path: 'legioners', populate: { path: 'whoAdd' } },
            { path: 'games', populate: { path: 'teams' } },
        ])
        if (!!!this._game) this.createGameDay()
        this.teamNum = Math.floor((this._game?.players.length + this._game?.legioners?.length) / 5)
    }

    async createGameDay() {
        this._game = new GameDay({
            date: this.day
        })
        await this._game.save()
    }

    async signIn(player) {
        this._game.players.push(player)
        const u = new UserService(player)
        await Promise.all([u.signIn(this._game), this._game.save()])
    }

    async signOut(player) {
        const i = this._game.players.indexOf(player)
        const u = new UserService(this._game.players.at(i))
        this._game.players.splice(i, 1)
        await Promise.all([u.signOut(this._game), this._game.save()])
    }

    async addLegioner(legioner) {
        this._game.legioners.push(legioner)
        await this._game.save()
    }

    async removeLegioner(leg) {
        this._game.legioners.id(leg._id).deleteOne()
        await this._game.save()
    }

    static getPlayersList(players = []) {
        return players.map((player) => {
            const obj = {
                _id: player._id,
                name: player.name,
                link: player?.link
            };

            if (player.whoAdd) {
                obj.whoAdd = {
                    name: player.whoAdd.name,
                    _id: player.whoAdd._id,
                    link: player.whoAdd.link
                };
            }

            return obj;
        });
    }

    getAllPlayers() {
        const { players, legioners } = this._game;
        const allPlayers = [...this.constructor.getPlayersList(players), ...this.constructor.getPlayersList(legioners)];
        return allPlayers;
    }

    getGames() {
        return this._game.games;
    }

    getTeams(id) {
        if (!id) {
            return this._game.teams
        }
        if (Array.isArray(id)) {
            const teams = []
            id.forEach(
                (i) => {
                    teams.push(this.getTeams(i))
                }
            )
            return teams
        } else {
            return this._game.teams.id(id)
        }
    }

    getTeamOfPlayer(player) {
        this._game.teams.find(t => console.log(t, player._id))
    }

    async clearGameDay() {
        const clearArray = (arr) => {
            if (arr.length > 0) {
                arr.splice(0, arr.length)
            }
        }
        clearArray(this._game.teams)
        clearArray(this._game.games)

        if (this._game.whoCreate) {
            this._game.whoCreate = null
        }
    }

    async createDaySchedule(teams = [], author = {}) {
        for (const team of teams) {
            const teamCondidate = {
                ...team,
                date: this.day,
                stat: {
                    w: 0,
                    l: 0,
                    d: 0,
                    p: 0
                }
            }

            this._game.teams.push(teamCondidate)
        }

        const schedule = getGameSchedule(this._game.teams)

        for (const game of schedule) {
            this._game.games.push(game)
        }

        this._game.whoCreate = author
        const res = await this._game.save({
            timestamps: true
        })
        return res
    }

    async returnPlayer(player) {
        const user = await User.findById(player) || this._game.legioners.id(player)
        return user
    }

    async oneTeamMsg(team) {
        const teamText = [`\nКоманда <b>${team.colour.toUpperCase()}</b>\n`]
        const captain = await this.returnPlayer(team.captain)
        const players = await Promise.all(
            team.players.map(
                async (player) => {
                    const el = await this.returnPlayer(player)
                    return el
                }
            )
        )
        teamText.push(`Капитан - ${toHyperText(captain, 0, true)}`)
        teamText.push(toHyperText(players, 1, true))

        return teamText.join('')
    }

    async allTeamsMsg() {
        const message = []

        for (const team of this._game.teams) {
            message.push(await this.oneTeamMsg(team))
        }

        return message.join('')
    }

    async teamMessage() {
        const message = [await this.allTeamsMsg()]

        if (this._game.teams.length > 2) {
            const tableText = [
                ['Команда', 'W', 'L', 'D', 'P']
            ]

            this._game.teams.sort(
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

    async saveGameDay() {
        await this._game.save()
    }
}

export default GameDayService;