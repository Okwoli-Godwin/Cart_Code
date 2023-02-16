import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import {Iuser} from "../interface/User"
import { AppError, HttpCode } from "../utils/AppError";
import { asyncHandler } from "../utils/AsyncHandler";
import userModel from "../model/user.model";
import {generateToken} from "../JWT/user.auth"

//register

export const register = asyncHandler(
  async (
    req: Request<{}, {}, Iuser>,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { name, email, password, confirm } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      confirm,
    });
    if (!user) {
      next(
        new AppError({
          message: "unable to post user",
          httpCode: HttpCode.BAD_REQUEST,
          name: AppError.name,
          isOperational: true,
        })
      );
    }

    return res.status(201).json({
      message: "created successfully",
      data: user,
    });
  }
);

//login
export const LoginUsers = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { email, password } = req.body;

    if (!email) {
      next(
        new AppError({
          message: "Please enter an email",
          httpCode: HttpCode.NOT_FOUND,
          name: AppError.name,
        })
      );
    }
    if (!password) {
      next(
        new AppError({
          message: "Please fill in all fields",
          httpCode: HttpCode.NOT_FOUND,
          name: AppError.name,
        })
      );
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      next(
        new AppError({
          message: "User does not exist, please sign up",
          httpCode: HttpCode.NOT_FOUND,
          name: AppError.name,
        })
      );
    }

    const checkPassword = await bcrypt.compare(password, user!.password);

    if (!checkPassword) {
      next(
        new AppError({
          message: "Either Email or Password not correct",
          name: AppError.name,
          isOperational: true,
          httpCode: HttpCode.UNAUTHORIZED,
        })
      );
    }
    const token = generateToken({ _id: user!._id, email: user!.email });

    return res.status(HttpCode.OK).json({
      message: `User login successful`,
      data: `Welcome ${user?.name}`,
      token,
    });
  }
);

//get all
export const getAll = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userModel.find();
    if (!users) {
      next(
        new AppError({
          message: "unable to get users",
          httpCode: HttpCode.BAD_REQUEST,
          name: AppError.name,
        })
      );
    }

    return res.status(HttpCode.OK).json({
      message: "users fetched successfully",
      data: users,
    });
  }
);