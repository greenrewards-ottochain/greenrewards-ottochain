const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();

//function to generate 4 digit code
const generateCode = () => {
  const code = Math.floor(1000 + Math.random() * 9000);
  return code;
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await User.find();
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

module.exports.signUp_post = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check if user already exists
    const userEmail = await User.findOne({ email: req.body.email });

    if (userEmail) {
      return res.status(400).json({
        status: "fail",
        message: "user already exists",
      });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //generate 4 digit code
    const code = generateCode();

    //store code with user's data in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      twoFactorSecret: code,
      twoFactorCodeExpires: Date.now() + 600000,
    });

    //send code to user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "greenrewards9@gmail.com",
        pass: "slaldhjhovkqhdlm",
      },
    });

    //verify connection configuration
    transporter.verify((err, success) => {
      if (err) {
        console.log(err);
      } else {
        console.log("server is ready to take messages");
      }
    });
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Email Verification",
      html: `<h2>Thank you for registering with Green Reward</h2>
      <p>Your verification code is ${code}</p>
      <p>This code will expire in 5 minutes.</p>`,
    });
    res.status(201).json({
      status: "success",
      message: "user created successfully",
      data: user,
    });
  } catch (err) {
    const errors = err;
    res.status(400).json({ errors });
  }
};

module.exports.saveWallet = async (req, res) => {
  const { userId, walletAddress } = req.body;

  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    res.status(404).json({
      status: "fail",
      message: "user not found",
    });
  }

  //wallet address
  const saltRounds = 10;
  bcrypt.hash(walletAddress, saltRounds, async (err, hash) => {
    if (err) {
      res.status(500).json({
        status: "error",
        message: "cannot hash wallet address",
      });
    }

    const updateUserWallet = await User.findByIdAndUpdate(userId, {
      walletAddress: hash,
    });
    if (!updateUserWallet) {
      res.status(403).json({
        status: "fail",
        message: "not updated",
      });
    }
    res.status(200).json({
      status: "success",
      message: "wallet saved",
    });
  });
};

module.exports.updateTwoFA = async (req, res) => {
  const { email, faCode } = req.body;
  try {
    const isUserExist = User.findOne({ email });

    if (!isUserExist) {
      res.status(404).json({
        status: "fail",
        message: "can't find the user",
      });
    }

    const isCorrectCode = User.findOne({
      email,
      twoFactorSecret: faCode,
    });

    if (!isCorrectCode) {
      res.status(403).json({
        status: "fail",
        message: "wrong code",
      });
    }

    const updateVerification = User.findOneAndUpdate({
      email,
      isVerified: true,
    });

    if (!updateVerification) {
      res.status(403).json({
        status: "fail",
        message: "something went wrong, try again",
      });
    }

    res.status(200).json({
      status: "success",
      message: "verified successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "fail",
      message: "something went wrong, try again",
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    //find user
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "user does not exist",
      });
    }
    //if user found compare password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    //if password is not valid
    if (!validPassword) {
      return res.status(400).json({
        status: "fail",
        message: "invalid password",
      });
    }
    // Check if 2FA code has expired or is invalid
    if (
      user.twoFactorSecret !== req.body.code ||
      user.twoFactorCodeExpires < Date.now()
    )
      console.log("Received 2FA Code:", req.body.code);
    console.log("User's 2FA Secret:", user.twoFactorSecret);
    console.log("Code Expiration Timestamp:", user.twoFactorCodeExpires);

    {
      return res.status(400).json({
        status: "fail",
        message: "invalid code",
      });
    }

    //if password is valid create token
    const token = jwt.sign({ _id: user._id }, process.env.MY_SECRET, {
      expiresIn: "7days",
    });

    //verify token
    const verified = jwt.verify(token, process.env.MY_SECRET);
    //send token to client
    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(200).json({
      status: "success",
      message: "user logged in successfully",
      data: verified,
    });
  } catch (err) {
    const errors = err;
    res.status(400).json({ errors });
  }
};
