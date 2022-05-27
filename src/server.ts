import express from 'express'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import auth from './routes/auth'
import store from './routes/store'
import playername from './routes/playername'
import settings from './routes/settings'
import skins from './routes/skins'
import share from './routes/share'
import currentgame from './routes/currentgame'
// init port
const port = process.env.PORT || 5000

//init app
const app = express()
app.use(express.json())

const limiter = rateLimit({
	windowMs: 3 * 60 * 1000, // 10 minutes
	max: 30, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    
})
app.use(limiter)
app.use(cors({
    origin:['https://akapython.software','http://akapython.software','http://localhost:3000']
}))

app.listen(port, ()=>{
    console.log("Server started on "+port)
})

app.use("/auth",auth)
app.use("/gameinfo",currentgame)
app.use("/store",store)
//app.use("/playername",playername)
app.use("/currentgame",currentgame)
app.use("/share",share)
app.use("/settings",settings)
app.use("/skins",skins)