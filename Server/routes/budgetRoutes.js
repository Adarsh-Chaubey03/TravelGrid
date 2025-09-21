import express from 'express'
import { estimateBudget } from '../controller/budgetController'

const router = express.Router();

router.post("/estimate", estimateBudget); // POST { destination, days, travelers }

export default router
