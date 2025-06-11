import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";

export const login = (req, res) => {
  const { email, password } = req.body;

  try {
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

const generateUsername = (email) => {
  const emailPrefix = email.split('@')[0];
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `${emailPrefix}${randomNumber}`;
};

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body.personal_info;
  try {
    let username = generateUsername(email);
    console.log(fullname, email, password);
     const existingUser = await userModel.findOne({
      $or: [
        { 'personal_info.email': email },
        { 'personal_info.username': username }
      ]
    }); 

    if (existingUser) {
      if (existingUser.personal_info.email === email) {
        return res.status(409).json({ message: "Email already exists." });
      }
      if (existingUser.personal_info.username === username) {
        return res.status(409).json({ message: "Generated username already exists. Please try again, or consider adding username to form." });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const newUser = await userModel.create({
      personal_info:{
        fullname,
      email,
      password: hashedPassword,
      username
    }
    });

    console.log(newUser);

    res.status(200).json({ message: "Signup Successful!!!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};
