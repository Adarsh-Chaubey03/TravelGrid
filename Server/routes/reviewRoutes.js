const express = require("express");
const { addComment, getAllComments } = require("../controller/reviewsController.js");

const router = express.Router();

// Route to add a comment
router.post("/add", addComment);
router.get("/", getAllComments);

module.exports = router;
