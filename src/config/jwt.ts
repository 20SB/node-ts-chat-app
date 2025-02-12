import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET || "difficult_secret";
console.log("secret", secret);

export const generateToken = (payload: { userId: string }) => {
  try {
    return jwt.sign(payload, secret, { expiresIn: "24h" });
  } catch (error: any) {
    throw new Error(`Error generating token: ${error.message}`);
  }
};

export const verifyToken = (token: string) => {
  try {
    if (!token.startsWith("Bearer ")) throw new Error("Invalid token");
    // const newToken =  token.slice(7)
    return jwt.verify(token.slice(7), secret);
  } catch (error: any) {
    throw new Error(`Error verifying token: ${error.message}`);
  }
};
