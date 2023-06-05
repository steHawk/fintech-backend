import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const TOKENEXPIRE = {
  statusCode: 401,
  message: "Token Expired",
};

const AUTHERROR = {
  statusCode: 401,
  message: "Authorization Fields Not Provided",
};

const protect = asyncHandler(async (req, res, next) => {
  // let token;

  // token = req.cookies.jwt;

  console.log(req.body, req.headers.authorization);

  let bearerToken = req.headers.authorization;

  if (bearerToken) {
    try {
      bearerToken = bearerToken.slice(7);
      jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(200).send(TOKENEXPIRE);
        }
        req.id = decoded.id;
        req.role = decoded.role;
        return next();
      });
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized , no token");
    }
  } else {
    return res.status(401).send(AUTHERROR);
  }
});

export { protect };
