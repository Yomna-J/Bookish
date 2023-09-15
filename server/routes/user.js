const express = require("express");
const router = express.Router();
const { getUserDetails } = require("../controllers/userController");

router.get("/:uid", getUserDetails);

module.exports = router;
