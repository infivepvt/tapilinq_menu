import bcrypt from "bcrypt";
const saltRounds = 10;

export const hashPassword = (password) => {
  try {
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

export const comparePassword = (password, hashedPassword) => {
  try {
    const isMatch = bcrypt.compareSync(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error("Error comparing password");
  }
};
