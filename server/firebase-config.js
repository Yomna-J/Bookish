const express = require("express");
const firebase = require("firebase");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { getAuth } = require("firebase/auth");
const { doc, setDoc } = require("firebase/firestore");
const jwt = require("jsonwebtoken");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const auth = getAuth(firebase.app()); // Get auth instance from Firebase

module.exports = { app, db, auth };
