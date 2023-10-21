const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your fullname"],
    },
    email: {
      type: String,
      required: [true, "please enter your email"],
      lowercase: true,
      validate: [isEmail, "please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "please enter a password"],
      minlength: [8, "minimum password length is 8 character"],
    },
    twoFactorSecret: {
      type: String,
    },
    twoFactorCodeExpires: {
      type: Date,
    },
    walletAddress: {
      type: String,
      unique: true,
    },
    isVerified: {
      type: Boolean,
    },
  },

  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
module.exports = { User };
