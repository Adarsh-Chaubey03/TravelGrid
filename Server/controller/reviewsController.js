const Comment = require("../models/reviews");
const { asyncHandler } = require('../utils/asyncHandler');

const addComment = asyncHandler(async (req, res) => {
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

const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find().sort({ createdAt: -1 }); // latest first
  res.status(200).json(comments);
});

module.exports = {
  addComment,
  getAllComments,
};
