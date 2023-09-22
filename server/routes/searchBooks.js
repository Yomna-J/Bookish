const express = require("express");
const { searchBooks } = require("../controllers/searchBooksController");
const router = express.Router();

router.get("/", searchBooks);

module.exports = router;
