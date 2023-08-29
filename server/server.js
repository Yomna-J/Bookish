const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/googleBooksRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
