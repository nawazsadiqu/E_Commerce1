const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  flavor: { type: String },
  image: { type: String },
});

const ProductModel = mongoose.model("products", ProductSchema);
module.exports = ProductModel;
