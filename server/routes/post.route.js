import express from 'express';
import { createPost } from '../controllers/posts/post.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createPost);

export default router;