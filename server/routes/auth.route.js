import express from 'express';
import { signUp } from '../controllers/auth/signup.controller.js';
import { signIn, getUserProfile } from '../controllers/auth/auth.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);

router.get('/profile', verifyToken, getUserProfile);

export default router;