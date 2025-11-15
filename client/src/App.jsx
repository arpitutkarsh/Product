import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import BrokenLink from "./pages/BrokenLink.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages with Navbar + Footer */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home  />
              <Footer />
            </>
          }
        />
        <Route
          path="/product/:id"
          element={
            <>
              <Navbar />
              <ProductDetail />
              <Footer />
            </>
          }
        />

        {/* Broken Link page without Navbar/Footer */}
        <Route path="*" element={<BrokenLink />} />
      </Routes>
    </Router>
  );
}

export default App;
