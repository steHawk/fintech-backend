
import mongoose from "mongoose";

const Schema = mongoose.Schema;


const userAuthSchema = new Schema({
    email: {
        type: String,
        index: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    userName: {
        type: String,
    },
    otp: {
        type: Number,
    },
    otpToken: {
        type: String,
    },
    otpTokenExpires: {
        type: Date,
    },
    verifyType: {
        type: String,
        enum: ['SIGNUP', 'LOGIN'],
        default: 'SIGNUP'
    },
    createdTime: {
        type: Date,
        default: Date.now,
    },
    updatedTime: {
        type: Date,
        default: Date.now,
    },
}, { versionKey: 'v1.0.0' });


const UserAuth = mongoose.model('UserAuth', userAuthSchema);

export default  UserAuth ;
