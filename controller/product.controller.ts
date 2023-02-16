import productModel from "../model/product.model";
import express , {Request , Response , NextFunction} from "express"
import { asyncHandler } from "../utils/AsyncHandler";
import { AppError, HttpCode } from "../utils/AppError";
import {Iproduct, addProductToCart} from "../interface/product"
import {AuthenticatedBody} from "../interface/Custominterface"
import { Iuser } from "../interface/User";
import userModel from "../model/user.model";




export const createProduct = asyncHandler(
    async(req:Request<{} , {} , Iproduct> , res : Response , next : NextFunction) => {
const {name , productImage , price , category} = req.body;
const product = await productModel.create({name, productImage, price, category});
if(!product){
    next(new AppError ({
        message : "Product not found",
        httpCode : HttpCode.BAD_REQUEST,
        isOperational :  true
    }))
}
return res.status(201).json({
    message : "Product created successfully",
    data : product
}) 


    })


export const getProducts = asyncHandler(
    async(req:Request , res : Response , next: NextFunction) =>{
        const products = await productModel.find();

        if(!products){
            next(new AppError ({
                message : "Product not found",
                httpCode : HttpCode.BAD_REQUEST
            }))
        }

        return res.status(200).json({
            message : "Products fetched successfully",
            data : products
        })
    }
)

export const addToCart = asyncHandler(async(req: AuthenticatedBody<addProductToCart>, res: Response, next: NextFunction):Promise<Response> => {
    // const product = await productModel.findById(req!.body!._id)
    const user = await userModel.findOne({email: req!.user!.email})
    if(!user)
        next(
            new AppError({
                message: "User not found",
                httpCode: HttpCode.NOT_FOUND
            })
        )

        const doDecrease = req.query.doDecrease === "true";
        const updateUser = await user!.addToCart(req.body.productId, doDecrease)

        const finalUpdate = {
            user: updateUser
        }
        return res.status(200).json(finalUpdate)
})