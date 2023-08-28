const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRouter = require("./routes/authRoutes");
const { app } = require("./firebase-config"); // Adjust the path if needed

const server = express(); // Change variable name to 'server'

server.use(cors());
server.use(bodyParser.json());

server.use("/api/auth", authRouter);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
