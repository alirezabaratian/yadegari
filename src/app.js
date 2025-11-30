require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const databaseURI = process.env.DB_URI;
mongoose.connect(databaseURI);

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

app.get("/:userAddress", async (req, res) => {
  try {
    const userAddress = req.params.userAddress;
    const foundUser = await User.findOne({ username: userAddress });
    if (!foundUser) {
      res.render("no-such-user");
    } else {
      res.render("new-memo", {
        username: foundUser.username,
        name: foundUser.name,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/sign-up", async (req, res) => {
  try {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;

    const foundUser = await User.findOne({ username: username });
    if (foundUser) {
      res.render("sign-up-failure");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username: username,
        password: hashedPassword,
        name: name,
      });
      await newUser.save();
      res.render("user-memos", {
        username: newUser.username,
        name: newUser.name,
        memos: newUser.memos,
        webAddress: webAddress,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/sign-in", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const foundUser = await User.findOne({ username: username });
    if (!foundUser) {
      res.render("not-registered");
    } else {
      const isMatch = await bcrypt.compare(password, foundUser.password);
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
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/new-memo", async (req, res) => {
  try {
    let author = req.body.author;
    if (author === "") {
      author = "ناشناس";
    }
    const username = req.body.username;
    const memo = req.body.memo;

    const newMemo = new Memo({
      author: author,
      date: new Date().toLocaleString("fa-IR"),
      message: memo,
    });

    await newMemo.save();

    const foundUser = await User.findOne({ username: username });
    foundUser.memos.push(newMemo);
    await foundUser.save();
    res.render("thanks");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log("Server is listening on " + webAddress);
});
