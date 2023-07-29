import app from './app'
import mongoose from "mongoose"
import env from "./utils/validateEnv"

const port = process.env.PORT || 8000


mongoose.connect(env.MONGO_CONNECTION_STRING).then(()=>{
    console.log("db connected")
    app.listen(port!, ()=>{
        console.log("runnng")
    })

})



