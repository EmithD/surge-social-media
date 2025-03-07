import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please enter username"]
        },
        email: {
            type: String,
            required: [true, "Please enter email"],
            unique: true
        },
        fullName: {
            type: String,
            required: [true, "Please enter full name"]
        },
        pfp: {
            type: String,
            required: false,
            default: 'https://res.cloudinary.com/dvrgbm47v/image/upload/v1736933808/hrqfnkj1ojqkhaa6e2be.png'
        },
        firebaseUid: {
            type: String,
            required: false
        },
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", UserSchema);
export default User;