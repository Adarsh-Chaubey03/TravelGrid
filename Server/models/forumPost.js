import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const forumPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  replies: [replySchema],
}, { timestamps: true });

const ForumPost = mongoose.model('ForumPost', forumPostSchema);

export { ForumPost };
export default ForumPost;