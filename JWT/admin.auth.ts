import { Request, Response, NextFunction } from "express";
import { Authuser , Iuser } from "../interface/User";

export const isAdmin = (req: Authuser, res: Response, next: NextFunction) => {
  const user = req.user as Iuser;
  if (user && user.role === "admin") {
    next();
  } else {
    res
      .status(401)
      .json({ message: "You are not authorized to perform this action" });
  }
};

export const IsAdmin = (req: Request, res: Response, next: NextFunction) => {};