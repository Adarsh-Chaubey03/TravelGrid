const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        stars: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        }
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;