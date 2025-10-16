import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsHeart, BsHeartFill, BsCart } from "react-icons/bs";

const Fourth = () => {
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/getProducts");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchWishlist = async () => {
    const user = localStorage.getItem("userName");
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:3001/getWishlist/${user}`);
      setWishlistItems(res.data.items.map((i) => i.product));
    } catch (err) {
      console.error(err);
    }
  };

  const popularProducts = products.filter(
    (product) => product.category?.toLowerCase() === "popular"
  );

  const handleAddToCart = async (product) => {
    const user = localStorage.getItem("userName");
    if (!user) return alert("⚠ Please login first");

    try {
      await axios.post("http://localhost:3001/addToCart", {
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
          `http://localhost:3001/removeFromWishlist/${user}/${product._id}`
        );
        setWishlistItems(wishlistItems.filter((id) => id !== product._id));
        alert("💔 Removed from wishlist!");
      } else {
        await axios.post("http://localhost:3001/addToWishlist", {
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
    <div style={{ borderBottom: "1px solid #000000ff", height: "100vh", marginTop: "110px" }}>
      <Container className="mt-5">
        <h1 className="text-center fw-bold mb-3">Popular Products</h1>
        <Row className="justify-content-center">
          {popularProducts.length === 0 ? (
            <p className="text-center text-muted">No popular products available.</p>
          ) : (
            popularProducts.map((product) => (
              <Col key={product._id} md={3} sm={6} className="mb-4">
                <Card
                  className="shadow-lg border-0 rounded-4 h-100 card-hover"
                  style={{ cursor: "pointer",marginTop:"60px" ,minHeight:"350px" ,maxHeight:"350px" }}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <Card.Img
                    variant="top"
                    src={product.image || "/images/placeholder.png"}
                    className="object-fit-cover"
                    style={{ height: "180px" }}
                  />
                  <Card.Body className="text-center d-flex flex-column">
                    <Card.Title>{product.name}</Card.Title>
                    <h5 className="fw-bold mb-3"style={{marginTop:"20px"}}>₹{product.price}</h5>

                    <div className="d-flex justify-content-center align-items-center gap-3 mt-auto"style={{marginBottom:"45px"}}>
                      <span
                        style={{ cursor: "pointer", fontSize: "22px" }}
                        onClick={(e) => {
                          e.stopPropagation(); // prevent card click from triggering navigation
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
                          e.stopPropagation(); // prevent card click from triggering navigation
                          handleAddToCart(product);
                        }}
                      >
                        <BsCart />
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Fourth;
