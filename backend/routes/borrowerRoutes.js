import express from "express";
import { createBorrowerPost, getBorrowersPostsByUserId, test } from "../controllers/borrowerController.js";
import { protect } from "../middleware/authMiddleware.js";

const borrowerRoutes = express.Router();

borrowerRoutes.get("/test", test);
borrowerRoutes.post("/create", protect, createBorrowerPost);
borrowerRoutes.get("/borrowers/:userId", protect, getBorrowersPostsByUserId);
// borrowerRoutes
//   .route("/borrower")
//   .get(protect, getBorrower)
//   .put(protect, updateBorrower);

export default borrowerRoutes;
