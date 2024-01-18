import 'dotenv/config';
import mongoose from "mongoose";
import setupBot from "./bot.js"


main().catch(err => console.log(err))

async function main() {
    await mongoose.connect(process.env.BD_URI).then(() => console.log('connected to DB succes...'))
    // await mongoose.connection.dropDatabase()

    await setupBot().launch()
}