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
            error: "cannot get products"
        });
    }
}
module.exports.createProduct = async (req, res)=>{
    const {
        recyclableMaterial,
        quantity,
        volume,
        price,
        location,
        pictureUrl,
    } = req.body;

    try {
        const createdBy = req.userId;
        //check if user exist
        const user = await User.findById(createdBy);
        //console.log(user)
        const products = await Product.create({
            recyclableMaterial,
            quantity,
            volume,
            price,
            location,
            pictureUrl,
            createdBy: req.userId,
        });
        res.status(201).json({
            status: "success",
            data: {
                products,
            },
        });

    } catch (error) {
        console.error("Error creating product", error)
        res.status(400).json({
            status: "fail",
            error: "cannot list product",
        });
    }
}

module.exports.editProduct = async (req, res) => {

}
module.exports.deleteProduct = async (req, res) => {

}