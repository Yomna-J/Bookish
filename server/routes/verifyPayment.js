const express = require("express");
const router = express.Router();
const { verifyPayment } = require("../controllers/verifyPaymentController");

router.get("/", verifyPayment);

module.exports = router;
