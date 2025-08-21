const Comment = require("../models/reviews");

const addComment = async (req, res) => {
  try {
    const { comment, stars } = req.body;
    const reviews = await Comment.create({
      content: comment,
      stars: stars,
    });
    await reviews.save();
    if (!reviews) return res.status(404).json({ error: "reviews not found" });
    res
      .status(201)
      .json({ review: reviews, message: "Comment added successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to add comment", details: err.message });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(comments);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch comments", details: err.message });
  }
};

module.exports = {
  addComment,
  getAllComments,
}
