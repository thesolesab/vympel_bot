class UserService {
    constructor(user) {
        this._user = user
        this.name = user.name
    }

    async signIn(gameDay) {
        this._user.gameDays.push(gameDay)
        await this._user.save()
    }

    async signOut(gameDay) {
        await this._user.updateOne(
            { $pull: { gameDays: gameDay._id } },
            { new: true }
        )
    }

    getStats() {
        return this._user.stat
    }

    async updateScore(newScore = Number) {
        this._user.stat.scores += +newScore
        this._user.save().then((res) => this._user = res)
    }

    async getGames() {
        const { gameDays } = await this._user.populate('gameDays')
        return gameDays
    }
}

export default UserService