require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { admin, db } = require("../config/firebase-config");

const TOKEN_EXPIRATION = "2h";

router.post("/register", async (req, res) => {
  try {
    const { email, password, confirmPassword, firstName, lastName, phone } =
      req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ confirmPassword: "Passwords do not match" });
    }

    try {
      await admin.auth().getUserByEmail(email);
      return res.status(400).json({ email: "Email is already in use" });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
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

        return res
          .status(201)
          .json({ message: "User registered successfully" });
      }
      console.error("Error during registration:", error);
      return res.status(500).json({ error: "Failed to register user" });
    }
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

    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, {
      expiresIn: TOKEN_EXPIRATION,
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(401).json({ error: "Incorrect email or password" });
  }
});

router.get("/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userDoc = await db.collection("users").doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
