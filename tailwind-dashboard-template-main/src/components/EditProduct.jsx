import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: "",
    category: "",
    flavor: "",
    price: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch product details
  useEffect(() => {
    axios
      .get(`http://localhost:3001/getProduct/${id}`)
      .then((res) => setProductData(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "prooducts"); // same as in Createwater
    formData.append("cloud_name", "dddgh3mek");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dddgh3mek/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setProductData((prev) => ({ ...prev, image: data.secure_url }));
      setLoading(false);
    } catch (err) {
      console.error("Image upload failed", err);
      setLoading(false);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (loading) return alert("Please wait for the image to finish uploading.");

    axios
      .put(`http://localhost:3001/updateProduct/${id}`, productData)
      .then(() => navigate("/water"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Popsicle</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          {["name", "category", "flavor"].map((field) => (
            <div key={field}>
              <label className="block font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type="text"
                name={field}
                value={productData[field]}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
          ))}

          <div>
            <label className="block font-medium">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              rows="3"
              value={productData.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium">Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {loading && <p className="text-sm text-gray-500">Uploading...</p>}
           
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 text-white py-2 rounded-lg font-medium hover:bg-violet-700 transition"
          >
            {loading ? "Uploading..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
