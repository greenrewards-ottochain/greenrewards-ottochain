const express = require("express");
const {
  getAllProduct,
  createProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/productController");
const { requireAuth } = require("../middleware/auth");
const route = express.Router();

route.get("/allProducts", getAllProduct);
route.post("/listProduct", requireAuth, createProduct);
route.put("/edit/:productId", editProduct);
route.delete("/delete/:productId", deleteProduct);

module.exports = route;
