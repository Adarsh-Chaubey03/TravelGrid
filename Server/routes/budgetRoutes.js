const express = require("express");
const { estimateBudget } = require("../controller/budgetController.js");

const router = express.Router();

router.post("/estimate", estimateBudget); // POST { destination, days, travelers }

module.exports = router;
