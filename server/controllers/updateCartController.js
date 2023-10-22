const { db } = require("../config/firebase-config");
const jwt = require("jsonwebtoken");

exports.updateCart = async (req, res) => {
  try {
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
    await db.collection("users").doc(uid).update({ cart: req.body.cart });

    res.status(200).json({ message: "Cart replaced successfully" });
  } catch (error) {
    console.error("Error replacing cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
