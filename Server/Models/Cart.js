// Models/Cart.js
const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  price: Number,
  image: String,
  quantity: { type: Number, default: 1 },
});

const CartSchema = new mongoose.Schema(
  {
   user: { type: String, required: true, unique: true }, 
    items: [CartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
