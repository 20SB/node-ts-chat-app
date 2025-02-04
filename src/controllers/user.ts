import { Request, Response } from "express";
import dbServices from "../services/dbServices";
import { compare } from "../config/bcrypt";
import { generateToken } from "../config/jwt";

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

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await dbServices.User.getUserByEmail(email);
      if (!user) throw new Error("User not found, please register");
      if (user.password === null) throw new Error("Password is null");
      const isPasswordMatch = await compare(password, user.password);
      if (!isPasswordMatch) throw new Error("Invalid password");
      const token = generateToken({ userId: user.userId });
      const userData = { userId: user.userId, name: user.name, email: user.email };
      res.status(200).send({ message: "User logged in successfully", user:userData, token });
    } catch (error: any) {
      res.status(500).send({ message: `Error logging in: ${error.message}` });
    }
  };
}
