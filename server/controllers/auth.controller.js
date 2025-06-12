import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async(req, res) => {
  const {email, password} = req.body.personal_info;

  try {
    const user = await User.findOne({"personal_info.email": email});
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.personal_info.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.personal_info.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful.",
      user: {
        fullname: user.personal_info.fullname,
        email: user.personal_info.email,
        username: user.personal_info.username,
        profile_img: user.personal_info.profile_img,
      },
      token,
    });
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
  const {fullname, email, password} = req.body.personal_info;

  try{
    const existingUser = await User.findOne({ "personal_info.email": email });
    if(existingUser){
      return res.status(400).json({message: "User with this email already exists."});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = generateUsername(email);

    const newUser = await User.create({
      personal_info: {
        fullname,
        email,
        password: hashedPassword,
        username,
      },
    });

    res.status(201).json({
      message: "User created successfully.",
      user: newUser.personal_info,
    });
  }
  catch(error){
    console.error("Error during signup:", error);
    res.status(500).json({message: "Internal server error."});
  }
};
