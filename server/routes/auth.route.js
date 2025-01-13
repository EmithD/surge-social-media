import express from 'express';
import { signUp } from '../controllers/auth/signup.controller.js';
import { signIn, signout, getUserProfile } from '../controllers/auth/signin.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signout);
router.get('/profile', verifyToken, getUserProfile);

export default router;