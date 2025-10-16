import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navibar from "./Navibar";
import Footer from "./Footer";
import Second from "./Second";
import Third from "./Third";
import Categoriess from "./Categoriess"; 
import CategoryDetail from "./CategoryDetail"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Fourth from "./Fourth";
import Banner from "./Banner";
import Shop from "./Shop";
import ProductDetail from "./ProductDetail";
import Login from "./Login";
import Register from "./Register";
import Cart from "./Cart";
import Wishlist from "./Wishlist";
import Profile from "./Profile";
import SuccessPage from "./SuccessPage";




const App = () => {
  return (
    <Router>
      <div>
        <Navibar />
        
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Banner />
                <Second />
                <Categoriess />
                <Third />
                <Fourth />
              </>
            }
          />
        <Route path="/shop" element={<Shop />}    />
         <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category/:categoryName" element={<CategoryDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/success" element={<SuccessPage />} />

        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
