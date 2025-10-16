import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsHeart, BsHeartFill, BsCart, BsEye } from "react-icons/bs";
import './Css/Shop.css'

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://e-commerce-03kf.onrender.com/getProducts");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWishlist = async () => {
    const user = localStorage.getItem("userName");
    if (!user) return;
    try {
      const res = await axios.get(`https://e-commerce-03kf.onrender.com/getWishlist/${user}`);
      setWishlistItems(res.data.items.map((i) => i.product));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (product) => {
    const user = localStorage.getItem("userName");
    if (!user) return alert("⚠ Please login first");

    try {
      await axios.post("https://e-commerce-03kf.onrender.com/addToCart", {
        user,
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      alert("✅ Item added to cart!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add item to cart");
    }
  };

  const handleWishlist = async (product) => {
    const user = localStorage.getItem("userName");
    if (!user) return alert("⚠ Please login first");

    try {
      if (wishlistItems.includes(product._id)) {
        await axios.delete(
          `https://e-commerce-03kf.onrender.com/removeFromWishlist/${user}/${product._id}`
        );
        setWishlistItems(wishlistItems.filter((id) => id !== product._id));
        alert("💔 Removed from wishlist!");
      } else {
        await axios.post("https://e-commerce-03kf.onrender.com/addToWishlist", {
          user,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
        });
        setWishlistItems([...wishlistItems, product._id]);
        alert("💖 Added to wishlist!");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error updating wishlist");
    }
  };

  return (
    <div className="container "style={{marginTop:"90px"}}>
      <h2 className="text-center mb-4">Shop</h2>
      <div className="row mt-5">
        {products.map((product) => (
          <div key={product._id} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-4">
            <div
              className="card-container"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="card shadow-sm rounded-3 h-100">
  <div className="card-img-wrapper">
    <img
      src={product.image || "/images/placeholder.png"}
      className="card-img-top"
      alt={product.name}
      style={{ height: "140px", objectFit: "cover" }}
    />
    <div className="overlay">
      <BsEye className="eye-icon" />
    </div>
  </div>

  <div className="card-body text-center d-flex flex-column p-2">
    <h6 className="small fw-bold">{product.name}</h6>
    <h6 className="fw-bold mb-2" style={{ fontSize: "0.9rem" }}>
      ₹{product.price}
    </h6>

    <div className="d-flex justify-content-center align-items-center gap-2 mt-auto">
      <span
        style={{ cursor: "pointer", fontSize: "22px" }}
        onClick={(e) => {
          e.stopPropagation();
          handleWishlist(product);
        }}
      >
        {wishlistItems.includes(product._id) ? (
          <BsHeartFill color="red" />
        ) : (
          <BsHeart />
        )}
      </span>

      <span
        style={{ cursor: "pointer", fontSize: "22px" }}
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCart(product);
        }}
      >
        <BsCart />
      </span>
    </div>
  </div>
</div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
