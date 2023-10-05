const { db } = require("../config/firebase-config");
const jwt = require("jsonwebtoken");

exports.getCart = async (req, res) => {
  try {
    // Getting the user's cart from the DB (protected route)
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authHeader.replace("Bearer ", "");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken || !decodedToken.uid) {
      return res.status(401).json({ error: "Invalid access token" });
    }

    const uid = decodedToken.uid;

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();

    if (userData && userData.cart) {
      res.status(200).json(userData.cart);
    } else {
      res.status(404).json({ error: "Cart not found for this user" });
    }
  } catch (error) {
    console.error("Error fetching user's cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
