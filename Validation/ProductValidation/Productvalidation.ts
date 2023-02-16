import { productSchemaValidator } from "./productSchema";
import { validator } from "../validator";
import { NextFunction, RequestHandler, Request, Response } from "express";

export const productValidation: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validator(productSchemaValidator.post, req.body, next);
};