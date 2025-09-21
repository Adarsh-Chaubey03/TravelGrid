import express from 'express'
import { addComment, deleteComment, getAllComments } from '../controller/reviewsController.js'

const router = express.Router();

// Route to add a comment
router.post("/add", addComment);
router.get("/", getAllComments);
router.delete("/delete/:reviewId",deleteComment)

export default router
