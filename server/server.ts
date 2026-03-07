import "dotenv/config";
import express from 'express'
import cors from 'cors'
import passport from 'passport'
import './config/passport.js'
import cookieParser from 'cookie-parser'
import adminRouter from './routes/adminRouter.js'
import authRouter from './routes/authRouter.js'
import publicRouter from './routes/publicRouter.js'
import inventoryRouter from './routes/inventoryRouter.js'
import { isAuthenticated } from "./middleware/isAuthenticated.js";

const app = express()
const port = 3000

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:4173',
        process.env.FRONT_URL || ''
    ],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())
app.use(passport.initialize())

app.use(publicRouter)
app.use(authRouter)
app.use(isAuthenticated)
app.use(inventoryRouter)
app.use(adminRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})