import dotenv from "dotenv"

dotenv.config()

export const envVariable = {
    PORT: process.env.PORT as string,
    DB_URI: process.env.MONGODB_STRING as string
}   