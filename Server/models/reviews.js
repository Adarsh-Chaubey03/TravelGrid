import mongoose from 'mongoose'

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

export const Comment = mongoose.model("Comment", CommentSchema);
