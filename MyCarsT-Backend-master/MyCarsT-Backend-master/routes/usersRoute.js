const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
// const userModel = require("../models/userModel")

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });

    if (user) {
      res.send(user);
    } else {
      return res.status(400).json(error);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
});
router.post("/register", async (req, res) => {
  console.log("register server: ", req.body);
  const username = req.body.username;
  const password = req.body.password;
  const user = {
    username: username,
    password: password,
    role: "user",
  }

  try {
    const newuser = new User(user);

    console.log("server save fine");

    await newuser.save();

    res.send("User registered successfully");
  } catch (error) {
    console.log(error)
    return res.status(400).json(error);
  }
});
module.exports = router;
