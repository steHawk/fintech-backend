import crypto from "crypto";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateTokens.js";
import User from "../models/userModel.js";
import UserAuth from "../models/userAuthModel.js";

async function getOtpData() {
  console.log("....");
  return {
    otpToken: crypto.randomBytes(20).toString("hex"),
    otpTokenExpires: Date.now() + 3600000,
    // otp: Math.floor(100000 + Math.random() * 900000)
    otp: 123456,
  };
}

const userLogin = asyncHandler(async (req, res) => {
  const { mobile } = req.body;

  console.log(mobile, "...")
  try {
    console.log(mobile);
    let user = await User.findOne({ mobile }).exec();
    console.log(user);
    if (!user) {
      let response = `This number is not registered`;
      return {
        statusCode: 403,
        response: {
          error: response,
        },
      };
    }

    const { otpToken, otpTokenExpires, otp } = await getOtpData();

    // Send OTP to the user

    // await sendOtp(phone, otp);

    // update user details with token and OTP
    await UserAuth.updateOne(
      { mobile },
      {
        userName: user["userName"],
        mobile,
        otp,
        otpTokenExpires: otpTokenExpires,
        otpToken: otpToken,
        verifyType: "LOGIN",
      },
      { upsert: true }
    );

    return res.status(200).json({
      statusCode: 200,
      response: {
        userName: user["userName"],
        mobile,
        otp,
        otpToken,
      },
    });
  } catch (error) {
    return res.status(403).json({
      statusCode: 403,
      response: {
        error: `${error}`,
      },
    });
  }
});

const isPhoneAuthenticated = async (phone) => {
  return User.findOne({ mobile: phone });
};

const registerUser = asyncHandler(async (req, res) => {
  const { mobile, userName } = req.body;

  let _phone = await User.findOne({ mobile }).exec();

  const { otpToken, otpTokenExpires, otp } = await getOtpData();
  //    await sendOtp(phone, otp);

  console.log("....", otpToken, otpTokenExpires, otp);

  if (_phone) {
    return res.status(403).json({
      statusCode: 403,
      response: {
        error: `User already registered with this mobile number`,
      },
    });
  }

  console.log("+++");
  await UserAuth.updateOne(
    { mobile },
    {
      userName,
      mobile,
      otp,
      otpTokenExpires: otpTokenExpires,
      otpToken: otpToken,
      verifyType: "SIGNUP",
    },
    { upsert: true }
  );

  return res.status(200).json({
    statusCode: 200,
    response: {
      userName,
      mobile,
      otp,
      otpToken,
    },
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User Logged out" });
});

const test = asyncHandler(async (req, res) => {
  generateToken(res, "jfhgggsdbkfghjdbskjfhbjk", "USER");
  res.status(200).json({ message: "User Logged out" });
});

const verifyUserOtp = asyncHandler(async (req, res) => {
  let { otpToken, signupOtp, verifyType } = req.body;
  try {
    const userAuth = await UserAuth.findOne({
      otp: signupOtp,
      otpToken: otpToken,
      verifyType: verifyType,
      otpTokenExpires: { $gte: new Date() },
    });

    if (userAuth) {
      let user;
      if (verifyType === "SIGNUP") {
        let _mobile = await isPhoneAuthenticated(userAuth["mobile"]);

        if (!_mobile) {
          user = await User.create({
            mobile: userAuth["mobile"],
            userName: userAuth["userName"],
          });
        } else {
          return res.status(401).json({
            statusCode: 401,
            response: {
              error: "Registered user trying to signup again",
            },
          });
        }
      } else if (verifyType === "LOGIN") {
        user = await User.findOne({ mobile: userAuth["mobile"] });

        console.log("user", user);
      } else {
        return res.status(401).json({
          statusCode: 401,
          response: {
            error: "Missing required headers",
          },
        });
      }
      let token = generateToken(res, user["_id"], "USER");
      return res.status(200).json({
        statusCode: 200,
        response: {
          _id: user["_id"],
          otpVerified: true,
          token
        },
      });
    }
    return res.status(401).json({
      statusCode: 401,
      response: {
        error: "Otp verification failed",
      },
    });
  } catch (e) {
    console.log("e", e);
    return res.status(401).json({
      statusCode: 401,
      response: {
        error: `${e}`,
      },
    });
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.userName,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.password = req.body.password;

    if ((req, body.password)) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  test,
  userLogin,
  verifyUserOtp,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
