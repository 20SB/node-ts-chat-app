import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../config/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export default class Auth {
  static authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header("Authorization");
      if (!token) throw new Error("No token provided");
      const decoded: any = verifyToken(token);
      req.user = decoded.userId;
      next();
    } catch (error: any) {
      res.status(500).send({ message: `Error authenticating user: ${error.message}` });
    }
  };
}
