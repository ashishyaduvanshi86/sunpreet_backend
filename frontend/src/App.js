import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import HomePage from "./pages/HomePage";
import CoachingPage from "./pages/CoachingPage";
import TrainingProgramsPage from "./pages/TrainingProgramsPage";
import RetreatsPage from "./pages/RetreatsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import RetreatDetailPage from "./pages/RetreatDetailPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import { CartProvider, useCart } from "./context/CartContext";
import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function GlobalCart() {
  const { isCartOpen, setIsCartOpen } = useCart();
  return <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />;
}

function App() {
  return (
    <div className="App min-h-screen bg-[#FBFBF9]">
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/coaching" element={<CoachingPage />} />
              <Route path="/programs" element={<TrainingProgramsPage />} />
              <Route path="/retreats" element={<RetreatsPage />} />
              <Route path="/retreats/:retreatId" element={<RetreatDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/:productId" element={<ProductDetailPage />} />
            </Routes>
          </main>
          <Footer />
          <GlobalCart />
          <Toaster position="bottom-right" />
        </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;
