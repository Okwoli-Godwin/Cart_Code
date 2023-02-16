import jwt, { JwtPayload, Secret, VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppError, HttpCode } from "../utils/AppError";
import userModel from "../model/user.model"
import {Iuser} from "../interface/User"
interface PayLoad extends JwtPayload {
  _id: string;
  email: string;
}

const secret = "wisgafdwqvzdrtwLKZL";

export const generateToken = (user: PayLoad) => {
  return jwt.sign(user, secret as Secret, { expiresIn: "1h" });
};

export const userAuth = (req: Request, res: Response, next: NextFunction) => {
  //make requests for our token from the headers
  const headers = req.headers.authorization;
  if (!headers || !headers.startsWith("Bearer ")) {
    next(
      new AppError({
        httpCode: HttpCode.UNAUTHORIZED,
        message: "you are not authorized",
      })
    );
  }

  const token: string = headers!.split(" ")[1];

  //verify the token payload
  jwt.verify(
    token,
    secret as Secret,
    async (err: VerifyErrors | null, decodedUser: any) => {
      if (err) {
        const errorMsg =
          err.name === "JsonWebTokenError"
            ? "Invalid token , you are unauthorised"
            : err.message;

        next(
          new AppError({
            httpCode: HttpCode.UNAUTHORIZED,
            message: errorMsg,
          })
        );
      }
      try {
        const verifiedUser = await userModel.findOne({ _id: decodedUser!._id });
        if (!verifiedUser) {
          next(
            new AppError({
              message: "Unauthorized user ",
              httpCode: HttpCode.UNAUTHORIZED,
            })
          );
        }
        req!.user = verifiedUser as Iuser;

        next();
      } catch (error) {
        next(
          new AppError({
            httpCode: HttpCode.INTERNAL_SERVER_ERROR,
            message: error,
          })
        );
      }
    }
  );
};