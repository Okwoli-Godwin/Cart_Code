import mongoose, { Schema , Document } from "mongoose";
import {ICartItems, Iuser} from "../interface/User"
import isEmail from "validator/lib/isEmail";
import {authRoles} from "../Constants/user.constant"

interface userData extends Document, Iuser {
  clearCart(): Promise<void>;
  removeFromCart(productId: string): Promise<void>
  addToCart(prodID: string, doDecrease: boolean): Promise<boolean>
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide your name"],
    },
    email: {
      type: String,
      required: [true, "please enter your email"],
      lowercase: true,
      trim: true,
      unique: true,
      validate: [isEmail, "please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "please provide your password"],
      minlength: 6,
      alphanum: true,
      matches: {
        Option: ["(?=*[a-zA-Z])(?=*[0-9]+)*","g"],
        errorMessage: "password must be alphanumeric"
      },
    },
    confirm: {
      type: String,
      required: [true, "please provide your password"],
      minlength: 6,
      alphanum: true,
    },
    role: {
      type: String,
      required: [true, "please provide your role"],
      enum: [authRoles.admin, authRoles.manager, authRoles.user],
      message: `please choose one of the following roles: admin, user, manager`,
      default: "user",
    },
    cart: {
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "please select a product"],
          },
          quantity: {
            type: Number,
            required: [true, "please enter a quantity"]
          }
        },
      ]
    }
  },
  { versionKey: false, timestamps: true }
);


userSchema.methods.addToCart = function(
  prodID: string,
  doDecrease: boolean
){
  let cartItemIndex = -1
  let updateCartItem: ICartItems[] = []

  if (this.cart.items){
    cartItemIndex = this.cart.items.findIndex((cp: {productId: {toString: ()=> string}}) =>{
      return cp.productId.toString() === prodID.toString()
    })
    updateCartItem = [...this.cart.items]
  }

  let newQuantity = 1
  if(cartItemIndex >= 0){
    if(doDecrease){
      newQuantity = this.cart.items[cartItemIndex].quantity - 1
      if(newQuantity <= 0){
        return this.removeFromCart(prodID)
      } else {
        newQuantity = this.cart.items[cartItemIndex].quantity + 1
      }
      updateCartItem[cartItemIndex].quantity = newQuantity
    }
  } else {
    updateCartItem.push({
      productId: prodID,
      quantity: newQuantity
    })
  }

  const updateCart = {
    items: updateCartItem
  }

  this.cart.items = updateCart
  return this.save({validateBeforeSave: false})
}

userSchema.methods.removeFromCart = function(productId: string){
  const updateCart = this.cart.item.filter((item: {productId: {toString: ()=> string}}) => {
    return item.productId.toString() !== productId.toString()
  })
  this.cart.items = updateCart
}

userSchema.methods.clearCart = function(){
  this.cart = {items: []}
  return this.save({validateBeforeSave: false})
} 
const userModel = mongoose.model<userData>(
  "userDetailsCollections",
  userSchema
);

export default userModel;

