const express = require("express");
const { listBooks } = require("../controllers/listBooksController");
const router = express.Router();

router.get("/", listBooks);

module.exports = router;
