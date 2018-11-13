const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// Require all the routes
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const accounts = require("./routes/api/accounts");
const biddingproducts = require("./routes/api/biddingproducts");
const biddings = require("./routes/api/biddings");
const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config
const db = require("./config/keys").mongoURI;

//connect mongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

//Use Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/accounts", accounts);
app.use("/api/biddingproducts", biddingproducts);
app.use("/api/biddings", biddings);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
