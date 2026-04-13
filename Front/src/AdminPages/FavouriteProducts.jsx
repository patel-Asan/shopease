
// src/AdminPages/FavouriteProducts.jsx
import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useTheme } from "../context/ThemeContext";

const FavouriteProducts = () => {
  const { isDarkMode } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
 
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
 
  useEffect(() => {
    const fetchTopFavourites = async () => {
      try {
        setLoading(true);
        setError("");
 
        const res = await API.get("/favourites/top");
 
        if (res.data.status === "success") {
          setProducts(res.data.data);
        } else {
          setError("Failed to fetch top favourites");
        }
      } catch (err) {
        console.error("Error fetching favourite products:", err);
        setError("Network Error or backend not running");
      } finally {
        setLoading(false);
      }
    };
 
    fetchTopFavourites();
  }, []);
 
  const getGridColumns = () => {
    if (isMobile) return "repeat(auto-fill, minmax(140px, 1fr))";
    return "repeat(auto-fill, minmax(200px, 1fr))";
  };
 
  const styles = {
    container: {
      padding: isMobile ? "15px" : "20px",
      maxWidth: "1400px",
      margin: "0 auto",
    },
    header: {
      marginBottom: isMobile ? "20px" : "30px",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
      textAlign: "center",
      fontSize: isMobile ? "1.3rem" : "2rem",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "40px",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
    },
    spinner: {
      width: "40px",
      height: "40px",
      border: `3px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#f3f3f3"}`,
      borderTop: `3px solid ${isDarkMode ? "#c9a962" : "#3498db"}`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto 15px",
    },
    errorContainer: {
      textAlign: "center",
      padding: "40px",
      color: isDarkMode ? "#f87171" : "#ef4444",
    },
    emptyContainer: {
      textAlign: "center",
      padding: "40px",
      color: isDarkMode ? "rgba(255,255,255,0.5)" : "#777",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: getGridColumns(),
      gap: isMobile ? "15px" : "24px",
      justifyContent: "center",
    },
    card: {
      background: isDarkMode ? "rgba(30, 30, 40, 0.6)" : "#ffffff",
      borderRadius: "14px",
      padding: isMobile ? "12px" : "16px",
      textAlign: "center",
      boxShadow: isDarkMode ? "0 10px 40px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.08)",
      transition: "all 0.3s ease",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.1)" : "#e2e8f0"}`,
    },
    imageContainer: {
      width: "100%",
      aspectRatio: "1 / 1",
      overflow: "hidden",
      borderRadius: "12px",
      marginBottom: "12px",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.4s ease",
    },
    productName: {
      fontSize: isMobile ? "0.9rem" : "1rem",
      fontWeight: "600",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      marginBottom: "6px",
    },
    price: {
      color: isDarkMode ? "#c9a962" : "#007bff",
      fontWeight: "600",
      marginBottom: "6px",
      fontSize: isMobile ? "0.9rem" : "1rem",
    },
    likes: {
      fontSize: isMobile ? "0.85rem" : "0.9rem",
      color: isDarkMode ? "rgba(255,255,255,0.5)" : "#555",
      margin: 0,
    },
    heart: {
      color: isDarkMode ? "#c9a962" : "red",
      fontSize: isMobile ? "0.9rem" : "1rem",
    },
  };
 
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading favourite products...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
 
  if (error) {
    return <div style={styles.errorContainer}>{error}</div>;
  }
 
  if (!products.length) {
    return (
      <div style={styles.emptyContainer}>
        No favourite products found.
      </div>
    );
  }
 
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Top Favourite Products</h1>
 
      <div style={styles.grid}>
        {products.map((p) => (
          <div
            key={p.productId}
            style={styles.card}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = isDarkMode ? "0 15px 40px rgba(201, 169, 98, 0.2)" : "0 12px 25px rgba(0,0,0,0.15)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = isDarkMode ? "0 10px 40px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.08)";
              }
            }}
          >
            <div style={styles.imageContainer}>
              <img
                src={
                  p.img
                    ? `http://localhost:5000/uploads/products/${p.img}`
                    : "/default-image.jpg"
                }
                alt={p.name}
                style={styles.image}
                onMouseEnter={(e) => {
                  if (!isMobile) e.currentTarget.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) e.currentTarget.style.transform = "scale(1)";
                }}
              />
            </div>
 
            <h4 style={styles.productName} title={p.name}>
              {p.name}
            </h4>
 
            <p style={styles.price}>
              ₹{Number(p.price).toFixed(2)}
            </p>
 
            <p style={styles.likes}>
              {p.likes}{" "}
              <span style={styles.heart}>&hearts;</span> Likes
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default FavouriteProducts;