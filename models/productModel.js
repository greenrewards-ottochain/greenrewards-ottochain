const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  recyclableMatrial: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  volume: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: true,
  },

  pictureUrl: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const Product = mongoose.model("project", productSchema);

module.exports = { Product };
