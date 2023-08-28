const express = require("express");
const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const { doc, setDoc } = require("firebase/firestore");
const jwt = require("jsonwebtoken");

const { auth, db } = require("../firebase-config");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userRef = doc(db, "users", userCredential.user.uid);
    await setDoc(userRef, {
      email,
      firstName,
      lastName,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      res.status(400).json({ error: "Email is already in use" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const token = jwt.sign(
      { userId: userCredential.user.uid },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
