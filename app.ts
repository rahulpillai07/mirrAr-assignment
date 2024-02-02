import express from "express"
import cors from "cors"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))

import productRouter from "./routes/product.route"
import variantRouter from"./routes/variant.route"

app.use('/api/products',productRouter)
app.use('/api/variant',variantRouter)

export{app};