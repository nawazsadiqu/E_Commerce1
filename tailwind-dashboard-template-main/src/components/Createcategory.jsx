import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Createcategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "prooducts"); 
    formData.append("cloud_name", "dddgh3mek"); 

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dddgh3mek/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setImage(data.secure_url);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/createCategory", { name, description, image })
      .then((e) =>{
        console.log(e);
        
 navigate("/category")
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">Create Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input type="file" onChange={handleImageUpload} className="w-full p-2 border rounded" />
          {image && <img src={image} alt="Preview" className="w-32 mt-2 rounded" />}
          <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 rounded">
            {loading ? "Uploading..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Createcategory;
