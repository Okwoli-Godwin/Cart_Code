import mongoose from "mongoose";
import { envVariable } from "./enviromentvariables";

const URI = envVariable.DB_URI

export const dbconnection = async():Promise<void> => {
    try {
        const conn = await mongoose.connect(URI)
        console.log(`Database connected to ${conn.connection.host}`)
    } catch (error) {
        console.log("Failed to connect to the database")
    }
}