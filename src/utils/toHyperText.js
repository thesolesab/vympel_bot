const toHyperText = (players, i = 1, stat = false) => {
    if (Array.isArray(players)) {
        const text = []
        for (let index = 0; index < players.length; index++) {
            text.push(toHyperText(players[index], index + 1, stat))
        }
        return text.join('')
    } else {
        const textNum = i === 0 ? '' : `${i}) `
        if (players === null) {
            return `${textNum} <b>Игрок Удален</b>\n`
        }
        let statMsg = ''
        if (stat) {
            if (players.whoAdd) {
                statMsg = ' - легионер'
            } else {
                const { w, l, d } = players.stat

                const all = w + l + d
                const p = Math.round((w / all) * 100)
                statMsg = ` - ${w} побед в ${all} играх, ${p}%`
            }
        }
        return `${textNum}<a href="${players?.link || players?.whoAdd?.link}">${players.name}</a>${statMsg}\n`
    }
}

export default toHyperText