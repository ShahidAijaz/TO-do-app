import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const generateTokenAndSaveInCookies =async (userId, res) => {
  jwt.sign(
    { userId },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "10d" },
    (err, token) => {
      if (err) {
        console.error("JWT Sign Error:", err);
        return res.status(500).json({ message: "Token generation failed" });
      }

      res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: false, // change to true in production with HTTPS
        path: "/",
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      });

      return token;
    }
  );
 await User.fiindByAndUpdate(userId, { token: token })
 return token;
};

