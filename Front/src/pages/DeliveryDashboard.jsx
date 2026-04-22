
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../api/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ProfileDropdown from "../components/ProfileDropdown";
import NotificationBell from "../components/NotificationBell";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBox,
  FaUser,
  FaRupeeSign,
  FaPhone,
  FaMapMarkerAlt,
  FaCheck,
  FaClock,
  FaMotorcycle,
  FaSun,
  FaMoon,
  FaGem,
  FaKey,
} from "react-icons/fa";

export default function DeliveryDashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [otpVerified, setOtpVerified] = useState({});

  const accentColor = "#c9a962";
  const accentLight = "#e8d5a3";

  // Handle URL query parameters for navigation from notifications
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    if (page) {
      setActivePage(page);
      navigate(location.pathname, { replace: true });
    }
  }, [location]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/orders/delivery/my");
      const ordersData = res.data || [];
      setOrders(ordersData);
      
      const verifiedMap = {};
      ordersData.forEach(order => {
        if (order.otp?.verified) {
          verifiedMap[order._id] = true;
        }
      });
      setOtpVerified(verifiedMap);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load delivery orders");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (orderId) => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter valid 6-digit OTP");
      return;
    }

    setVerifying(true);
    try {
      const data = await apiFetch(`/orders/delivery/verify-otp/${orderId}`, {
        method: "PATCH",
        body: { otp }
      });

      if (data.success) {
        setOtpVerified(prev => ({ ...prev, [orderId]: true }));
        setOtp("");
        setSelectedOrder(null);
        toast.success("OTP verified! You can complete delivery now.");
        loadOrders();
      }
    } catch (error) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  const markDelivered = async (orderId) => {
    try {
      const res = await apiFetch(`/orders/delivery/delivered/${orderId}`, {
        method: "PATCH",
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: "Delivered",
                deliveredAt: res.data?.deliveredAt || new Date().toISOString(),
              }
            : order
        )
      );
      toast.success("Order marked as delivered!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark delivered");
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadOrders();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${formattedDate} • ${formattedTime}`;
  };

  const bgColor = isDarkMode ? "#050507" : "#f8fafc";
  const cardBg = isDarkMode ? "rgba(20, 20, 28, 0.98)" : "#ffffff";
  const textColor = isDarkMode ? "#ffffff" : "#0f172a";
  const textSecondary = isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b";
  const borderColor = isDarkMode ? "rgba(201, 169, 98, 0.1)" : "rgba(0,0,0,0.05)";

  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const styles = {
    pageContainer: {
      minHeight: "100vh",
      background: isDarkMode 
        ? "linear-gradient(135deg, #050507 0%, #0a0a10 50%, #050507 100%)"
        : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    contentWrapper: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    },
    stickyHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "1rem",
      padding: isMobile ? "0.75rem 1rem" : "0.75rem 1.5rem",
      background: isDarkMode ? "rgba(15, 15, 20, 0.95)" : "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${borderColor}`,
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.05)",
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    logoContainer: {
      width: "44px",
      height: "44px",
      borderRadius: "12px",
      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentLight} 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 4px 15px ${accentColor}30`,
    },
    headerTitle: {
      fontSize: isMobile ? "1.1rem" : "1.3rem",
      fontWeight: 700,
      color: textColor,
      marginBottom: "0.1rem",
    },
    headerSubtitle: {
      fontSize: isMobile ? "0.75rem" : "0.85rem",
      color: textSecondary,
    },
    headerRight: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    themeBtn: {
      width: "40px",
      height: "40px",
      borderRadius: "12px",
      background: cardBg,
      border: `1px solid ${borderColor}`,
      color: accentColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: "1.1rem",
    },
    dateTimeBox: {
      background: cardBg,
      borderRadius: "12px",
      padding: "0.5rem 1rem",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      border: `1px solid ${borderColor}`,
      boxShadow: isDarkMode ? "0 2px 10px rgba(0,0,0,0.2)" : "0 2px 10px rgba(0,0,0,0.03)",
    },
    scrollArea: {
      flex: 1,
      padding: isMobile ? "1rem" : "1.5rem",
      overflowY: "auto",
    },
    mainCard: {
      background: cardBg,
      borderRadius: "24px",
      padding: isMobile ? "1.25rem" : "1.5rem",
      boxShadow: isDarkMode 
        ? "0 10px 50px rgba(0,0,0,0.4)" 
        : "0 8px 40px rgba(0,0,0,0.04)",
      border: `1px solid ${borderColor}`,
      position: "relative",
      overflow: "hidden",
    },
    cardTopBorder: {
      position: "absolute",
      top: 0,
      left: "5%",
      right: "5%",
      height: "3px",
      background: `linear-gradient(90deg, transparent, ${accentColor}, ${accentLight}, ${accentColor}, transparent)`,
      borderRadius: "0 0 4px 4px",
    },
    cardHeader: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "center",
      gap: "1rem",
      marginBottom: "1.5rem",
    },
    cardTitle: {
      fontSize: isMobile ? "1.2rem" : "1.4rem",
      fontWeight: 700,
      color: textColor,
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    cardTitleIcon: {
      width: "44px",
      height: "44px",
      borderRadius: "12px",
      background: `linear-gradient(135deg, ${accentColor}30, ${accentLight}10)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: accentColor,
      fontSize: "1.2rem",
    },
    cardActions: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    profileBtn: {
      background: cardBg,
      border: `1px solid ${borderColor}`,
      borderRadius: "12px",
      padding: "0.5rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    logoutBtn: {
      background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
      color: "#fff",
      border: "none",
      padding: isMobile ? "0.6rem 1rem" : "0.6rem 1.2rem",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
    },
    tableContainer: {
      overflowX: "auto",
      display: isMobile ? "none" : "block",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
      minWidth: "900px",
    },
    th: {
      padding: "1rem",
      textAlign: "left",
      fontSize: "0.8rem",
      fontWeight: 700,
      color: textSecondary,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      borderBottom: `2px solid ${borderColor}`,
      background: isDarkMode ? "rgba(15, 15, 20, 0.5)" : "#f8fafc",
    },
    td: {
      padding: "1rem",
      borderBottom: `1px solid ${borderColor}`,
      fontSize: "0.9rem",
      color: textColor,
      verticalAlign: "top",
    },
    orderId: {
      fontFamily: "monospace",
      fontWeight: 600,
      color: accentColor,
    },
    statusBadge: (status) => ({
      padding: "0.35rem 0.75rem",
      borderRadius: "20px",
      fontSize: "0.75rem",
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
      gap: "0.3rem",
      background: status === "Delivered" 
        ? (isDarkMode ? "rgba(52, 211, 153, 0.2)" : "rgba(16, 185, 129, 0.15)")
        : (isDarkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.15)"),
      color: status === "Delivered" ? "#34d399" : "#3b82f6",
    }),
    addressBox: {
      background: isDarkMode ? "rgba(201, 169, 98, 0.1)" : "#f8fafc",
      padding: "0.75rem",
      borderRadius: "12px",
      fontSize: "0.85rem",
      maxWidth: "220px",
    },
    mapLink: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.3rem",
      marginTop: "0.5rem",
      padding: "0.3rem 0.6rem",
      background: `${accentColor}20`,
      color: accentColor,
      borderRadius: "8px",
      fontSize: "0.75rem",
      fontWeight: 600,
      textDecoration: "none",
      transition: "all 0.2s ease",
    },
    deliverBtn: {
      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentLight} 100%)`,
      color: "#0f172a",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "0.85rem",
      fontWeight: 700,
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4rem",
      transition: "all 0.3s ease",
      boxShadow: `0 4px 15px ${accentColor}30`,
    },
    smallBtn: {
      padding: "4px 8px",
      border: "none",
      borderRadius: "6px",
      color: "#fff",
      fontSize: "0.75rem",
      fontWeight: 600,
      cursor: "pointer",
    },
    otpInput: {
      border: "1px solid rgba(102, 126, 234, 0.3)",
      borderRadius: "8px",
      outline: "none",
    },
    mobileCards: {
      display: isMobile ? "flex" : "none",
      flexDirection: "column",
      gap: "1rem",
    },
    mobileCard: {
      background: cardBg,
      borderRadius: "16px",
      padding: "1.25rem",
      border: `1px solid ${borderColor}`,
      boxShadow: isDarkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.05)",
    },
    mobileCardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1rem",
      paddingBottom: "0.75rem",
      borderBottom: `1px solid ${borderColor}`,
    },
    mobileInfo: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "0.5rem",
      fontSize: "0.9rem",
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem 1rem",
      color: textSecondary,
    },
    emptyIcon: {
      fontSize: "4rem",
      marginBottom: "1rem",
      opacity: 0.5,
    },
    loadingContainer: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: bgColor,
    },
    loadingCard: {
      padding: "2.5rem",
      background: cardBg,
      borderRadius: "24px",
      textAlign: "center",
      boxShadow: isDarkMode 
        ? "0 20px 60px rgba(0,0,0,0.4)" 
        : "0 10px 40px rgba(0,0,0,0.08)",
      border: `1px solid ${borderColor}`,
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <motion.div
          style={styles.loadingCard}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div style={{
            width: "50px",
            height: "50px",
            border: `4px solid ${borderColor}`,
            borderTop: `4px solid ${accentColor}`,
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1.5rem"
          }} />
          <p style={{ color: textSecondary, fontSize: "1rem" }}>
            Loading delivery orders...
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        {/* Sticky Header */}
        <div style={styles.stickyHeader}>
          <div style={styles.headerLeft}>
            <div style={styles.logoContainer}>
              <FaMotorcycle style={{ color: "#0f172a", fontSize: "1.2rem" }} />
            </div>
            <div>
              <h1 style={styles.headerTitle}>Delivery Dashboard</h1>
              <p style={styles.headerSubtitle}>
                {user?.username ? `Welcome, ${user.username}` : "Delivery Partner"}
              </p>
            </div>
          </div>

          <div style={styles.headerRight}>
            {!isMobile && (
              <div style={styles.dateTimeBox}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FaClock style={{ color: accentColor, fontSize: "0.9rem" }} />
                  <span style={{ fontSize: "0.85rem", fontWeight: 500, color: textColor }}>
                    {formattedDate}
                  </span>
                </div>
                <div style={{ width: "1px", height: "18px", background: borderColor }} />
                <span style={{ 
                  fontSize: "0.9rem", 
                  fontWeight: 600, 
                  color: accentColor,
                  fontFamily: "'SF Mono', monospace"
                }}>
                  {formattedTime}
                </span>
              </div>
            )}

            <button
              onClick={toggleTheme}
              style={styles.themeBtn}
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>

            <NotificationBell />

            <div style={styles.profileBtn}>
              <ProfileDropdown />
            </div>

            <button
              style={styles.logoutBtn}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={styles.scrollArea}>
          <div style={styles.mainCard}>
            <div style={styles.cardTopBorder} />

            {/* Card Header */}
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                <div style={styles.cardTitleIcon}>
                  <FaBox />
                </div>
                My Delivery Orders
                <span style={{
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: textSecondary,
                  marginLeft: "0.5rem",
                }}>
                  ({orders.length})
                </span>
              </h2>
            </div>

            {/* Desktop Table View */}
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Order ID</th>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Items</th>
                    <th style={styles.th}>Total</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Address</th>
                    <th style={styles.th}>Payment</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Assigned</th>
                    <th style={styles.th}>Delivered</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="10" style={{ ...styles.td, textAlign: "center", padding: "3rem" }}>
                          <div style={styles.emptyState}>
                            <div style={styles.emptyIcon}>📦</div>
                            <h3 style={{ color: textColor, marginBottom: "0.5rem" }}>
                              No delivery orders assigned yet
                            </h3>
                            <p>New orders will appear here when assigned to you.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      orders.map((order, index) => (
                        <motion.tr
                          key={order._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          style={{
                            background: index % 2 === 0 
                              ? "transparent" 
                              : (isDarkMode ? "rgba(255,255,255,0.02)" : "#f8fafc"),
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (!isMobile) {
                              e.currentTarget.style.background = isDarkMode 
                                ? "rgba(201, 169, 98, 0.05)" 
                                : "#f0f9ff";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isMobile) {
                              e.currentTarget.style.background = index % 2 === 0 
                                ? "transparent" 
                                : (isDarkMode ? "rgba(255,255,255,0.02)" : "#f8fafc");
                            }
                          }}
                        >
                          <td style={styles.td}>
                            <span style={styles.orderId}>#{order._id.slice(-6)}</span>
                          </td>
                          <td style={styles.td}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <FaUser style={{ color: accentColor, fontSize: "0.9rem" }} />
                              {order.user?.username || "N/A"}
                            </div>
                          </td>
                          <td style={styles.td}>
                            {order.items.map((item) => (
                              <div key={item.product?._id} style={{ marginBottom: "0.25rem" }}>
                                {item.product?.name} × {item.quantity}
                              </div>
                            ))}
                          </td>
                          <td style={{ ...styles.td, fontWeight: 700 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                              <FaRupeeSign style={{ color: accentColor, fontSize: "0.85rem" }} />
                              {order.totalAmount}
                            </div>
                          </td>
                          <td style={styles.td}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              <span style={{
                                padding: "3px 8px",
                                borderRadius: "6px",
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                background: order.paymentMethod === "Online" ? "rgba(201, 169, 98, 0.2)" : "rgba(100, 100, 100, 0.1)",
                                color: order.paymentMethod === "Online" ? "#c9a962" : "#888",
                              }}>
                                {order.paymentMethod === "Online" ? "QR Code" : "COD"}
                              </span>
                              {order.paymentMethod === "Online" && (
                                <span style={{
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  color: order.paymentStatus === "Paid" ? "#22c55e" : (order.paymentStatus === "Initiated" ? "#f59e0b" : "#94a3b8"),
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  background: order.paymentStatus === "Paid" ? "rgba(34, 197, 94, 0.1)" : (order.paymentStatus === "Initiated" ? "rgba(245, 158, 11, 0.1)" : "rgba(148, 163, 184, 0.1)"),
                                }}>
                                  {order.paymentStatus === "Paid" ? "PAID ✅" : order.paymentStatus === "Initiated" ? "INITIATED" : "PENDING"}
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={styles.td}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <FaPhone style={{ color: accentColor, fontSize: "0.85rem" }} />
                              {order.shippingAddress?.phone || "-"}
                            </div>
                          </td>
                          <td style={styles.td}>
                            {order.shippingAddress ? (
                              <div style={styles.addressBox}>
                                <div>{order.shippingAddress.address}</div>
                                <div>{order.shippingAddress.city} - {order.shippingAddress.postalCode}</div>
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    `${order.shippingAddress.address}, ${order.shippingAddress.city}`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={styles.mapLink}
                                >
                                  <FaMapMarkerAlt style={{ fontSize: "0.75rem" }} />
                                  Open Map
                                </a>
                              </div>
                            ) : "-"}
                          </td>
                          <td style={styles.td}>
                            <span style={styles.statusBadge(order.status)}>
                              {order.status === "Delivered" ? <FaCheck style={{ fontSize: "0.7rem" }} /> : <FaClock style={{ fontSize: "0.7rem" }} />}
                              {order.status}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <span style={{ fontSize: "0.85rem", color: textSecondary }}>
                              {formatDate(order.assignedAt)}
                            </span>
                          </td>
                          <td style={styles.td}>
                            {order.deliveredAt ? (
                              <span style={{ 
                                fontSize: "0.85rem", 
                                color: "#34d399",
                                fontWeight: 600 
                              }}>
                                {formatDate(order.deliveredAt)}
                              </span>
                            ) : (
                              <span style={{ 
                                fontSize: "0.85rem", 
                                color: textSecondary,
                                fontStyle: "italic"
                              }}>
                                Pending
                              </span>
                            )}
                          </td>
                          <td style={styles.td}>
                            {order.status !== "Delivered" && (
                              <>
                                {otpVerified[order._id] ? (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ ...styles.deliverBtn, background: "#10b981" }}
                                    onClick={() => markDelivered(order._id)}
                                  >
                                    <FaCheck style={{ fontSize: "0.85rem" }} />
                                    Complete
                                  </motion.button>
                                ) : selectedOrder === order._id ? (
                                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                                    <input
                                      type="text"
                                      maxLength={6}
                                      placeholder="OTP"
                                      value={otp}
                                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                      style={{ ...styles.otpInput, width: "80px", padding: "8px", fontSize: "14px", textAlign: "center" }}
                                    />
                                    <div style={{ display: "flex", gap: "4px" }}>
                                      <button
                                        style={{ ...styles.smallBtn, background: "#10b981" }}
                                        onClick={() => verifyOtp(order._id)}
                                        disabled={verifying || otp.length !== 6}
                                      >
                                        {verifying ? "..." : "Verify"}
                                      </button>
                                      <button
                                        style={{ ...styles.smallBtn, background: "#6b7280" }}
                                        onClick={() => { setSelectedOrder(null); setOtp(""); }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ ...styles.deliverBtn, background: "#6366f1" }}
                                    onClick={() => setSelectedOrder(order._id)}
                                  >
                                    <FaKey style={{ fontSize: "0.85rem" }} />
                                    OTP
                                  </motion.button>
                                )}
                              </>
                            )}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div style={styles.mobileCards}>
              {orders.length === 0 ? (
                <div style={styles.mobileCard}>
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>📦</div>
                    <h3 style={{ color: textColor, marginBottom: "0.5rem" }}>
                      No delivery orders assigned yet
                    </h3>
                    <p>New orders will appear here when assigned to you.</p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {orders.map((order) => (
                    <motion.div
                      key={order._id}
                      style={styles.mobileCard}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div style={styles.mobileCardHeader}>
                        <span style={styles.orderId}>#{order._id.slice(-6)}</span>
                        <span style={styles.statusBadge(order.status)}>
                          {order.status}
                        </span>
                      </div>

                      <div style={styles.mobileInfo}>
                        <span style={{ color: textSecondary }}>Customer:</span>
                        <span style={{ fontWeight: 600 }}>{order.user?.username || "N/A"}</span>
                      </div>

                      <div style={styles.mobileInfo}>
                        <span style={{ color: textSecondary }}>Total:</span>
                        <span style={{ fontWeight: 700, color: accentColor }}>
                          ₹{order.totalAmount}
                        </span>
                      </div>

                      <div style={styles.mobileInfo}>
                        <span style={{ color: textSecondary }}>Payment:</span>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <span style={{
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            background: order.paymentMethod === "Online" ? "rgba(201, 169, 98, 0.2)" : "rgba(100, 100, 100, 0.1)",
                            color: order.paymentMethod === "Online" ? "#c9a962" : "#888",
                          }}>
                            {order.paymentMethod === "Online" ? "QR Code" : "COD"}
                          </span>
                          {order.paymentMethod === "Online" && (
                            <span style={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              color: order.paymentStatus === "Paid" ? "#22c55e" : (order.paymentStatus === "Initiated" ? "#f59e0b" : "#94a3b8"),
                              padding: "3px 8px",
                              borderRadius: "6px",
                              background: order.paymentStatus === "Paid" ? "rgba(34, 197, 94, 0.1)" : (order.paymentStatus === "Initiated" ? "rgba(245, 158, 11, 0.1)" : "rgba(148, 163, 184, 0.1)"),
                            }}>
                              {order.paymentStatus === "Paid" ? "PAID" : order.paymentStatus === "Initiated" ? "INITIATED" : "PENDING"}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={styles.mobileInfo}>
                        <span style={{ color: textSecondary }}>Phone:</span>
                        <span>{order.shippingAddress?.phone || "-"}</span>
                      </div>

                      <div style={styles.mobileInfo}>
                        <span style={{ color: textSecondary }}>Assigned:</span>
                        <span style={{ fontSize: "0.85rem" }}>{formatDate(order.assignedAt)}</span>
                      </div>

                      <div style={styles.mobileInfo}>
                        <span style={{ color: textSecondary }}>Delivered:</span>
                        {order.deliveredAt ? (
                          <span style={{ fontSize: "0.85rem", color: "#34d399", fontWeight: 600 }}>
                            {formatDate(order.deliveredAt)}
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.85rem", color: textSecondary, fontStyle: "italic" }}>
                            Pending
                          </span>
                        )}
                      </div>

                      {order.shippingAddress && (
                        <div style={{
                          ...styles.addressBox,
                          marginTop: "0.75rem",
                        }}>
                          <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                            {order.shippingAddress.address}
                          </div>
                          <div style={{ color: textSecondary, marginBottom: "0.5rem" }}>
                            {order.shippingAddress.city} - {order.shippingAddress.postalCode}
                          </div>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${order.shippingAddress.address}, ${order.shippingAddress.city}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.mapLink}
                          >
                            <FaMapMarkerAlt style={{ fontSize: "0.75rem" }} />
                            Open Map
                          </a>
                        </div>
                      )}

                      {order.status !== "Delivered" && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          style={{
                            ...styles.deliverBtn,
                            width: "100%",
                            justifyContent: "center",
                            marginTop: "1rem",
                          }}
                          onClick={() => markDelivered(order._id)}
                        >
                          <FaCheck style={{ fontSize: "0.9rem" }} />
                          Mark as Delivered
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        
        ::-webkit-scrollbar { 
          width: 6px; 
          height: 6px; 
        }
        
        ::-webkit-scrollbar-track { 
          background: ${isDarkMode ? "#0a0a0f" : "#f1f5f9"}; 
          border-radius: 10px; 
        }
        
        ::-webkit-scrollbar-thumb { 
          background: ${isDarkMode ? "#2a2a3a" : "#cbd5e1"}; 
          border-radius: 10px; 
        }
        
        ::-webkit-scrollbar-thumb:hover { 
          background: ${accentColor}; 
        }
        
        ::selection {
          background: ${accentColor}40;
          color: ${isDarkMode ? "#ffffff" : "#0f172a"};
        }
      `}</style>
    </div>
  );
}
