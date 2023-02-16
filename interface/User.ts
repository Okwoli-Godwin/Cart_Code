import mongoose, {Schema} from "mongoose";
import { Request } from "express";


export interface ICartItems {
    productId: string;
    quantity: number
}
export interface Iuser extends mongoose.Document{
    name: string,
    email: string,
    password: string,
    confirm: string,
    role: string
    cart?: {
        items: {
            productId: Schema.Types.ObjectId;
            quantity: number
        }
    }
}

export interface Authuser extends Request{
    user: Iuser
}