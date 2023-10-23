const { Product } = require("../models/productModel");
const { User } = require("../models/userModel");

exports.getAllProduct = async (req, res) => {
  try {
    const result = await Product.find();
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
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
  const updateData = req.body

  try{
    const productId = req.params.id
    
    if(!productId || !updateData){
      return res.status(400).json({
        status:"fail",
        message:"Both productId and updateData are required."
      })
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      productId, updateData,{new:true}
    )
    if(!updatedProduct){
      return res.status(404).json({
        Status:"fail",
        message: "Product with not found."
      })
    }
    res.status(200).json({
      status:"success",
      data: updatedProduct,
    })
  }catch(err){
    console.log(err);
    res.status(400).json({
      status: "fail",
      error: err.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
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
