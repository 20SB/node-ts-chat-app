import { eq } from "drizzle-orm";
import postgresdb from "../../config/db";
import { users } from "../../models/schema";
import { hash } from "../../config/bcrypt";

export default class User {
  static getUserByEmail = async (email: string) => {
    try {
      const userData = await postgresdb.query.users.findFirst({where: eq(users.email, email)});
      if (userData) return userData;
      else return null;
    } catch (error: any) {
      throw new Error(`Error getting user by email: ${error.message}`);
    }
  };

  static createUser = async (name: string, email: string, password: string) => {
    try {
      const user = await postgresdb
        .insert(users)
        .values({ name, email, password: await hash(password) })
        .returning({ userId: users.userId, name: users.name, email: users.email });
      return user[0];
    } catch (error: any) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  };
}
