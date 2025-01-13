import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import User from "../../models/user.model.js";
import { app } from "../../config/firebaseConfig.js";

export const signUp = async (req, res) => {
    try {
        const { username, email, fullName, password, pfp } = req.body;

        //validation
        if (!username || !email || !fullName || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        //check for username
        const existingUserName = await User.findOne({ username });
        if (existingUserName) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        //check for email
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        //firebase auth
        const auth = getAuth(app);
        const firebaseUser = await createUserWithEmailAndPassword(auth, email, password)
                                    .then((userCredential) => userCredential.user)
                                    .catch((error) => {
                                        throw new Error(error.message);
                                    });

        // Create a new user
        const user = await User.create({
            username,
            email,
            fullName,
            pfp,
            firebaseUid: firebaseUser.uid,
        });

        const {  ...showUser } = user.toObject();
        res.status(201).json(showUser);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};