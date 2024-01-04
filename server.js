const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const mongoose = require("./db/dbConnection");
const bodyParser = require("body-parser");
const user = require("./routes/User")
require("dotenv").config();
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));



app.use(cors());
mongoose;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json({ limit: "50mb" }));

app.use("/user",user)



app.listen(port, () => console.log(`Server started on port ${port}`));
