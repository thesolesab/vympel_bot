import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: String,
    chatId: Number,
    link: String,
    power: Number,
    username: String,
    gameDays: [{
        type: mongoose.Types.ObjectId,
        ref: 'GameDay'
    }],
    stat: {
        w: Number,
        l: Number,
        d: Number,
        scores: Number
    },
})

const User = mongoose.model('User', userSchema)

export default User