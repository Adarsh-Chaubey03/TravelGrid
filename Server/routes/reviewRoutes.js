import express from "express";
import { addComment, getAllComments } from "../controller/reviewsController.js";

const router = express.Router();

// Route to add a comment
router.post("/add", addComment);
router.get("/", getAllComments);

export default router;