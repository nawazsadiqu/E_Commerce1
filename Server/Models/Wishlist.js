// Models/Wishlist.js
const mongoose = require("mongoose");

const WishlistItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  price: Number,
  image: String,
});

const WishlistSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, unique: true }, // using username
    items: [WishlistItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", WishlistSchema);
