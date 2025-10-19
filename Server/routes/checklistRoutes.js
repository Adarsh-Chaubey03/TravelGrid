import express from "express";
import { generateChecklist, saveChecklist, getSavedChecklists } from "../controller/checklistController.js";
import { verifyJWT as protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post("/generate", generateChecklist);

// Protected routes (require authentication)
router.post("/save", protect, saveChecklist);
router.get("/saved/:userId", protect, getSavedChecklists);

export default router;