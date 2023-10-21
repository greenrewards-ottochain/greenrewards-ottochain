const { Product } = require("../models/productModel");
const { User } = require("../models/userModel");

module.exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: "cannot get products",
    });
  }
};

module.exports.createProduct = async (req, res) => {
  const { recyclableMaterial, quantity, volume, price, location, pictureUrl } =
    req.body;

  try {
    console.log(req.user);
    const createdBy = req.user.id;
    //check if user exist
    const user = await User.findById(createdBy);
    console.log(user);
    const products = await Product.create({
      recyclableMaterial,
      quantity,
      volume,
      price,
      location,
      pictureUrl,
      createdBy: req.user.id,
    });
    res.status(201).json({
      status: "success",
      data: {
        products,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: "fail",
      error: err.message,
    });
  }
};

module.exports.editProduct = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  Product.findByIdAndUpdate(req.params.id, { ...req.body }, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found product with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error editing with id " + req.params.id,
        });
      }
    } else
      res.status(200).send({
        message: `product edited successfully.`,
      });
  });
};

module.exports.deleteProduct = async (req, res) => {
  Product.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found product with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete product with id " + req.params.id,
        });
      }
    } else res.send({ message: `product was deleted successfully!` });
  });
};
