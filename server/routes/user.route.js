import express from 'express';
import { uploadPFP } from '../controllers/user/user.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.put('/uploadPFP', verifyToken, uploadPFP);

export default router;