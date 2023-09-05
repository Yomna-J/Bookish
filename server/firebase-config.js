const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_RUL,
});

const db = admin.firestore();

module.exports = {
  admin,
  db,
};
