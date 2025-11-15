import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/authContext.jsx";
import Login from "./Pages/Login.jsx";
import Home from "./Pages/Home.jsx";
import AddProduct from "./Pages/AddProduct.jsx";
import AddCategory from "./Pages/AddCategory.jsx";
import Register from "./Pages/Register.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
