import React, { useEffect, useState, useContext, useRef } from "react";
import { getImageUrl } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { FaShoppingBag, FaTrash, FaArrowRight } from "react-icons/fa";

export default function Cart() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [updatingItems, setUpdatingItems] = useState([]);
  
  const { cart, loading, removeFromCart, updateQuantity } = useContext(CartContext);
 
  const removingRef = useRef({});
  const updatingRef = useRef({});

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleRemoveItem = async (item) => {
    const productId = item.product?._id;
    if (!productId) return;
 
    if (removingRef.current[productId]) return;
    removingRef.current[productId] = true;
 
    try {
      await removeFromCart(productId);
      toast.success("Item removed from cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    } finally {
      removingRef.current[productId] = false;
    }
  };
 
  const handleUpdateQuantity = async (item, newQuantity) => {
    const productId = item.product?._id;
    if (!productId) return;
    
    if (newQuantity < 1) return;
    
    if (updatingRef.current[productId]) return;
    updatingRef.current[productId] = true;
    
    setUpdatingItems(prev => [...prev, productId]);
    
    try {
      await updateQuantity(productId, newQuantity);
    } catch (err) {
      console.error(err);
    } finally {
      updatingRef.current[productId] = false;
      setUpdatingItems(prev => prev.filter(id => id !== productId));
    }
  };
 
  const total = cart?.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
    0
  ) || 0;

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "0 auto",
      padding: isMobile ? "1.5rem 1rem" : "3rem 2rem",
      minHeight: "100vh",
      position: "relative",
    },
    bgOrb1: {
      position: "fixed",
      top: "-200px",
      right: "-200px",
      width: "500px",
      height: "500px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(201, 169, 98, 0.15) 0%, transparent 70%)",
      pointerEvents: "none",
      zIndex: 0,
    },
    bgOrb2: {
      position: "fixed",
      bottom: "-200px",
      left: "-200px",
      width: "600px",
      height: "600px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(201, 169, 98, 0.1) 0%, transparent 70%)",
      pointerEvents: "none",
      zIndex: 0,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      position: "relative",
      zIndex: 1,
    },
    title: {
      fontSize: isMobile ? "1.8rem" : "2.5rem",
      fontWeight: "800",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      margin: 0,
    },
    themeToggle: {
      padding: "10px 16px",
      borderRadius: "12px",
      border: "1px solid rgba(201, 169, 98, 0.3)",
      background: "rgba(201, 169, 98, 0.1)",
      color: "#c9a962",
      cursor: "pointer",
      fontSize: "1.1rem",
      transition: "all 0.3s ease",
    },
    cartItem: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "stretch" : "center",
      padding: isMobile ? "1.25rem" : "1.5rem",
      borderRadius: "20px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      marginBottom: "1rem",
      background: isDarkMode ? "rgba(30, 30, 40, 0.9)" : "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(201, 169, 98, 0.15)",
      transition: "all 0.3s ease",
      gap: isMobile ? "1rem" : "1.5rem",
      position: "relative",
      zIndex: 1,
    },
    imageContainer: {
      width: isMobile ? "100%" : "120px",
      height: isMobile ? "180px" : "120px",
      flexShrink: 0,
      borderRadius: "16px",
      overflow: "hidden",
      background: "rgba(201, 169, 98, 0.1)",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    itemDetails: {
      flex: 1,
      width: isMobile ? "100%" : "auto",
    },
    itemName: {
      margin: "0 0 0.5rem 0",
      fontSize: isMobile ? "1.2rem" : "1.1rem",
      fontWeight: "600",
      color: isDarkMode ? "#e8d5a3" : "#1e293b",
    },
    price: {
      margin: "0.2rem 0",
      fontSize: isMobile ? "1rem" : "0.95rem",
      color: isDarkMode ? "#a0a0a0" : "#64748b",
    },
    quantityControl: {
      display: "flex",
      alignItems: "center",
      margin: "0.75rem 0",
      gap: "0.5rem",
    },
    quantityBtn: {
      width: "36px",
      height: "36px",
      cursor: "pointer",
      border: "1px solid rgba(201, 169, 98, 0.3)",
      borderRadius: "10px",
      background: "rgba(201, 169, 98, 0.1)",
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#c9a962",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    quantityInput: {
      width: "50px",
      padding: "8px",
      textAlign: "center",
      border: "1px solid rgba(201, 169, 98, 0.3)",
      borderRadius: "10px",
      fontSize: "1rem",
      fontWeight: "500",
      outline: "none",
      background: "rgba(201, 169, 98, 0.05)",
      color: isDarkMode ? "#e8d5a3" : "#1e293b",
    },
    subtotal: {
      fontWeight: "700",
      marginTop: "0.5rem",
      fontSize: "1.1rem",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    removeBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: isMobile ? "12px 20px" : "10px 16px",
      background: "rgba(239, 68, 68, 0.1)",
      color: "#ef4444",
      border: "1px solid rgba(239, 68, 68, 0.2)",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "0.9rem",
      fontWeight: "600",
      minWidth: isMobile ? "100%" : "auto",
    },
    totalContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "2rem",
      padding: "1.5rem 2rem",
      background: isDarkMode ? "rgba(30, 30, 40, 0.9)" : "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "20px",
      border: "1px solid rgba(201, 169, 98, 0.2)",
      position: "relative",
      zIndex: 1,
      flexWrap: "wrap",
      gap: "1rem",
    },
    total: {
      fontSize: isMobile ? "1.6rem" : "2rem",
      fontWeight: "800",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      margin: 0,
    },
    checkoutBtn: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      color: "#000",
      padding: isMobile ? "1rem 2rem" : "0.875rem 2rem",
      border: "none",
      borderRadius: "14px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "700",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 20px rgba(201, 169, 98, 0.4)",
    },
    loadingContainer: {
      textAlign: "center",
      marginTop: "4rem",
      position: "relative",
      zIndex: 1,
    },
    emptyCart: {
      textAlign: "center",
      marginTop: "6rem",
      position: "relative",
      zIndex: 1,
    },
    emptyIcon: {
      fontSize: "4rem",
      color: "rgba(201, 169, 98, 0.3)",
      marginBottom: "1.5rem",
    },
    emptyText: {
      fontSize: isMobile ? "1.3rem" : "1.5rem",
      color: isDarkMode ? "#a0a0a0" : "#64748b",
      marginBottom: "2rem",
    },
    browseBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      color: "#000",
      padding: "1rem 2.5rem",
      border: "none",
      borderRadius: "14px",
      cursor: "pointer",
      fontSize: "1.1rem",
      fontWeight: "700",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 20px rgba(201, 169, 98, 0.4)",
    },
    spinner: {
      width: "50px",
      height: "50px",
      border: "4px solid rgba(201, 169, 98, 0.2)",
      borderTop: "4px solid #c9a962",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto 1.5rem",
    },
  };
 
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.bgOrb1} />
        <div style={styles.bgOrb2} />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={{ color: isDarkMode ? "#a0a0a0" : "#64748b" }}>Loading your cart...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
 
  if (!cart?.length) {
    return (
      <div style={styles.container}>
        <div style={styles.bgOrb1} />
        <div style={styles.bgOrb2} />
        <div style={styles.emptyCart}>
          <FaShoppingBag style={styles.emptyIcon} />
          <p style={styles.emptyText}>Your cart is empty</p>
          <button
            onClick={() => navigate("/products")}
            style={styles.browseBtn}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 25px rgba(201, 169, 98, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 20px rgba(201, 169, 98, 0.4)";
            }}
          >
            Browse Products <FaArrowRight />
          </button>
        </div>
      </div>
    );
  }
 
  return (
    <div style={styles.container}>
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />
      
      <div style={styles.header}>
        <h2 style={styles.title}>
          <FaShoppingBag style={{ marginRight: "12px" }} />
          Shopping Cart
        </h2>
      </div>
      
      {cart.map(item => {
        const productId = item.product?._id;
        const isUpdating = updatingItems.includes(productId);
        
        return (
          <div 
            key={item._id} 
            style={styles.cartItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(201, 169, 98, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
            }}
          >
            <div style={styles.imageContainer}>
              <img
                src={item.product?.img ? getImageUrl(item.product.img) : "/default-image.jpg"}
                alt={item.product?.name || "Product"}
                style={styles.image}
              />
            </div>
            
            <div style={styles.itemDetails}>
              <h4 style={styles.itemName}>{item.product?.name || "Unknown Product"}</h4>
              <p style={styles.price}>₹{item.product?.price?.toLocaleString() || 0}</p>
              
              <div style={styles.quantityControl}>
                <button 
                  onClick={() => handleUpdateQuantity(item, item.quantity - 1)} 
                  disabled={item.quantity <= 1 || isUpdating} 
                  style={{
                    ...styles.quantityBtn,
                    opacity: item.quantity <= 1 || isUpdating ? 0.5 : 1,
                    cursor: item.quantity <= 1 || isUpdating ? "not-allowed" : "pointer",
                  }}
                >
                  -
                </button>
                
                <input 
                  type="text" 
                  value={item.quantity} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      handleUpdateQuantity(item, val);
                    }
                  }} 
                  style={styles.quantityInput}
                  disabled={isUpdating}
                />
                
                <button 
                  onClick={() => handleUpdateQuantity(item, item.quantity + 1)} 
                  disabled={isUpdating}
                  style={{
                    ...styles.quantityBtn,
                    opacity: isUpdating ? 0.5 : 1,
                    cursor: isUpdating ? "not-allowed" : "pointer",
                  }}
                >
                  +
                </button>
                
                {isUpdating && (
                  <span style={{ marginLeft: "10px", color: "#c9a962", fontSize: "14px" }}>
                    Updating...
                  </span>
                )}
              </div>
              
              <p style={styles.subtotal}>
                ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
              </p>
            </div>
            
            <button 
              onClick={() => handleRemoveItem(item)} 
              style={styles.removeBtn}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(239, 68, 68, 0.2)";
                e.target.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(239, 68, 68, 0.1)";
                e.target.style.transform = "scale(1)";
              }}
            >
              <FaTrash /> {!isMobile && "Remove"}
            </button>
          </div>
        );
      })}
      
      <div style={styles.totalContainer}>
        <h3 style={styles.total}>Total: ₹{total.toLocaleString()}</h3>
        
        <button 
          onClick={() => navigate("/checkout")} 
          style={styles.checkoutBtn}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "0 8px 30px rgba(201, 169, 98, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 20px rgba(201, 169, 98, 0.4)";
          }}
        >
          Checkout <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
