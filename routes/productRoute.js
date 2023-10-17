const express = require("express");
const {
  getAllProduct,
  createProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/productController");
//const { authorizeSeller } = require("../middleware/auth");
const route = express.Router();

route.get("/products", getAllProduct);
route.post("/listProduct",  createProduct);
route.put("/edit/:productId", editProduct);
route.delete("/delete/:productId", deleteProduct);

module.exports = route;
