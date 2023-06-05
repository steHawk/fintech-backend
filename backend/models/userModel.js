

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        index: true,
    },
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
    profilePic: {
        type: Schema.Types.Mixed,
        default: {
            file: "https://idronline.org/wp-content/uploads/2021/01/Screen-Shot-2019-02-19-at-1.23.40-PM-300x300-3.jpg",
            name: "profile pic",
            path: "",
        },
    },
    loginType: {
        type: String,
        enum: ['facebook', 'google', 'custom'],
    },
    signupType: {
        type: String,
        enum: ['facebook', 'google', 'custom'],
    },
    loginStatus: {
        type: String,
        enum: ['active', 'inactive']
    },
    deviceIds: [{ type: String }],
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
        },
        coordinates: [],
    },
    address: {
        city: {
            type: String,
        },
        doorNo: {
            type: String,
        },
        street: {
            type: String,
        },
        landMark: {
            type: String,
        },
        pincode: {
            type: String,
        },
    },
    gender: {
        type: String,
    },
    accountStatus: {
        default: 'active',
        type: String,
    },
    fcmToken: [{ type: String }],
    lender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lender',
    },
    borrowerAssets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Borrower',
    }],
    createdTime: {
        type: Date,
        default: Date.now,
    },
    updatedTime: {
        type: Date,
        default: Date.now,
    },
}, { versionKey: 'v1' });

userSchema.index({
    address: '2dsphere',
});

const User = mongoose.model('User', userSchema);

export default User ;
