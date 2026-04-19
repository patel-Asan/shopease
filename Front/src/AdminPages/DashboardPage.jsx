// src/AdminPages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useTheme } from "../context/ThemeContext";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaStar,
  FaTruck,
  FaEnvelope,
  FaChartLine,
  FaUserShield,
} from "react-icons/fa";

const DashboardPage = () => {
  const { isDarkMode } = useTheme();
  const [infoCardsData, setInfoCardsData] = useState([]);
  const [animateCards, setAnimateCards] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 480);
      setIsTablet(width > 480 && width <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return console.error("No auth token found.");

        const response = await API.get("/admin/dashboard", { _skipRefresh: true });

        if (response.status === 401) return console.error("Unauthorized");

        const data = response.data;

        const icons = [
          <FaUsers />,
          <FaBoxOpen />,
          <FaShoppingCart />,
          <FaStar />,
          <FaTruck />,
          <FaEnvelope />,
          <FaChartLine />,
        ];

        const gradients = [
          { bg: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)", shadow: "rgba(201, 169, 98, 0.4)" },
          { bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", shadow: "rgba(245, 87, 108, 0.4)" },
          { bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", shadow: "rgba(79, 172, 254, 0.4)" },
          { bg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", shadow: "rgba(67, 233, 123, 0.4)" },
          { bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", shadow: "rgba(250, 112, 154, 0.4)" },
          { bg: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", shadow: "rgba(161, 140, 209, 0.4)" },
          { bg: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", shadow: "rgba(255, 154, 158, 0.4)" },
        ];

        const dataWithIcons = data.map((item, index) => ({
          ...item,
          icon: icons[index % icons.length],
          gradient: gradients[index % gradients.length],
        }));

        setInfoCardsData(dataWithIcons);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
    const timer = setTimeout(() => setAnimateCards(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const textColor = isDarkMode ? "#ffffff" : "#0f172a";
  const textSecondary = isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b";
  const cardBg = isDarkMode ? "rgba(30, 30, 40, 0.8)" : "rgba(255, 255, 255, 0.95)";
  const borderColor = isDarkMode ? "rgba(201, 169, 98, 0.15)" : "rgba(0,0,0,0.05)";
  const accentColor = "#c9a962";

  const styles = {
    container: {
      padding: isMobile ? "1rem" : "2rem",
      maxWidth: "1400px",
      margin: "0 auto",
      minHeight: "100vh",
    },
    header: {
      marginBottom: isMobile ? "1.5rem" : "2rem",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    iconContainer: {
      width: isMobile ? "50px" : "60px",
      height: isMobile ? "50px" : "60px",
      borderRadius: "16px",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: isMobile ? "1.5rem" : "1.8rem",
      color: "#000",
      boxShadow: "0 8px 25px rgba(201, 169, 98, 0.4)",
    },
    titleSection: {
      flex: 1,
    },
    title: {
      color: textColor,
      fontWeight: 700,
      fontSize: isMobile ? "1.5rem" : isTablet ? "1.8rem" : "2rem",
      marginBottom: "0.25rem",
    },
    subtitle: {
      color: textSecondary,
      fontSize: isMobile ? "0.85rem" : "1rem",
    },
    cardsGrid: {
      display: "grid",
      gridTemplateColumns: isMobile 
        ? "1fr" 
        : isTablet 
          ? "repeat(2, 1fr)" 
          : "repeat(4, 1fr)",
      gap: isMobile ? "1rem" : "1.5rem",
    },
    card: (gradient, index) => ({
      width: "100%",
      background: cardBg,
      backdropFilter: "blur(20px)",
      padding: isMobile ? "1.2rem" : "1.5rem",
      borderRadius: "20px",
      boxShadow: isDarkMode ? "none" : "0 4px 20px rgba(0,0,0,0.08)",
      border: `1px solid ${borderColor}`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      cursor: "pointer",
      transform: animateCards ? "translateY(0)" : "translateY(30px)",
      opacity: animateCards ? 1 : 0,
      transition: `all 0.6s ease ${(index + 1) * 0.1}s`,
      position: "relative",
      overflow: "hidden",
    }),
    cardGlow: (gradient) => ({
      position: "absolute",
      top: "-50%",
      right: "-50%",
      width: "100%",
      height: "100%",
      background: gradient.bg,
      opacity: 0.1,
      borderRadius: "50%",
      filter: "blur(60px)",
    }),
    cardIcon: {
      width: isMobile ? "45px" : "55px",
      height: isMobile ? "45px" : "55px",
      borderRadius: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "1rem",
      position: "relative",
      zIndex: 1,
    },
    cardTitle: {
      color: textSecondary,
      margin: 0,
      fontSize: isMobile ? "0.85rem" : "0.95rem",
      fontWeight: 500,
      position: "relative",
      zIndex: 1,
    },
    cardValue: {
      fontSize: isMobile ? "2rem" : "2.5rem",
      fontWeight: 800,
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      margin: "0.5rem 0 0 0",
      position: "relative",
      zIndex: 1,
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "300px",
    },
    loadingSpinner: {
      width: "50px",
      height: "50px",
      border: `4px solid ${borderColor}`,
      borderTop: `4px solid ${accentColor}`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  };

  if (!infoCardsData.length) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.iconContainer}>
          <FaUserShield />
        </div>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
      </div>

      <div style={styles.cardsGrid}>
        {infoCardsData.map((card, index) => (
          <div
            key={card.title}
            style={styles.card(card.gradient, index)}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                e.currentTarget.style.boxShadow = `0 20px 40px rgba(201, 169, 98, 0.2)`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = isDarkMode ? "none" : "0 4px 20px rgba(0,0,0,0.08)";
              }
            }}
          >
            <div style={styles.cardGlow(card.gradient)} />
            <div style={{ ...styles.cardIcon, background: card.gradient.bg, boxShadow: `0 8px 25px ${card.gradient.shadow}` }}>
              <span style={{ color: "#fff", fontSize: isMobile ? "1.2rem" : "1.4rem" }}>{card.icon}</span>
            </div>
            <h4 style={styles.cardTitle}>{card.title}</h4>
            <p style={styles.cardValue}>{card.value}</p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
