import express, {Application} from "express"
import { envVariable } from "../config/enviromentvariables"
import { appConfig } from "./app"
import { dbconnection } from "../config/db"

const port = envVariable.PORT

const app: Application = express()
appConfig(app)
dbconnection()

process.on("uncaughtException", (err: Error) => {
    console.log(`UncaugntException, Server is shutting down`)
    console.log(err.name, err.message)
    process.exit(1)
})

const server = app.listen(port, () => {
    console.log("Server is up and running")
})

process.on("unhandledRejection", (err: Error) => {
    console.log(`UnhandledRejection, Server is shutting down`)
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1)
    })
})