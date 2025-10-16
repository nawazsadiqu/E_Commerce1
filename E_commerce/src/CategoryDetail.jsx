import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BsHeart, BsHeartFill, BsCart } from "react-icons/bs";

const CategoryDetail = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, [categoryName]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://e-commerce-03kf.onrender.com/getProducts");
      const filtered = res.data.filter(
        (product) =>
          product.category &&
          product.category.toLowerCase() === categoryName.toLowerCase()
      );
      setProducts(filtered);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
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

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{categoryName.toUpperCase()} Products</h2>

      {products.length === 0 ? (
        <p className="text-center text-muted">No products found in this category.</p>
      ) : (
        <div className="row justify-content-center">
          {products.map((product) => (
            <div key={product._id} className="col-md-3 col-sm-5 mb-4">
              <div
                className="card shadow-lg rounded-4 h-100"
                style={{
                  maxWidth: "260px",
                  margin: "0 auto",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onClick={() => navigate(`/product/${product._id}`)} // 👈 Entire card clickable
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <img
                  src={product.image || "/images/placeholder.png"}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body text-center d-flex flex-column">
                  <h6>{product.name}</h6>
                  
                  <h6 className="fw-bold mb-3">₹{product.price}</h6>

                  <div
                    className="d-flex justify-content-center align-items-center gap-3 mt-auto"
                    onClick={(e) => e.stopPropagation()} // 👈 prevent navigation when clicking icons
                  >
                    <span
                      style={{ cursor: "pointer", fontSize: "22px" }}
                      onClick={() => handleWishlist(product)}
                    >
                      {wishlistItems.includes(product._id) ? (
                        <BsHeartFill color="red" />
                      ) : (
                        <BsHeart />
                      )}
                    </span>

                    <span
                      style={{ cursor: "pointer", fontSize: "22px" }}
                      onClick={() => handleAddToCart(product)}
                    >
                      <BsCart />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;
