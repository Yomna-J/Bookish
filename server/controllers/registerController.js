const { admin, db } = require("../config/firebase-config");

exports.registerUser = async (req, res) => {
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
      return res.status(409).json({ email: "Email is already in use" });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        const userRecord = await admin.auth().createUser({
          email,
          password,
        });

        await db
          .collection("users")
          .doc(userRecord.uid)
          .set({
            firstName,
            lastName,
            email,
            phone,
            cart: { items: [] },
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
};
