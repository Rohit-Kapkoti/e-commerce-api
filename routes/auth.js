const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  const email = await User.findOne({email:req.body.email})
  if (user) {
    res.status(401).json(`${user.username} username already exists`);
  }else if(email){
    res.status(401).json("email already exists")
  } else {
    try {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.PASS_SEC
        ).toString(),
        isAdmin: req.body.default,
      });
      const savedUser = await newUser.save();
      // const { password, ...others } = savedUser._doc;
      res.status(201).json(savedUser);
    } catch (err) {
      console.log(err)
      res.status(500).json(err + "error");
    }
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      res.status(401).json("Wrong credentials username");
      return;
    }
    // !user && res.status(401).json("wrong credintials")
    const hasedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hasedPassword.toString(CryptoJS.enc.Utf8);
    if (OriginalPassword !== req.body.password) {
      {
        res.status(401).json("wrong password");
        return;
      }
    }

    // OriginalPassword !== req.body.password &&{
    //   res.status(401).json("worng credentials")}
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    console.log(user);

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
