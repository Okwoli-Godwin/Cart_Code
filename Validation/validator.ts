import { NextFunction } from "express";
import Joi from "joi";
import { AppError, HttpCode } from "../utils/AppError";

export const validator = async (
  schemaName: Joi.ObjectSchema,
  body: object,
  next: NextFunction
): Promise<void> => {
  const value = await schemaName.validate(body, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  });

  try {
    value.error
      ? next(
          new AppError({
            httpCode: HttpCode.BAD_REQUEST,
            message: value.error.details[0].message,
          })
        )
      : next();
  } catch (error) {
    new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      message: error,
    });
  }
};