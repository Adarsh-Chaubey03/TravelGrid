import express from 'express';
const router = express.Router();
import {createPost,getAllPosts,addReply,getRepliesByPostId,getPostById,getPostByType} from '../controller/postController.js';
import { verifyJWT } from '../middleware/auth.js';

router.post('/createPost',verifyJWT,createPost);
router.get('/allPosts',getAllPosts);
router.post('/reply/:postId',verifyJWT,addReply);
router.get('/getRepliesById/:postId',getRepliesByPostId);
router.get('/getPostByid/:postId',getPostById);
router.get('/getPostByType/type',getPostByType);

export default router;