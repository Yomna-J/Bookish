const { db } = require("../config/firebase-config");
const jwt = require("jsonwebtoken");

exports.getUserDetails = async (req, res) => {
  try {
    const uid = req.params.uid;

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    delete userData.refreshToken;

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
