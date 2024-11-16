require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const v1Router = require("./routes/version1.routes");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/v1", v1Router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});
