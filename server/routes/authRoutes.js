require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { admin, db } = require("../firebase-config");

const TOKEN_EXPIRATION = "2h";

router.post("/register", async (req, res) => {
  try {
    const { email, password, confirmedPassword, firstName, lastName, phone } =
      req.body;

    const existingUser = await admin.auth().getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ email: "Email is already in use" });
    }

    if (password !== confirmedPassword) {
      return res.status(400).json({ password: "Passwords do not match" });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    await db.collection("users").doc(userRecord.uid).set({
      firstName,
      lastName,
      email,
      phone,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, { password });

    const token = jwt.sign(
      { uid: user.uid, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: TOKEN_EXPIRATION,
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
});

module.exports = router;
