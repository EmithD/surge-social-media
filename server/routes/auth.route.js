import express from 'express';
import { signUp } from '../controllers/auth/signup.controller.js';
import { signIn } from '../controllers/auth/signin.controller.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);

export default router;