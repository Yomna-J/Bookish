const { db, admin } = require("../config/firebase-config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const TOKEN_EXPIRATION = "2h";

exports.loginUser = async (req, res) => {
  try {
    const { email, password, cart } = req.body;

    const user = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (user.empty) {
      return res.status(401).json({ email: "Incorrect email or password" });
    }

    const userDoc = await admin.auth().getUserByEmail(email);

    const userData = user.docs[0].data();
    const hashedPassword = userData.hashedPassword;

    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ email: "Incorrect email or password" });
    }

    const mergedCartItems = mergeCarts(userData.cart, cart);

    await db.collection("users").doc(userDoc.uid).update({
      cart: mergedCartItems,
    });

    const accessToken = jwt.sign(
      { uid: userDoc.uid },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      { uid: userDoc.uid },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await db.collection("users").doc(userDoc.uid).update({
      refreshToken: refreshToken,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, cart: mergedCartItems });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(401).json({ email: "Incorrect email or password" });
  }
};
// Helper function to merge two carts
function mergeCarts(databaseCart, frontendCart) {
  const mergedCart = Array.isArray(frontendCart.items)
    ? [...frontendCart.items]
    : [];

  databaseCart.items.forEach((databaseItem) => {
    const existingItem = mergedCart.find((item) => item.id === databaseItem.id);
    if (existingItem) {
      existingItem.quantity += databaseItem.quantity;
    } else {
      mergedCart.push(databaseItem);
    }
  });

  return {
    items: mergedCart,
  };
}
