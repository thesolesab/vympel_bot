export const autoCreaterText = {
    captain: `Капитаны`,
    basket1: `Корзина 1`,
    basket2: `Корзина 2`,
    random: '🎲 Рандом',
    done: '✅ Готово',
    finishRnd: '✅ Сохранить',
    back: `◀️ Назад`,
    fillAll: `Добавить всех`,
    exit: `🛑 Выход`
}

export const gaussRound = (num, decimalPlaces) => {
    var d = decimalPlaces || 0,
        m = Math.pow(10, d),
        n = +(d ? num * m : num).toFixed(8),
        i = Math.floor(n), f = n - i,
        e = 1e-8,
        r = (f > 0.5 - e && f < 0.5 + e) ?
            ((i % 2 == 0) ? i : i + 1) : Math.round(n);
    return d ? r / m : r;
}

export const createTeams = (captains = [], basket1 = [], basket2 = []) => {
    const teams = []

    const cap = JSON.parse(JSON.stringify(captains))
    const b1 = JSON.parse(JSON.stringify(basket1))
    const b2 = JSON.parse(JSON.stringify(basket2))

    const b1num = b1.length / cap.length
    const b2num = gaussRound(b2.length / cap.length)

    const colours = ['ЗЕЛ 🟩', 'КРА 🟥', 'СИН 🟦']

    for (let i = 0; i < captains.length; i++) {

        const b1rnd = basketRnd(b1, b1num)
        const b2rnd = basketRnd(b2, b2num)

        const team = {
            colour: colours[i],
            players: [...b1rnd, ...b2rnd],
            captain: cap.splice(Math.floor(Math.random() * cap.length), 1)[0]
        }

        teams.push(team)
    }

    if (b2.length > 0) {
        for (const player of b2) {
            const rndI = Math.floor(Math.random() * teams.length)
            teams[rndI].players.push(player)
        }
    }

    return teams
}

const basketRnd = (basket = [], num = Number) => {
    const players = []
    for (let i = 0; i < num; i++) {
        const rndI = Math.random() * basket.length;
        const player = basket.splice(rndI, 1)

        players.push(...player)
    }

    return players
}