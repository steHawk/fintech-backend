import asyncHandler from "express-async-handler";
import Borrower from "../models/borrowerModel.js";
import User from "../models/userModel.js";

const test = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "User Logged out" });
});

const createBorrowerPost = asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.body.userId);
  
      if (!user) {
        console.log("User not found");
        return res.status(404).json({
          statusCode: 404,
          response: {
            message: "User not found",
          },
        });
      }
  
      // Creating borrower post
      const newPost = new Borrower({
        user: req.body.userId,
        itemName: req.body.itemName,
        description: req.body.description,
        itemImage: req.body.itemImage,
        expectedLoanAmount: req.body.expectedLoanAmount,
        category: req.body.category,
      });
  
      console.log(newPost);
  
      const savedPost = await newPost.save();
  
      user.borrowerAssets.push(savedPost._id);
  
      await user.save();
  
      return res.status(200).json({
        statusCode: 200,
        response: {
          message: "New borrower post added to the user successfully.",
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        statusCode: 500,
        response: {
          message: "Internal server error",
        },
      });
    }
  });



  const getBorrowersPostsByUserId = asyncHandler(async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          response: {
            message: "User not found",
          },
        });
      }
  
      // Find all borrowers belonging to the user
      const borrowers = await Borrower.find({ user: userId });
  
      return res.status(200).json({
        statusCode: 200,
        response: {
          borrowers,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        statusCode: 500,
        response: {
          message: "Internal server error",
        },
      });
    }
  });


export { test, createBorrowerPost, getBorrowersPostsByUserId };
