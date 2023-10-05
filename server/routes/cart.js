const express = require("express");
const router = express.Router();
const { getCart } = require("../controllers/getCartController");

router.get("/", getCart);

module.exports = router;
