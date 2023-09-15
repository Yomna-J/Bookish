const { db, admin } = require("../config/firebase-config");
const jwt = require("jsonwebtoken");

const TOKEN_EXPIRATION = "2h";

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, { password });

    const accessToken = jwt.sign(
      { uid: user.uid },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { uid: user.uid },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await db.collection("users").doc(user.uid).update({
      refreshToken: refreshToken,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(401).json({ error: "Incorrect email or password" });
  }
};
