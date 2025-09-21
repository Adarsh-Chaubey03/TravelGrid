import {Comment} from '../models/reviews.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const addComment = asyncHandler(async (req, res) => {
  const { comment, stars } = req.body;
  const reviews = await Comment.create({
    content: comment,
    stars: stars,
  });

  if (!reviews) {
    return res.status(404).json({ error: "reviews not found" });
  }

  res
    .status(201)
    .json({ review: reviews, message: "Comment added successfully" });
});

export const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find().sort({ createdAt: -1 }); // latest first
  res.status(200).json(comments);
});
export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedComment = await Comment.findByIdAndDelete(id);

  if (!deletedComment) {
    return res.status(404).json({ error: "Comment not found" });
  }

  res.status(200).json({ message: "Comment deleted successfully" });
});