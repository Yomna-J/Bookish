const { db, admin } = require("../config/firebase-config");

exports.logoutUser = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  const foundUserQuery = await db
    .collection("users")
    .where("refreshToken", "==", refreshToken)
    .get();

  if (foundUserQuery.empty) {
    // No user found with the specified refresh token
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  // Assuming there's only one matching user, get the first document
  const foundUserDoc = foundUserQuery.docs[0];

  try {
    // Delete the refreshToken field from the user's document
    await db.collection("users").doc(foundUserDoc.id).update({
      refreshToken: admin.firestore.FieldValue.delete(),
    });

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

    return res.sendStatus(204); // Refresh token deleted successfully
  } catch (error) {
    console.error("Error deleting refresh token:", error);
    return res.sendStatus(500); // Internal server error
  }
};
