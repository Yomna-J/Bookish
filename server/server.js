const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");

const bodyParser = require("body-parser");
require("dotenv").config();

// Middleware
app.use(bodyParser.json());
app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes

app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use("/books", require("./routes/listBooks"));
app.use("/book", require("./routes/getBook"));
app.use("/search", require("./routes/searchBooks"));

// Protected Routes
app.use(verifyJWT);
app.use("/user", require("./routes/user"));
app.use("/cart", require("./routes/cart"));
app.use("/update-cart", require("./routes/updateCart"));

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
