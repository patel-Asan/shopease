
 
import React, { useEffect, useState } from "react";
import { getCart, addToCart, removeFromCart, getImageUrl } from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
 
export default function Cart() {
  const [cart, setCart] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
 
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getCart();
      setCart(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };
 
  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success("Item removed from cart");
      fetchCart();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };
 
  const handleQuantityChange = async (productId, qty) => {
    if (qty < 1) return;
    try {
      await addToCart(productId, qty);
      fetchCart();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quantity");
    }
  };
 
  useEffect(() => {
    fetchCart();
  }, []);
 
  const total = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
 
  const styles = {
    container: {
      maxWidth: isMobile ? "100%" : "700px",
      margin: isMobile ? "1rem auto" : "2rem auto",
      padding: isMobile ? "0.5rem" : "1rem",
    },
    title: {
      marginBottom: "1.5rem",
      fontSize: isMobile ? "1.5rem" : "2rem",
      textAlign: "center",
    },
    cartItem: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center",
      justifyContent: "space-between",
      padding: isMobile ? "1rem" : "1rem",
      border: "1px solid #ddd",
      borderRadius: "12px",
      marginBottom: "1rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      transition: "all 0.2s ease",
      backgroundColor: "#fff",
      gap: isMobile ? "1rem" : "0",
    },
    image: {
      width: isMobile ? "100%" : "80px",
      height: isMobile ? "150px" : "80px",
      objectFit: "cover",
      borderRadius: "8px",
      flexShrink: 0,
    },
    details: {
      flex: 1,
      marginLeft: isMobile ? "0" : "16px",
      width: isMobile ? "100%" : "auto",
    },
    itemName: {
      margin: 0,
      fontSize: isMobile ? "1.2rem" : "1.1rem",
    },
    description: {
      margin: "4px 0",
      color: "#495057",
      fontSize: isMobile ? "0.95rem" : "0.9rem",
    },
    price: {
      margin: "4px 0",
      fontSize: isMobile ? "1rem" : "0.95rem",
    },
    subtotal: {
      margin: "4px 0",
      fontWeight: 600,
      color: "#0d6efd",
    },
    quantityInput: {
      width: isMobile ? "80px" : "60px",
      padding: isMobile ? "8px" : "4px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: isMobile ? "1rem" : "0.95rem",
    },
    removeBtn: {
      backgroundColor: "#dc3545",
      color: "#fff",
      padding: isMobile ? "0.8rem 1rem" : "0.5rem 1rem",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s",
      width: isMobile ? "100%" : "auto",
      fontSize: isMobile ? "1rem" : "0.9rem",
    },
    totalContainer: {
      textAlign: "right",
      marginTop: "1.5rem",
      padding: isMobile ? "1rem" : "0",
      backgroundColor: isMobile ? "#f8f9fa" : "transparent",
      borderRadius: isMobile ? "8px" : "0",
    },
    total: {
      fontSize: isMobile ? "1.5rem" : "1.8rem",
      color: "#0d6efd",
    },
    emptyCart: {
      textAlign: "center",
      marginTop: isMobile ? "2rem" : "3rem",
    },
    browseBtn: {
      marginTop: "1rem",
      padding: isMobile ? "0.8rem 2rem" : "0.6rem 2rem",
      backgroundColor: "#0d6efd",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: isMobile ? "1rem" : "0.95rem",
    },
    loadingContainer: {
      textAlign: "center",
      marginTop: "3rem",
    },
    spinner: {
      width: "40px",
      height: "40px",
      border: "3px solid #f3f3f3",
      borderTop: "3px solid #0d6efd",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto 1rem",
    },
  };
 
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p>Loading cart...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
 
  if (!cart.length) {
    return (
      <div style={styles.emptyCart}>
        <h2 style={styles.title}>Your cart is empty</h2>
        <button
          onClick={() => navigate("/products")}
          style={styles.browseBtn}
        >
          Browse Products
        </button>
      </div>
    );
  }
 
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Cart</h2>
 
      {cart.map((item) => {
        if (!item.product) return null;
 
        const imgSrc = item.product.img
          ? getImageUrl(item.product.img)
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.product.name)}`;
 
        return (
          <div
            key={item.product._id}
            style={styles.cartItem}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
              }
            }}
          >
            <img
              src={imgSrc}
              alt={item.product.name}
              style={styles.image}
            />
 
            <div style={styles.details}>
              <h4 style={styles.itemName}>{item.product.name}</h4>
              <p style={styles.description}>{item.product.description}</p>
              <p style={styles.price}>Price: ₹{item.product.price}</p>
              <p style={styles.subtotal}>
                Subtotal: ₹{item.product.price * item.quantity}
              </p>
 
              <div style={{ marginTop: "0.5rem" }}>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.product._id, parseInt(e.target.value))
                  }
                  style={styles.quantityInput}
                />
              </div>
            </div>
 
            <button
              onClick={() => handleRemove(item.product._id)}
              style={styles.removeBtn}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.backgroundColor = "#c82333";
                  e.currentTarget.style.transform = "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.backgroundColor = "#dc3545";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              Remove
            </button>
          </div>
        );
      })}
 
      <div style={styles.totalContainer}>
        <h3 style={styles.total}>Total: ₹{total}</h3>
      </div>
 
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button
          onClick={() => navigate("/checkout")}
          style={{
            ...styles.browseBtn,
            backgroundColor: "#28a745",
            padding: isMobile ? "1rem 2rem" : "0.75rem 2rem",
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}