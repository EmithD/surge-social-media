import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
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
        { expiresIn: "60s" }
    );
};

export const signIn = async (req, res) => {

    try {
        
        const {  usernameOrEmail, password } = req.body;

        //validate
        if (!usernameOrEmail || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }
        
        //check for username or email
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

export const signout = async (req, res) => {
    try {
        const { token } = req.body;
        const userId = req.user.id; 
        
        const revokeResult = await revokeToken(userId, token);
        if (!revokeResult) {
            return res.status(400).json({ message: 'Failed to revoke token' });
        }

        await signOut(auth)
            .then(() => {
                res.status(200).json({ message: 'Successfully signed out and token revoked' });
            })
            .catch((error) => {
                throw new Error(error.message);
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