import mongoose, { Schema } from "mongoose";

const legionerSchema = new Schema(
    {
        name: String,
        whoAdd: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    }
)

const teamSchema = new Schema({
    colour: String,
    captain: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    players: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    date: String,
    stat: {
        w: Number,
        l: Number,
        d: Number,
        p: Number
    }
})

const gameSchema = new Schema({
    teams: Array,
    score: Array,
    status: String
})

const gameDaySchema = new Schema({
    date: String,
    whoCreate: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    games: [gameSchema],
    players: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    legioners: [legionerSchema],
    teams: [teamSchema]
}, {
    timestamps: true
})


// const gameDaySchema = new Schema({
//     date: String,
//     whoCreate: {
//         type: mongoose.Types.ObjectId,
//         ref: 'User'
//     },
//     games: [{
//         type: mongoose.Types.ObjectId,
//         ref: 'Game'
//     }],
//     players: [{
//         type: mongoose.Types.ObjectId,
//         ref: 'User'
//     }],
//     legioners: [legionerSchema],
//     teams: [{
//         type: mongoose.Types.ObjectId,
//         ref: 'Team'
//     }]
// }, {
//     timestamps: true
// })


const GameDay = mongoose.model('GameDay', gameDaySchema)

export default GameDay