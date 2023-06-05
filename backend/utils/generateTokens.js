import jwt from "jsonwebtoken";

const generateToken =  (res, userId, role) => {

  const token = jwt.sign({ id: userId, role, tokenType: "access" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

   res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.Node_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 1000,
  });

  return token;
};


export default generateToken;