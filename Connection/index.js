const express = require("express");
const PORT = 5000;

const http = require("http");
const cors = require("cors");
const adminModel = require("../Models/adminModel");
const db = require("../MongoDB_Connection/db");
const bcrypt = require("bcrypt");
const propertyDetail = require("../Models/propertyDetailsModel");
const router = require("../Routes/userRoute");
const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
    // "http://localhost:3000",
    // "http://localhost:3006"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/images", express.static("../images"));
app.use("/api", require("../Routes/userRoute"));
app.use("/api", require("../Routes/ownerRoute"));
app.use("/api", require("../Routes/addPropertyRoute"));
app.use("/api", require("../Routes/adminRoute"));
app.use("/api", require("../Routes/localitiesRoute"));

app.listen(PORT, () => {
  db((err) => {
    if (err) console.log(err);
  });
  console.log(`Server is running on port: ${PORT}`);

  // propertyDetail.find({}).then((res) => (global.propertyDetails = res));
});
