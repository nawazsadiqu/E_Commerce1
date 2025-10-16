const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: {type:Number, required: true},
  password: { type: String }, // will be hashed
  googleId: { type: String }, // for Google OAuth users
});

module.exports = mongoose.model("User", userSchema);
