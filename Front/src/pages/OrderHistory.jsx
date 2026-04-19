import { useEffect, useState, useRef } from "react";
import { apiFetch } from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FaGift, FaTicketAlt, FaBox, FaArrowRight, FaKey } from "react-icons/fa";
 
export default function OrderHistory() {
  const { isDarkMode } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(null);
  const [otpSent, setOtpSent] = useState({});
  const navigate = useNavigate();

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
 
  const prevOrdersRef = useRef([]);
 
  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/orders");
      setOrders(res.data || []);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    loadOrders();
  }, []);
 
  useEffect(() => {
    if (prevOrdersRef.current.length) {
      orders.forEach((order) => {
        const prevOrder = prevOrdersRef.current.find((o) => o._id === order._id);
        if (prevOrder && prevOrder.status !== order.status) {
          toast.info(
            `Order #${order._id.slice(-6).toUpperCase()} status changed to ${order.status}`
          );
        }
      });
    }
    prevOrdersRef.current = orders;
  }, [orders]);
 
  const cancelOrder = async (id) => {
    try {
      await apiFetch(`/orders/cancel/${id}`, { method: "PATCH" });
      toast.success("Order cancelled successfully");
      loadOrders();
    } catch (err) {
      toast.error("Failed to cancel order");
    }
  };

  const requestDeliveryOtp = async (orderId) => {
    setRequestingOtp(orderId);
    try {
      const data = await apiFetch(`/orders/${orderId}/request-otp`, {
        method: "POST"
      });
      if (data.success) {
        setOtpSent(prev => ({ ...prev, [orderId]: true }));
        toast.success("OTP sent to your email!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setRequestingOtp(null);
    }
  };
 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
 
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
 
  const getStatusStyle = (status) => {
    const styles = {
      Confirmed: { background: "rgba(33, 150, 243, 0.15)", color: "#2196f3" },
      Cancelled: { background: "rgba(244, 67, 54, 0.15)", color: "#ef4444" },
      Delivered: { background: "rgba(16, 185, 129, 0.15)", color: "#10b981" },
      Pending: { background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" },
      Processing: { background: "rgba(156, 39, 176, 0.15)", color: "#9c27b0" },
      Shipped: { background: "rgba(33, 150, 243, 0.15)", color: "#2196f3" },
      "Out Of Delivery": { background: "rgba(255, 87, 34, 0.15)", color: "#ff5722" },
    };
    return styles[status] || { background: "rgba(100, 100, 100, 0.15)", color: "#666" };
  };
 
  const styles = {
    container: {
      minHeight: "100vh",
      padding: isMobile ? "1.5rem 1rem" : "3rem 1.5rem",
      maxWidth: "1000px",
      margin: "0 auto",
      position: "relative",
    },
    bgOrb1: {
      position: "fixed",
      top: "-200px",
      right: "-200px",
      width: "500px",
      height: "500px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(201, 169, 98, 0.1) 0%, transparent 70%)",
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
      background: "radial-gradient(circle, rgba(201, 169, 98, 0.08) 0%, transparent 70%)",
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
    orderCard: (id, hovered) => ({
      background: isDarkMode ? "rgba(30, 30, 40, 0.9)" : "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: isMobile ? "16px" : "20px",
      padding: isMobile ? "1.25rem" : "2rem",
      marginBottom: isMobile ? "1rem" : "1.5rem",
      boxShadow: hovered === id
        ? "0 15px 40px rgba(201, 169, 98, 0.2)"
        : "0 4px 20px rgba(0,0,0,0.08)",
      transform: hovered === id && !isMobile ? "translateY(-6px)" : "translateY(0)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      border: "1px solid rgba(201, 169, 98, 0.15)",
      position: "relative",
      zIndex: 1,
    }),
    dateRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "1.25rem",
      fontSize: isMobile ? "0.85rem" : "0.9rem",
      color: isDarkMode ? "#a0a0a0" : "#64748b",
      fontWeight: 500,
    },
    headerInner: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "center",
      flexWrap: "wrap",
      gap: "1rem",
    },
    orderInfo: {
      width: isMobile ? "100%" : "auto",
    },
    orderId: {
      margin: 0,
      fontSize: isMobile ? "1.1rem" : "1.25rem",
      fontWeight: 700,
      color: isDarkMode ? "#e8d5a3" : "#1e293b",
      wordBreak: "break-all",
    },
    statusBadge: (status) => ({
      display: "inline-block",
      marginTop: "10px",
      padding: isMobile ? "5px 14px" : "7px 16px",
      borderRadius: "30px",
      fontSize: isMobile ? "0.8rem" : "0.85rem",
      fontWeight: 600,
      ...getStatusStyle(status),
    }),
    totalAmount: {
      fontSize: isMobile ? "1.3rem" : "1.5rem",
      fontWeight: 800,
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginTop: isMobile ? "0.5rem" : "0",
    },
    discountBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      background: "rgba(201, 169, 98, 0.15)",
      color: "#c9a962",
      padding: "5px 14px",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: 700,
      marginLeft: "0.75rem",
    },
    priceBreakdown: {
      marginTop: "1.25rem",
      padding: "1.25rem",
      background: "rgba(201, 169, 98, 0.05)",
      borderRadius: "16px",
      border: "1px solid rgba(201, 169, 98, 0.15)",
    },
    priceRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0.5rem 0",
      fontSize: "0.95rem",
      color: isDarkMode ? "#a0a0a0" : "#64748b",
    },
    discountRow: {
      color: "#10b981",
      borderTop: "1px dashed rgba(201, 169, 98, 0.2)",
      marginTop: "0.5rem",
      paddingTop: "0.5rem",
      fontWeight: 600,
    },
    itemsContainer: {
      marginTop: "1.5rem",
      borderTop: "1px solid rgba(201, 169, 98, 0.15)",
      paddingTop: "1.25rem",
    },
    itemsTitle: {
      margin: "0 0 0.75rem 0",
      fontSize: "1rem",
      fontWeight: 700,
      color: isDarkMode ? "#e8d5a3" : "#1e293b",
    },
    item: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      padding: "0.6rem 0",
      fontSize: isMobile ? "0.9rem" : "0.95rem",
      borderBottom: "1px solid rgba(201, 169, 98, 0.1)",
    },
    itemName: {
      fontWeight: 500,
      color: isDarkMode ? "#e8d5a3" : "#1e293b",
      marginBottom: isMobile ? "0.2rem" : "0",
    },
    itemPrice: {
      color: isDarkMode ? "#a0a0a0" : "#64748b",
      fontWeight: 500,
    },
    couponDisplay: {
      marginTop: "1rem",
      padding: "1rem",
      background: "rgba(201, 169, 98, 0.05)",
      borderRadius: "12px",
      border: "1px solid rgba(201, 169, 98, 0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "0.5rem",
    },
    couponText: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      color: isDarkMode ? "#a0a0a0" : "#64748b",
      fontSize: "0.9rem",
    },
    couponCode: {
      fontFamily: "monospace",
      fontSize: "1rem",
      fontWeight: 700,
      color: "#c9a962",
      letterSpacing: "1px",
    },
    savedText: {
      fontSize: "0.85rem",
      color: "#10b981",
      fontWeight: 600,
    },
    cancelBtn: {
      marginTop: "1.5rem",
      padding: isMobile ? "0.9rem" : "0.75rem 1.5rem",
      background: "rgba(239, 68, 68, 0.1)",
      color: "#ef4444",
      border: "1px solid rgba(239, 68, 68, 0.2)",
      borderRadius: "12px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "0.2s",
      width: isMobile ? "100%" : "auto",
      fontSize: isMobile ? "1rem" : "0.95rem",
    },
    loadingContainer: {
      textAlign: "center",
      marginTop: "4rem",
      position: "relative",
      zIndex: 1,
    },
    spinner: {
      width: "50px",
      height: "50px",
      border: "3px solid rgba(201, 169, 98, 0.2)",
      borderTop: "3px solid #c9a962",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto 1.25rem",
    },
    emptyContainer: {
      textAlign: "center",
      marginTop: "6rem",
      padding: isMobile ? "0 1rem" : "0",
      position: "relative",
      zIndex: 1,
    },
    emptyIcon: {
      fontSize: "4rem",
      color: "rgba(201, 169, 98, 0.3)",
      marginBottom: "1.5rem",
    },
    emptyTitle: {
      fontSize: isMobile ? "1.4rem" : "1.6rem",
      fontWeight: 700,
      color: isDarkMode ? "#e8d5a3" : "#1e293b",
      marginBottom: "1rem",
    },
    emptyText: {
      color: isDarkMode ? "#a0a0a0" : "#64748b",
      marginBottom: "2rem",
      fontSize: "1.1rem",
    },
    shopBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      padding: isMobile ? "1rem 2rem" : "0.875rem 2rem",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      color: "#000",
      border: "none",
      borderRadius: "14px",
      fontSize: "1.1rem",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 4px 20px rgba(201, 169, 98, 0.4)",
      transition: "all 0.3s ease",
    },
  };
 
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.bgOrb1} />
        <div style={styles.bgOrb2} />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={{ color: isDarkMode ? "#a0a0a0" : "#64748b" }}>Fetching your orders...</p>
        </div>
        <style>{`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
 
  if (!orders.length) {
    return (
      <div style={styles.container}>
        <div style={styles.bgOrb1} />
        <div style={styles.bgOrb2} />
        <div style={styles.emptyContainer}>
          <FaBox style={styles.emptyIcon} />
          <h2 style={styles.emptyTitle}>No Orders Yet</h2>
          <p style={styles.emptyText}>
            Once you place an order, it will appear here.
          </p>
          <button
            onClick={() => navigate("/products")}
            style={styles.shopBtn}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 25px rgba(201, 169, 98, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 20px rgba(201, 169, 98, 0.4)";
            }}
          >
            Start Shopping <FaArrowRight />
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
          <FaBox style={{ marginRight: "12px" }} />
          Order History
        </h2>
      </div>
 
      {orders.map((order) => {
        const subtotal = order.subtotal || order.items.reduce((sum, item) => 
          sum + (item.quantity * (item.product?.price || 0)), 0);
        
        const discountApplied = order.discountApplied;
        const discountAmount = discountApplied?.amount || 0;
        const finalTotal = order.totalAmount;
        
        const handleOrderClick = () => {
          navigate(`/order/${order._id}`);
        };

        return (
          <div
            key={order._id}
            onClick={handleOrderClick}
            onMouseEnter={() => !isMobile && setHovered(order._id)}
            onMouseLeave={() => !isMobile && setHovered(null)}
            style={{ ...styles.orderCard(order._id, hovered), cursor: "pointer" }}
          >
            <div style={styles.dateRow}>
              <span>{formatDate(order.createdAt)}</span>
              <span>{formatTime(order.createdAt)}</span>
            </div>
 
            <div style={styles.headerInner}>
              <div style={styles.orderInfo}>
                <h3 style={styles.orderId}>
                  Order #{order._id.slice(-6).toUpperCase()}
                  {discountApplied && (
                    <span style={styles.discountBadge}>
                      <FaTicketAlt /> {discountApplied.percentage}% OFF
                    </span>
                  )}
                </h3>
                <span style={styles.statusBadge(order.status)}>
                  {order.status}
                </span>
              </div>
 
              <div style={styles.totalAmount}>
                ₹{finalTotal.toLocaleString("en-IN")}
              </div>
            </div>
 
            {discountApplied && (
              <div style={styles.priceBreakdown}>
                <div style={styles.priceRow}>
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ ...styles.priceRow, ...styles.discountRow }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FaGift style={{ color: "#10b981" }} /> 
                    Discount ({discountApplied.percentage}%):
                  </span>
                  <span style={{ color: "#10b981" }}>
                    -₹{discountAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div style={{ ...styles.priceRow, fontWeight: "700", borderTop: "1px solid rgba(201, 169, 98, 0.2)", marginTop: "0.5rem", paddingTop: "0.5rem" }}>
                  <span>Total Paid:</span>
                  <span style={{ background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "1.1rem" }}>
                    ₹{finalTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            )}
 
            <div style={styles.itemsContainer}>
              <h4 style={styles.itemsTitle}>Items:</h4>
              {order.items.map((item, idx) => (
                <div key={idx} style={styles.item}>
                  <span style={styles.itemName}>
                    {item.product?.name || "Product"} × {item.quantity}
                  </span>
                  <span style={styles.itemPrice}>
                    ₹{(item.quantity * (item.product?.price || 0)).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
 
            {order.discountApplied?.code && (
              <div style={styles.couponDisplay}>
                <div style={styles.couponText}>
                  <FaTicketAlt style={{ color: "#c9a962" }} />
                  <span>Coupon:</span>
                  <span style={styles.couponCode}>{order.discountApplied.code}</span>
                </div>
                <span style={styles.savedText}>Saved ₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
 
            {order.status === "Confirmed" && (
              <button
                onClick={() => cancelOrder(order._id)}
                style={styles.cancelBtn}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
              >
                Cancel Order
              </button>
            )}

            {order.status === "Out Of Delivery" && (
              <div style={{ marginTop: "1.5rem" }}>
                {otpSent[order._id] ? (
                  <div style={{ 
                    padding: "1rem", 
                    background: "rgba(16, 185, 129, 0.1)", 
                    borderRadius: "12px", 
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    textAlign: "center"
                  }}>
                    <p style={{ color: "#10b981", fontWeight: "600", margin: 0 }}>
                      ✓ OTP sent to your email!
                    </p>
                    <p style={{ color: isDarkMode ? "#a0a0a0" : "#64748b", fontSize: "0.85rem", margin: "8px 0 0 0" }}>
                      Share this OTP with the delivery person
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => requestDeliveryOtp(order._id)}
                    style={{
                      ...styles.cancelBtn,
                      background: "rgba(102, 126, 234, 0.1)",
                      color: "#6366f1",
                      border: "1px solid rgba(102, 126, 234, 0.2)",
                    }}
                    disabled={requestingOtp === order._id}
                    onMouseEnter={(e) => {
                      if (!isMobile && requestingOtp !== order._id) {
                        e.currentTarget.style.background = "rgba(102, 126, 234, 0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile && requestingOtp !== order._id) {
                        e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)";
                      }
                    }}
                  >
                    <FaKey style={{ marginRight: "8px" }} />
                    {requestingOtp === order._id ? "Sending OTP..." : "Request OTP for Delivery"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
