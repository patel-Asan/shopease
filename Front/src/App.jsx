import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

import Footer from "./components/Footer.jsx";
import Newsletter from "./components/Newsletter.jsx";
import WhatsAppCorner from "./components/WhatsAppCorner.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";

import Success from "./pages/Success.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Cart from "./pages/Cart.jsx";
import Favourites from "./pages/Favourites.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { AuthContext } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Checkout from "./pages/Checkout.jsx";
import ProfileAddresses from "./pages/Profile.jsx";
import Contact from "./pages/Contact.jsx";
import DeliveryDashboard from "./pages/DeliveryDashboard.jsx";
import TrendingProducts from "./components/TrendingProducts .jsx";
import LandingPage from "./pages/LandingPage.jsx";

function AppContent() {
  const { user } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isHomePage = location.pathname === "/";

  const styles = {
    app: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    mainContent: {
      flex: 1,
      padding: isMobile ? "0" : "0",
      marginTop: user?.role === "user" && isMobile ? "60px" : "0",
    },
    toastContainer: {
      position: "fixed",
      top: isMobile ? "10px" : "20px",
      right: isMobile ? "10px" : "20px",
      left: isMobile ? "10px" : "auto",
      width: isMobile ? "calc(100% - 20px)" : "auto",
      zIndex: 9999,
    },
    footerSection: {
      marginTop: "auto",
    },
    homeFooter: {
      width: "100%",
    },
    otherFooter: {
      width: "100%",
    },
  };

  const showFooter = user?.role === "user";
  const showWhatsApp = user?.role === "user";
  const showNavbar = user?.role === "user";

  return (
    <div style={styles.app}>
      {showNavbar && <Navbar />}
      {showWhatsApp && <WhatsAppCorner />}

      <main style={styles.mainContent}>
        <Routes>
          {!user ? (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : user.role === "admin" ? (
            <>
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </>
          ) : user.role === "delivery" ? (
            <>
              <Route path="/delivery/*" element={<DeliveryDashboard />} />
              <Route path="*" element={<Navigate to="/delivery" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/favourites" element={<ProtectedRoute><Favourites /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
              <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfileAddresses /></ProtectedRoute>} />
              <Route path="/profile/addresses" element={<ProtectedRoute><ProfileAddresses /></ProtectedRoute>} />
              <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </main>

      {showFooter && (
        <div style={styles.footerSection}>
          {isHomePage ? (
            <div style={styles.homeFooter}>
              <TrendingProducts />
              <Newsletter />
              <Footer />
            </div>
          ) : (
            <div style={styles.otherFooter}>
              <Footer />
            </div>
          )}
        </div>
      )}

      <div style={styles.toastContainer}>
        <ToastContainer 
          position={isMobile ? "top-center" : "top-right"} 
          autoClose={3000}
          toastStyle={{
            fontSize: isMobile ? "14px" : "16px",
            padding: isMobile ? "12px" : "16px",
            margin: isMobile ? "5px" : "10px",
            borderRadius: "8px",
            width: isMobile ? "100%" : "auto",
            maxWidth: isMobile ? "100%" : "400px",
          }}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
}

export default App;
