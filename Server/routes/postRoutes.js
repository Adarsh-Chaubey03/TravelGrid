const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');
const { verifyJWT } = require('../middleware/auth');

router.post('/createPost', verifyJWT, postController.createPost);
router.get('/allPosts', postController.getAllPosts);
router.post('/reply/:postId', verifyJWT, postController.addReply);
router.get('/getRepliesById/:postId', postController.getRepliesByPostId);
router.get('/getPostByid/:postId', postController.getPostById);
router.get('/getPostByType/type', postController.getPostByType);

module.exports = router;