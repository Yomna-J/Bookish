const express = require("express");
const router = express.Router();
const { updateCart } = require("../controllers/updateCartController");

router.post("/", updateCart);

module.exports = router;
