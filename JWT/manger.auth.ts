import { Request, Response, NextFunction } from "express";
import {Authuser} from "../interface/User"
export const isManager = (
  req: Authuser,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role === "manager") {
    next();
  } else {
    res.status(403).json({ message: "You are not a manager" });
  }
};