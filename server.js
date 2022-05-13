require("dotenv").config();


// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(cookieParser());
//app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

//Routes
app.get("/home", (req, res) => {
  res.cookie("mapID", -999);
  res.send();
});
const usersRoutes = require("./routes/users");
const mapsRoutes = require("./routes/maps");
const pointsRoutes = require("./routes/points");
// Mount all resource routes
app.use("/users", usersRoutes());
app.use("/maps", mapsRoutes());
app.use("/points", pointsRoutes());

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
