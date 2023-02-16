import mongoose, {Document} from "mongoose"
import { Iuser } from "./User"

export interface reviewT {
    user: mongoose.Schema.Types.ObjectId,
    name: string,
    rating: number,
    comment: string
}

export interface Iproduct extends Document {
    category: string,
    rating: number,
    productImage: string,
    price: number,
    name: string,
    numberOfReviews: number,
    reviews: reviewT[]
}


export interface addProductToCart extends Iuser {
    productId: string
}