import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hash = async (data: string) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedData = await bcrypt.hash(data, salt);
    return hashedData;
  } catch (error: any) {
    throw new Error(`Error hashing data: ${error.message}`);
  }
};

export const compare = async (data: string, hashedData: string) => {
  try {
    const isMatch = await bcrypt.compare(data, hashedData);
    return isMatch;
  } catch (error: any) {
    throw new Error(`Error comparing data: ${error.message}`);
  }
};
