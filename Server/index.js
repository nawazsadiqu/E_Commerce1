const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config({ path: ".env" });

// Models
const User = require("./Models/User");
const ProductModel = require("./Models/Product");
const CategoryModel = require("./Models/Category");
const CartModel = require("./Models/Cart");
const WishlistModel = require("./Models/Wishlist");
const OrderModel = require("./Models/Order");


const app = express();
app.use(
  cors({
    origin: ["https://e-commerce1-drab-ten.vercel.app", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());

// ---------------------- MONGO CONNECTION ----------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ---------------------- SESSION ----------------------
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

// ---------------------- PASSPORT SETUP ----------------------
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://e-commerce-03kf.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) return done(null, existingUser);

        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
        });

        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// ---------------------- GOOGLE AUTH ROUTES ----------------------
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    successRedirect: "http://localhost:5173/dashboard",
  })
);

app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

app.get("/auth/failure", (req, res) => {
  res.send("❌ Google Authentication Failed");
});

// ---------------------- AUTH MIDDLEWARE ----------------------
const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No token provided" });

    const token = header.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ---------------------- PRODUCT ROUTES ----------------------
app.post("/createProduct", (req, res) => {
  ProductModel.create(req.body)
    .then((product) => res.json(product))
    .catch((err) => res.status(500).json(err));
});

app.get("/getProducts", (req, res) => {
  ProductModel.find({})
    .then((products) => res.json(products))
    .catch((err) => res.status(500).json(err));
});

app.get("/getProduct/:id", (req, res) => {
  ProductModel.findById(req.params.id)
    .then((product) => res.json(product))
    .catch((err) => res.status(500).json(err));
});

// ---------------------- CATEGORY ROUTES ----------------------
app.post("/createCategory", async (req, res) => {
  try {
    const category = await CategoryModel.create(req.body);
    res.json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/getCategories", async (req, res) => {
  try {
    const categories = await CategoryModel.find({});
    res.json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ---------------------- USER AUTH ----------------------
app.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, phone, password: hashedPassword });
    res.json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ message: "Login successful", token, user });
  } catch (err) {
  console.error("Login Error:", err);
  res.status(500).json({ message: "Server error", error: err.message });
}

});

// ---------------------- CART ROUTES ----------------------

// Add item to cart
app.post("/addToCart", async (req, res) => {
  try {
    const { user, productId, name, price, image } = req.body;

    if (!user || !productId) {
      return res.status(400).json({ message: "Missing user or product ID" });
    }

    let cart = await CartModel.findOne({ user });

    if (!cart) {
      cart = new CartModel({
        user,
        items: [{ product: productId, name, price, image, quantity: 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ product: productId, name, price, image, quantity: 1 });
      }
    }

    await cart.save();
    res.json({ message: "Item added to cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding to cart", error: err.message });
  }
});

// Get cart for a user
app.get("/getCart/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const cart = await CartModel.findOne({ user: username });
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ items: [], message: "Error fetching cart", error: err.message });
  }
});


app.put("/updateCart/:user/:cartItemId", async (req, res) => {
  try {
    const { user, cartItemId } = req.params;
    const { quantity } = req.body;

    const cart = await CartModel.findOne({ user });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(cartItemId); // use subdocument _id
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    item.quantity = quantity;
    await cart.save();

    res.json({ message: "Quantity updated", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating quantity", error: err.message });
  }
});

// Remove item from cart
app.delete("/removeFromCart/:user/:cartItemId", async (req, res) => {
  try {
    const { user, cartItemId } = req.params;

    const cart = await CartModel.findOne({ user });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item._id.toString() !== cartItemId);

    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cart.save();
    res.json({ message: "Item removed from cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error removing from cart", error: err.message });
  }
});


// Clear entire cart
app.delete("/clearCart/:user", async (req, res) => {
  try {
    const { user } = req.params;
    const cart = await CartModel.findOne({ user });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();
    res.json({ message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ message: "Error clearing cart", error: err.message });
  }
});

// Add item to wishlist
app.post("/addToWishlist", async (req, res) => {
  try {
    const { user, productId, name, price, image } = req.body;
    if (!user || !productId)
      return res.status(400).json({ message: "Missing user or product ID" });

    let wishlist = await WishlistModel.findOne({ user });

    if (!wishlist) {
      wishlist = new WishlistModel({
        user,
        items: [{ product: productId, name, price, image }],
      });
    } else {
      const exists = wishlist.items.find(
        (item) => item.product.toString() === productId
      );
      if (exists) {
        return res.json({ message: "Already in wishlist", wishlist });
      } else {
        wishlist.items.push({ product: productId, name, price, image });
      }
    }

    await wishlist.save();
    res.json({ message: "Added to wishlist", wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding to wishlist", error: err.message });
  }
});

// Get wishlist for user
app.get("/getWishlist/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const wishlist = await WishlistModel.findOne({ user: username });
    if (!wishlist) return res.json({ items: [] });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Error fetching wishlist", error: err.message });
  }
});

// Remove item from wishlist
app.delete("/removeFromWishlist/:user/:productId", async (req, res) => {
  try {
    const { user, productId } = req.params;
    const wishlist = await WishlistModel.findOne({ user });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );

    await wishlist.save();
    res.json({ message: "Item removed from wishlist", wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error removing item", error: err.message });
  }
});

// ---------------------- ORDER ROUTES ----------------------

// Create new order from cart
app.post("/createOrder", async (req, res) => {
  try {
    const { user, items, totalAmount, address, phone, paymentMethod } = req.body;

    if (!user || !items || items.length === 0)
      return res.status(400).json({ message: "Invalid order data" });

    const newOrder = await OrderModel.create({
      user,
      items,
      totalAmount,
      address,
      phone,
      paymentMethod,
    });

    // Clear user's cart after order is placed
    await CartModel.findOneAndUpdate({ user }, { items: [] });

    res.json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Error creating order", error: err.message });
  }
});

// Get all orders for a user
app.get("/getOrders/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const orders = await OrderModel.find({ user: username }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
});

// Get single order by ID
app.get("/getOrder/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order", error: err.message });
  }
});

// Update order status (for admin use)
app.put("/updateOrderStatus/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.json({ message: "Order status updated", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "Error updating order", error: err.message });
  }
});

// Get all orders (for admin)
app.get("/getAllOrders", async (req, res) => {
  try {
    const orders = await OrderModel.find({}).sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ message: "Error fetching all orders", error: err.message });
  }
});

app.get("/getUser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
});


app.delete("/deleteUser/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err });
  }
});

// ---------------------- GLOBAL ERROR HANDLER ----------------------
app.use((err, req, res, next) => {
  console.error("🔥 Uncaught Error:", err);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

// ---------------------- SERVER ----------------------
app.listen(3001, () => console.log("🚀 Server running on http://localhost:3001"));
