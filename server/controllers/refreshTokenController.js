const { db, admin } = require("../config/firebase-config");
const jwt = require("jsonwebtoken");

exports.handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const querySnapshot = await db
    .collection("users")
    .where("refreshToken", "==", refreshToken)
    .get();

  if (querySnapshot.empty) return res.sendStatus(403);
  const foundUserDoc = querySnapshot.docs[0];

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, decoded) => {
      if (error || foundUserDoc.id !== decoded.uid) return res.sendStatus(403);

      const accessToken = jwt.sign(
        { uid: decoded.uid },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      res.json({ accessToken });
    }
  );
};
