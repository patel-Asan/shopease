
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
 
function Success() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
 
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
 
  const styles = {
    container: {
      textAlign: "center",
      marginTop: isMobile ? "2rem" : "4rem",
      padding: isMobile ? "1rem" : "2rem",
    },
    title: {
      fontSize: isMobile ? "1.5rem" : "2rem",
      marginBottom: "1rem",
    },
    message: {
      fontSize: isMobile ? "1rem" : "1.1rem",
      marginBottom: "2rem",
      color: "#666",
    },
    button: {
      padding: isMobile ? "0.8rem 1.5rem" : "0.75rem 2rem",
      backgroundColor: "#0d6efd",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: isMobile ? "1rem" : "1rem",
      transition: "all 0.2s",
    },
  };
 
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎉 Your order has been placed!</h2>
      <p style={styles.message}>Thank you for shopping with us.</p>
      <button
        onClick={() => navigate("/orders")}
        style={styles.button}
        onMouseEnter={(e) => {
          if (!isMobile) {
            e.currentTarget.style.backgroundColor = "#0b5ed7";
            e.currentTarget.style.transform = "scale(1.05)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isMobile) {
            e.currentTarget.style.backgroundColor = "#0d6efd";
            e.currentTarget.style.transform = "scale(1)";
          }
        }}
      >
        View My Orders
      </button>
    </div>
  );
}
 
export default Success;
 