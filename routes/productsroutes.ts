import express, { Router } from "express";
import {createProduct, getProducts} from "../controller/product.controller"

const productRouter = Router();

productRouter.route("/postproducts").post(createProduct);
productRouter.route("/getproducts").get(getProducts);

export default productRouter