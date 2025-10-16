import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = () => {
    axios.get("https://e-commerce-03kf.onrender.com/getCategories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Delete this category?")) {
      axios.delete(`https://e-commerce-03kf.onrender.com/deleteCategory/${id}`)
        .then(() => fetchCategories())
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-6">Categories</h2>
      <button onClick={() => navigate("/tailwind-dashboard-template-main/src/components/Createcategory.jsx")} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
        Add Category
      </button>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id} className="border-t">
              <td className="px-4 py-3">{cat.name}</td>
              <td className="px-4 py-3">{cat.description || "-"}</td>
              <td className="px-4 py-3">{cat.image ? <img src={cat.image} alt={cat.name} className="w-16 h-16 rounded" /> : "-"}</td>
              <td className="px-4 py-3 flex space-x-2">
                <button onClick={() => navigate(`/edit-category/${cat._id}`)} className="bg-green-500 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(cat._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Category;
