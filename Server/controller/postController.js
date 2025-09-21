import {Post} from '../models/posts.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// Create a post
export const createPost = asyncHandler(async (req, res) => {
  const { title, info, tag, tagColor, senderName, postType } = req.body;

  if (!title || !info || !tag || !tagColor || !senderName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const post = await Post.create({
    title,
    info,
    tag,
    tagColor,
    senderName,
    postType,
    replies: [],
  });

  res.status(201).json({ message: 'Posted Successfully', post });
});

// Get all posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.status(200).json(posts);
});

// Add reply to a post
export const addReply = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { senderName, message } = req.body;

  if (!senderName || !message) {
    return res.status(400).json({ message: 'Either message or senderName is missing' });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: 'No post of this id found' });
  }

  const reply = { senderName, message, createdAt: new Date() };
  post.replies.push(reply);
  await post.save();

  res.status(200).json({ message: 'Reply added', post });
});

// Get replies by post ID
export const getRepliesByPostId = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: 'No such Id found' });
  }

  res.status(200).json({ replies: post.replies });
});

// Get posts by type
export const getPostByType = asyncHandler(async (req, res) => {
  const { type } = req.query;

  if (type && typeof type !== 'string') {
    return res.status(400).json({ message: 'Invalid type parameter' });
  }

  if (type && type.length > 50) {
    return res.status(400).json({ message: 'Type parameter too long' });
  }

  const allowedTypes = ['experience', 'question', 'review', 'tip', 'story'];
  if (type && !allowedTypes.includes(type)) {
    return res.status(400).json({ message: 'Invalid post type specified' });
  }

  const query = type ? { postType: type } : {};
  const posts = await Post.find(query).sort({ createdAt: -1 });

  res.status(200).json(posts);
});

// Get post by ID
export const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.status(200).json(post);
});
