const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: String, required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: "Pending" },
  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
