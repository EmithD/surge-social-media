import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import User from "../../models/user.model.js";
import { app } from "../../config/firebaseConfig.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const auth = getAuth(app);
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            email: user.email,
        },
        JWT_SECRET,
        { expiresIn: "120s" }
    );
};

export const signIn = async (req, res) => {
    try {
        
        const {  usernameOrEmail, password } = req.body;

        //validation
        if (!usernameOrEmail || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }
        const user = await User.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or email' });
        }

        //firebase auth
        try {
            await signInWithEmailAndPassword(auth, user.email, password);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

        const token = generateToken(user);

        const { ...showUser } = user.toObject();
        res.status(200).json({
            message: "Sign-in successful",
            user: showUser,
            token,
        });

    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

export const getUserProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { ...showUser } = user.toObject();
        res.status(200).json(showUser);
        
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};