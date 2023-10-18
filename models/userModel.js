const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your fullname"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "please enter your email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "please enter a password"],
      unique: true,
      minlength: [8, "minimum password length is 8 character"],
    },
    walletAddress: {
      type: String,
      unique: true,
    },
    twoFactorSecret: {
      type: String,
    },
    twoFactorCodeExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
    },

    // role: {
    //   type: String,
    //   enum: ["seller", "buyer"],
    //   default: "buyer",
    //   required: false,
    //   validate: {
    //     validator: function (v) {
    //       return /^(seller|buyer)$/.test(v);
    //     },
    //     message: "Invalid role value: {VALUE}",
    //   },
    // },
  },

  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
module.exports = { User };
