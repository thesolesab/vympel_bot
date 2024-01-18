const getNextDateGame = () => {
    const now = new Date()

    // const game ={
    //     on: 4,
    //     start: '17:00',
    //     end: '18:30'
    // }

    const day = {
        sun: 0,
        mon: 1,
        tue: 2,
        wed: 3,
        thu: 4,
        fri: 5,
        sat: 6
    }

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const res = Math.abs(now.getDay() - 7 - day.thu) > 7 ? Math.abs(now.getDay() - day.thu) : Math.abs(now.getDay() - 7 - day.thu)

    if (now.getDay() != day.thu || now.getDay() === day.thu && now.getHours() > 19) {
        now.setDate(now.getDate() + res)
    }

    return now.toLocaleDateString('ru-RU', options)
}

export default getNextDateGame