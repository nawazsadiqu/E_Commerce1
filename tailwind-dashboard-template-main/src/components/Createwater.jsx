import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Createwater = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("")
  const [flavor, setFlavor] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdown, setdropdown] = useState([])

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
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dddgh3mek/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Cloudinary response:", data);
      setImage(data.secure_url); 
      setLoading(false);
    } catch (err) {
      console.error("Image upload failed", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    axios.get("https://e-commerce-03kf.onrender.com/getCategories")
    .then(result => setdropdown(result.data))
    .catch(err => console.log(err)
    )
  }, [])
  console.log(dropdown);
  
  

  const submit1 = (e) => {
    e.preventDefault()
    axios.post("https://e-commerce-03kf.onrender.com/createProduct", { 
      name, category, flavor, price, description, image 
    }) 
      .then(result => {
        console.log(result)
        navigate("/water")  
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create new Popsicle
        </h2>
        <form onSubmit={submit1} className="space-y-4">
          
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter ice name"
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-violet-300"
            />
          </div>

          <div>
          <label className="block text-gray-700 font-medium mb-1">
            Category
           </label>
          <select
           value={category}
           onChange={(e) => setCategory(e.target.value)}
            required
             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-violet-300"
          >
          <option value="" disabled>Select a category</option>
          {dropdown.map((item)=>{
            return(
          <option key={item._id}  value={item.name}>{item.name}</option>
        )
          })}


          
          </select>
        </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Flavor
            </label>
            <input
              type="text"
              placeholder="Enter flavor"
              onChange={(e) => setFlavor(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-violet-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              placeholder="Enter price"
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-violet-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter description"
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-violet-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            {loading && <p className="text-sm text-gray-500">Uploading...</p>}
            {image && (
              <img src={image} alt="Preview" className="mt-2 w-32 rounded-lg" />
            )}
          </div>

          <button 
            type="submit" 
            className="w-full bg-violet-600 text-white py-2 rounded-lg font-medium hover:bg-violet-700 transition"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Createwater;
