import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsTrash, BsCartPlus } from "react-icons/bs";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem("userName");

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:3001/getWishlist/${user}`)
      .then((res) => {
        setWishlist(res.data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching wishlist:", err);
        setLoading(false);
      });
  }, [user]);

  const handleRemove = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:3001/removeFromWishlist/${user}/${productId}`
      );
      setWishlist((prev) => prev.filter((item) => item.product !== productId));
      alert("💔 Item removed from wishlist");
    } catch (err) {
      console.error("Error removing wishlist item:", err);
      alert("❌ Failed to remove item");
    }
  };

  const handleAddToCart = async (item) => {
    try {
      const res = await axios.post("http://localhost:3001/addToCart", {
        user,
        productId: item.product,
        name: item.name,
        price: item.price,
        image: item.image,
      });
      if (res.status === 200) alert("✅ Item added to cart!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add to cart");
    }
  };

  if (!user)
    return <h4 className="text-center mt-5">⚠ Please login to view wishlist</h4>;

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  if (wishlist.length === 0)
    return <h4 className="text-center mt-5">💖 Your wishlist is empty!</h4>;

  return (
    <div className="container mt-5">
      <h2 className="text-center fw-bold mb-4">My Wishlist 💖</h2>
      <div className="row justify-content-center">
        {wishlist.map((item) => (
          <div className="col-md-3 mb-4" key={item._id}>
            <div className="card shadow-sm border-0 rounded-4">
              <img
                src={item.image || "/images/placeholder.png"}
                alt={item.name}
                className="card-img-top"
                style={{
                  height: "220px",
                  objectFit: "cover",
                  borderTopLeftRadius: "1rem",
                  borderTopRightRadius: "1rem",
                }}
              />
              <div className="card-body text-center">
                <h5 className="card-title fw-semibold">{item.name}</h5>
                <p className="text-muted mb-2">₹{item.price}</p>

                <div className="d-flex justify-content-center gap-3">
                  <button
                    className="btn btn-outline-danger rounded-pill"
                    onClick={() => handleRemove(item.product)}
                  >
                    <BsTrash />
                  </button>
                  <button
                    className="btn btn-dark rounded-pill"
                    onClick={() => handleAddToCart(item)}
                  >
                    <BsCartPlus />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
