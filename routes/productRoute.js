const express = require("express");
const {
  getAllProduct,
  createProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/productController");
const route = express.Router();

route.get("/", getAllProduct);
route.post("/listProduct", createProduct);
route.put("/edit/:ProductId", editProduct);
route.delete("/delete/:ProductId", deleteProduct);

module.exports = route;
