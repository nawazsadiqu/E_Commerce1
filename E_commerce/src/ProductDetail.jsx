import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BsHeart, BsHeartFill } from "react-icons/bs"; 

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    axios
      .get(`https://e-commerce-03kf.onrender.com/getProduct/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!product) return <p className="text-center mt-5">Product not found</p>;

  const handleAddToCart = async () => {
    const user = localStorage.getItem("userName");
    if (!user) return alert("⚠ Please login first");

    try {
      const res = await axios.post("https://e-commerce-03kf.onrender.com/addToCart", {
        user,
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      });

      if (res.status === 200) {
        alert("✅ Item added to cart!");
      }
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to add item to cart. Make sure you're logged in."
      );
    }
  };

  const handleWishlist = async () => {
    const user = localStorage.getItem("userName");
    if (!user) return alert("⚠ Please login first");

    try {
      if (!wishlist) {
        const res = await axios.post("https://e-commerce-03kf.onrender.com/addToWishlist", {
          user,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
        });
        if (res.status === 200) alert("💖 Added to wishlist!");
      } else {
        await axios.delete(
          `https://e-commerce-03kf.onrender.com/removeFromWishlist/${user}/${product._id}`
        );
        alert("💔 Removed from wishlist!");
      }
      setWishlist(!wishlist);
    } catch (err) {
      console.error(err);
      alert("❌ Error updating wishlist");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center "style={{marginTop:"160px"}}>
        <div className="col-md-4">
          <img
            src={product.image || "/images/placeholder.png"}
            alt={product.name}
            className="img-fluid rounded shadow"
            style={{
              height: "450px",
              objectFit: "cover",
              marginTop: "-100px",
              marginBottom: "50px",
            }}
          />
        </div>

        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">{product.description || "No description"}</p>
          <h4 className="fw-bold mb-3">₹{product.price}</h4>

          
          <div className="d-flex align-items-center gap-3 mt-3">
            
            <span
              onClick={handleWishlist}
              style={{
                cursor: "pointer",
                color: wishlist ? "red" : "gray",
                fontSize: "28px",
                transition: "0.3s",
              }}
            >
              {wishlist ? <BsHeartFill /> : <BsHeart />}
            </span>

            <button
              className="btn btn-dark btn-lg rounded-pill"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
