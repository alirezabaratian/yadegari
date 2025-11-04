const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const databaseName = process.env.DATABASE_NAME;
mongoose.connect(`mongodb://127.0.0.1:27017/${databaseName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const memoSchema = new mongoose.Schema(
  {
    author: String,
    date: String,
    message: String,
  },
  { timestamps: true, versionKey: false }
);
const userSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    name: String,
    memos: [memoSchema],
  },
  { timestamps: true, versionKey: false }
);

const Memo = new mongoose.model("Memo", memoSchema);
const User = new mongoose.model("User", userSchema);
const app = express();
const port = process.env.PORT;
const webAddress = `${process.env.WEB_ADDRESS}:${port}`;

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.render("introduction");
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

app.get("/sign-in", (req, res) => {
  res.render("sign-in");
});

app.get("/:userAddress", (req, res) => {
  const userAddress = req.params.userAddress;
  User.findOne({ username: userAddress }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (!foundUser) {
        res.render("no-such-user");
      } else {
        res.render("new-memo", {
          username: foundUser.username,
          name: foundUser.name,
        });
      }
    }
  });
});

app.post("/sign-up", (req, res) => {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        res.render("sign-up-failure");
      } else {
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
          if (hashErr) {
            console.log(hashErr);
            return res.status(500).send("Internal Server Error");
          }
          const newUser = new User({
            username: username,
            password: hashedPassword,
            name: name,
          });
          newUser.save((saveErr) => {
            if (saveErr) {
              console.log(saveErr);
              return res.status(500).send("Internal Server Error");
            } else {
              res.render("user-memos", {
                username: newUser.username,
                name: newUser.name,
                memos: newUser.memos,
                webAddress: webAddress,
              });
            }
          });
        });
      }
    }
  });
});

app.post("/sign-in", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (!foundUser) {
        res.render("not-registered");
      } else {
        bcrypt.compare(password, foundUser.password, (compareErr, isMatch) => {
          if (compareErr) {
            console.log(compareErr);
            return res.status(500).send("Internal Server Error");
          }
          if (!isMatch) {
            res.render("wrong-password");
          } else {
            res.render("user-memos", {
              username: foundUser.username,
              name: foundUser.name,
              memos: foundUser.memos,
              webAddress: webAddress,
            });
          }
        });
      }
    }
  });
});

app.post("/new-memo", (req, res) => {
  var author = req.body.author;
  if (author === "") {
    author = "ناشناس";
  }
  const username = req.body.username;
  const memo = req.body.memo;

  newMemo = new Memo({
    author: author,
    date: new Date().toLocaleString("fa-IR"),
    message: memo,
  });

  newMemo.save();

  User.findOne({ username: username }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      foundUser.memos.push(newMemo);
      foundUser.save();
      res.render("thanks");
    }
  });
});

app.listen(port, () => {
  console.log("Server is listening on " + webAddress);
});
