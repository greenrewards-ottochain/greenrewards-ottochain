const express = require("express");
const {
  signUp_post,
  login,
  updateTwoFA,
  saveWallet,
  getAllUsers,
} = require("../controllers/userController");
const route = express.Router();

route.get("/", getAllUsers);
route.post("/signUp", signUp_post);
route.post("/login", login);
route.put("/update/fa", updateTwoFA);
route.put("/update/wallet", saveWallet);
//route.get("/logout", userController.signUp)

module.exports = route;
