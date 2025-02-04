import { Request, Response } from "express";
import dbServices from "../services/dbServices";

export default class UserController {
  static create = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await dbServices.User.getUserByEmail(email);
      if (existingUser) throw new Error("User already exists");
      const newUser = await dbServices.User.createUser(name, email, password);
      res.status(201).send({ message: "User created successfully", newUser });
    } catch (error: any) {
      res.status(500).send({ message: `Error creating user: ${error.message}` });
    }
  };
}
