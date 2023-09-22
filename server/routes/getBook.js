const express = require("express");
const { getBook } = require("../controllers/getBookController");
const router = express.Router();

router.get("/", getBook);

module.exports = router;
