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

// Admin
import { AdminAuthProvider } from "./admin/AdminAuthContext";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminSubmissions from "./admin/pages/AdminSubmissions";
import AdminFinancialAid from "./admin/pages/AdminFinancialAid";
import AdminRetreats from "./admin/pages/AdminRetreats";
import AdminPrograms from "./admin/pages/AdminPrograms";
import AdminContent from "./admin/pages/AdminContent";
import AdminShop from "./admin/pages/AdminShop";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminNewsletter from "./admin/pages/AdminNewsletter";

import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function GlobalCart() {
  const { isCartOpen, setIsCartOpen } = useCart();
  return <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />;
}

function PublicShell({ children }) {
  return (
    <CartProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <GlobalCart />
    </CartProvider>
  );
}

function App() {
  return (
    <div className="App min-h-screen bg-[#FBFBF9]">
      <BrowserRouter>
        <ScrollToTop />
        <AdminAuthProvider>
          <Routes>
            {/* Admin routes — no public navbar/footer */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="submissions" element={<AdminSubmissions />} />
              <Route path="financial-aid" element={<AdminFinancialAid />} />
              <Route path="retreats" element={<AdminRetreats />} />
              <Route path="programs" element={<AdminPrograms />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="shop" element={<AdminShop />} />
              <Route path="newsletter" element={<AdminNewsletter />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Public routes — with navbar/footer */}
            <Route path="/" element={<PublicShell><HomePage /></PublicShell>} />
            <Route path="/coaching" element={<PublicShell><CoachingPage /></PublicShell>} />
            <Route path="/programs" element={<PublicShell><TrainingProgramsPage /></PublicShell>} />
            <Route path="/programs/:programId" element={<PublicShell><TrainingProgramsPage /></PublicShell>} />
            <Route path="/retreats" element={<PublicShell><RetreatsPage /></PublicShell>} />
            <Route path="/retreats/:retreatId" element={<PublicShell><RetreatDetailPage /></PublicShell>} />
            <Route path="/about" element={<PublicShell><AboutPage /></PublicShell>} />
            <Route path="/contact" element={<PublicShell><ContactPage /></PublicShell>} />
            <Route path="/shop" element={<PublicShell><ShopPage /></PublicShell>} />
            <Route path="/shop/:productId" element={<PublicShell><ProductDetailPage /></PublicShell>} />
          </Routes>
        </AdminAuthProvider>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </div>
  );
}

export default App;
