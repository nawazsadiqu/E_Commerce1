import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CategoryCards = () => {
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/getCategories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="w-100 py-4" style={{ maxWidth: "100vw",height:"100vh" }}>
      <h2 className="text-center mb-3 mt-5">Ice Cream Categories</h2>

      {categories.length === 0 ? (
        <p className="text-center text-muted">No categories found.</p>
      ) : (
        <div className="d-flex align-items-center w-100">
         
          <button
            onClick={scrollLeft}
            style={{
              background: "none",
              border: "none",
              fontSize: "2rem",
              color: "black",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            <FiChevronLeft />
          </button>

          
          <div
            ref={scrollRef}
            className="d-flex overflow-hidden flex-grow-1 mt-5"
            style={{
              gap: "1rem",
              width: "100%",
              objectFit: "cover",
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="card flex-shrink-0"
                style={{ width: "300px" }}
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    className="card-img-top"
                    alt={cat.name}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-secondary text-white"
                    style={{ height: "180px" }}
                  >
                    No Image
                  </div>
                )}
                <div className="card-body p-2 text-center d-flex flex-column">
                  <h6 className="card-title mb-1">{cat.name}</h6>
                  <p
                    className="card-text text-muted"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {cat.description || "No description"}
                  </p>

                  
                  <button
                    className="btn btn-sm mt-4 mx-auto"
                    style={{
                      width: "120px",
                      backgroundColor: "black",
                      color: "white",
                      border: "none",
                    }}
                    onClick={() =>
                      navigate(`/category/${cat.name.toLowerCase()}`)
                    }
                  >
                    View Products
                  </button>
                </div>
              </div>
            ))}
          </div>

          
          <button
            onClick={scrollRight}
            style={{
              background: "none",
              border: "none",
              fontSize: "2rem",
              color: "black",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryCards;
