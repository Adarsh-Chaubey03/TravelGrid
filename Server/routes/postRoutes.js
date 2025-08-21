const express = require('express');
const router = express.Router();
const {createPost,getAllPosts,addReply,getRepliesByPostId,getPostById,getPostByType} = require('../controller/postController');
const { verifyJWT } = require('../middleware/auth');

router.post('/createPost',verifyJWT,createPost);
router.get('/allPosts',getAllPosts);
router.post('/reply/:postId',verifyJWT,addReply);
router.get('/getRepliesById/:postId',getRepliesByPostId);
router.get('/getPostByid/:postId',getPostById);
router.get('/getPostByType/type',getPostByType);

module.exports = router;