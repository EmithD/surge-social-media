import express from 'express';
import {createPost, deletePost, getPosts, likePost} from '../controllers/posts/post.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createPost);
router.get('/', verifyToken, getPosts);
router.put('/like', verifyToken, likePost);
router.delete('/', verifyToken, deletePost);

export default router;