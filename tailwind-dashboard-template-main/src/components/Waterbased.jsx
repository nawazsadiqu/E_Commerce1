import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Waterbased = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = () => {
    axios
      .get("https://e-commerce-03kf.onrender.com/getProducts")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`https://e-commerce-03kf.onrender.com/deleteProduct/${id}`);
        fetchProducts(); 
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  
  const handleEdit = (id) => {
    navigate(`/editProduct/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Water Based Popsicles
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-gray-700 font-medium">Name</th>
                <th className="px-4 py-3 text-gray-700 font-medium">Category</th>
                <th className="px-4 py-3 text-gray-700 font-medium">Flavor</th>
                <th className="px-4 py-3 text-gray-700 font-medium">Price (₹)</th>
                <th className="px-4 py-3 text-gray-700 font-medium">Description</th>
                <th className="px-4 py-3 text-gray-700 font-medium">Image</th>
                <th className="px-4 py-3 text-gray-700 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-gray-800">{item.category}</td>
                  <td className="px-4 py-3 text-gray-800">{item.flavor}</td>
                  <td className="px-4 py-3 text-gray-800 font-bold">
                    ₹{item.price}
                  </td>
                  <td className="px-4 py-3 text-gray-800">{item.description}</td>
                  <td className="px-4 py-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Waterbased;
