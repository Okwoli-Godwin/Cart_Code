import express, {Application, Request, Response} from "express"
import cors from "cors"
import morgan from "morgan"
import {errorHandler} from "../middlewares/errorhandle"
import router from "../routes/productsroutes"

import productRouter from "../routes/productsroutes"

export const appConfig = (app: Application) => {
    app.use(express.json())
    .use(cors())
    .use(morgan("dev"))

    app.use("/api/product" , productRouter)
app.use(errorHandler)
}