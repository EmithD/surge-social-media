import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import User from "../../models/user.model.js";
import { app } from "../../config/firebaseConfig.js";

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
        const auth = getAuth(app);
        await signInWithEmailAndPassword(auth, user.email, password)
            .then((userCredential) => userCredential.user)
            .catch((error) => {
                throw new Error(error.message);
            });

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(200).json(userWithoutPassword);

    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};