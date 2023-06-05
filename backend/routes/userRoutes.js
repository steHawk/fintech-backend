import express from "express";
import {
  test,
  userLogin,
  verifyUserOtp,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRoutes = express.Router();

userRoutes.post("/registerUser", registerUser);
userRoutes.post("/userLogin", userLogin);
userRoutes.post("/verifyOtp", verifyUserOtp);
userRoutes.post("/logout", logoutUser);
userRoutes.get("/test", test);
userRoutes
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default userRoutes;
