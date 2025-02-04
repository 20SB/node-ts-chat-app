import jwt from "jsonwebtoken";
const secret =  process.env.JWT_SECRET || "difficult_secret";
console.log("secret", secret);

export const generateToken = (payload: {userId:number}) => {
    try {
        return jwt.sign(payload, secret, {expiresIn: "24h"}); 
    } catch (error:any) {
        throw new Error(`Error generating token: ${error.message}`);
    }
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, secret);
    } catch (error:any) {
        throw new Error(`Error verifying token: ${error.message}`);
    }
}