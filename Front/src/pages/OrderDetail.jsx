import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FaGift, FaTicketAlt, FaBox, FaArrowLeft, FaPhone, FaCheck, FaTruck } from "react-icons/fa";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      toast.error("Failed to load order details");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
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

  const getStatusIndex = (status) => {
    const statuses = ["Confirmed", "Packed", "Shipped", "Out Of Delivery", "Delivered"];
    return statuses.indexOf(status);
  };

  const getStatusStyle = (status) => {
    const styles = {
      Confirmed: { bg: "rgba(33, 150, 243, 0.15)", color: "#2196f3" },
      Cancelled: { bg: "rgba(244, 67, 54, 0.15)", color: "#ef4444" },
      Delivered: { bg: "rgba(16, 185, 129, 0.15)", color: "#10b981" },
      Pending: { bg: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" },
      Processing: { bg: "rgba(156, 39, 176, 0.15)", color: "#9c27b0" },
      Packed: { bg: "rgba(156, 39, 176, 0.15)", color: "#9c27b0" },
      Shipped: { bg: "rgba(33, 150, 243, 0.15)", color: "#2196f3" },
      "Out Of Delivery": { bg: "rgba(255, 87, 34, 0.15)", color: "#ff5722" },
    };
    return styles[status] || { bg: "rgba(100, 100, 100, 0.15)", color: "#666" };
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const styles = {
    container: {
      minHeight: "100vh",
      padding: isMobile ? "1rem" : "2rem",
      maxWidth: "800px",
      margin: "0 auto",
    },
    backBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 16px",
      background: "rgba(201, 169, 98, 0.1)",
      border: "1px solid rgba(201, 169, 98, 0.2)",
      borderRadius: "12px",
      color: "#c9a962",
      cursor: "pointer",
      marginBottom: "1.5rem",
      fontSize: "0.95rem",
      fontWeight: 600,
      transition: "all 0.3s ease",
    },
    orderCard: {
      background: isDarkMode ? "rgba(30, 30, 40, 0.95)" : "rgba(20, 20, 30, 0.95)",
      borderRadius: "20px",
      padding: isMobile ? "1.25rem" : "1.5rem",
      marginBottom: "1.5rem",
      border: "1px solid rgba(201, 169, 98, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    },
    orderCardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "0.5rem",
    },
    orderIdSection: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    boxIcon: {
      fontSize: "1.5rem",
      color: "#c9a962",
    },
    orderId: {
      fontSize: isMobile ? "1.1rem" : "1.25rem",
      fontWeight: 700,
      color: "#fff",
      margin: 0,
    },
    statusBadge: (status) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 14px",
      borderRadius: "30px",
      fontSize: "0.8rem",
      fontWeight: 600,
      background: getStatusStyle(status).bg,
      color: getStatusStyle(status).color,
    }),
    expectedSection: {
      marginTop: isMobile ? "1rem" : "0",
      paddingTop: isMobile ? "1rem" : "0",
      borderTop: isMobile ? "1px solid rgba(201, 169, 98, 0.15)" : "none",
    },
    expectedLabel: {
      fontSize: "0.8rem",
      color: "rgba(255, 255, 255, 0.6)",
      marginBottom: "4px",
    },
    expectedValue: {
      fontSize: isMobile ? "0.9rem" : "1rem",
      fontWeight: 600,
      color: "#c9a962",
    },
    progressContainer: {
      marginBottom: "2rem",
    },
    progressBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "relative",
      padding: "0 10px",
    },
    progressLine: {
      position: "absolute",
      top: "50%",
      left: "30px",
      right: "30px",
      height: "3px",
      background: "rgba(100, 100, 100, 0.3)",
      transform: "translateY(-50%)",
      zIndex: 0,
    },
    progressLineFilled: {
      position: "absolute",
      top: "50%",
      left: "30px",
      height: "3px",
      background: "linear-gradient(90deg, #c9a962, #e8d5a3)",
      transform: "translateY(-50%)",
      zIndex: 0,
      transition: "width 0.5s ease",
    },
    progressStep: (completed, active) => ({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      zIndex: 1,
      cursor: "default",
    }),
    stepCircle: (completed, active) => ({
      width: isMobile ? "28px" : "32px",
      height: isMobile ? "28px" : "32px",
      borderRadius: "50%",
      background: completed 
        ? "#c9a962" 
        : active 
          ? "rgba(255, 87, 34, 0.2)"
          : "rgba(100, 100, 100, 0.3)",
      border: active ? "2px solid #ff5722" : "none",
      boxShadow: active ? "0 0 20px rgba(255, 87, 34, 0.6)" : "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease",
    }),
    stepLabel: (completed, active) => ({
      fontSize: isMobile ? "0.65rem" : "0.7rem",
      fontWeight: active ? 600 : 500,
      color: completed || active ? "#fff" : "rgba(255, 255, 255, 0.5)",
      textAlign: "center",
      whiteSpace: "nowrap",
    }),
    timelineSection: {
      marginBottom: "2rem",
    },
    timelineTitle: {
      fontSize: isMobile ? "1.1rem" : "1.25rem",
      fontWeight: 700,
      color: "#fff",
      marginBottom: "1.5rem",
    },
    timelineItem: (isLast) => ({
      display: "flex",
      gap: "1rem",
      position: "relative",
      paddingBottom: isLast ? "0" : "1.5rem",
    }),
    timelineLine: {
      position: "absolute",
      left: "15px",
      top: "30px",
      bottom: "0",
      width: "2px",
      background: "rgba(201, 169, 98, 0.3)",
    },
    timelineDot: (status) => ({
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      background: status === "completed" 
        ? "#10b981" 
        : status === "active"
          ? "rgba(255, 87, 34, 0.2)"
          : "rgba(100, 100, 100, 0.3)",
      border: status === "active" ? "2px solid #ff5722" : "none",
      boxShadow: status === "active" ? "0 0 20px rgba(255, 87, 34, 0.6)" : "none",
      color: status === "completed" || status === "active" ? "#fff" : "rgba(255, 255, 255, 0.5)",
      fontSize: "0.8rem",
    }),
    timelineContent: {
      flex: 1,
      paddingTop: "4px",
    },
    timelineStatus: (status) => ({
      fontSize: isMobile ? "0.95rem" : "1rem",
      fontWeight: 600,
      color: status === "active" ? "#ff5722" : "#fff",
      marginBottom: "4px",
    }),
    timelineDate: {
      fontSize: "0.85rem",
      color: "rgba(255, 255, 255, 0.6)",
    },
    deliveryCard: {
      background: isDarkMode ? "rgba(30, 30, 40, 0.95)" : "rgba(20, 20, 30, 0.95)",
      borderRadius: "20px",
      padding: isMobile ? "1.25rem" : "1.5rem",
      border: "1px solid rgba(201, 169, 98, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    },
    deliveryHeader: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "1rem",
    },
    deliveryIcon: {
      fontSize: "1.5rem",
      color: "#c9a962",
    },
    deliveryTitle: {
      fontSize: "1rem",
      fontWeight: 700,
      color: "#fff",
      margin: 0,
    },
    deliveryInfo: {
      marginBottom: "0.75rem",
    },
    deliveryLabel: {
      fontSize: "0.8rem",
      color: "rgba(255, 255, 255, 0.6)",
      marginBottom: "2px",
    },
    deliveryValue: {
      fontSize: isMobile ? "0.95rem" : "1rem",
      fontWeight: 600,
      color: "#fff",
    },
    callBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      width: "100%",
      padding: "14px",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      color: "#000",
      border: "none",
      borderRadius: "14px",
      fontSize: "1rem",
      fontWeight: 700,
      cursor: "pointer",
      marginTop: "1rem",
      boxShadow: "0 4px 20px rgba(201, 169, 98, 0.4)",
      transition: "all 0.3s ease",
    },
    itemsSection: {
      marginTop: "2rem",
      background: isDarkMode ? "rgba(30, 30, 40, 0.95)" : "rgba(20, 20, 30, 0.95)",
      borderRadius: "20px",
      padding: isMobile ? "1.25rem" : "1.5rem",
      border: "1px solid rgba(201, 169, 98, 0.2)",
    },
    itemsTitle: {
      fontSize: "1.1rem",
      fontWeight: 700,
      color: "#fff",
      marginBottom: "1rem",
    },
    item: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0.75rem 0",
      borderBottom: "1px solid rgba(201, 169, 98, 0.1)",
    },
    itemName: {
      fontWeight: 500,
      color: "#fff",
      flex: 1,
    },
    itemQty: {
      color: "rgba(255, 255, 255, 0.6)",
      marginRight: "1rem",
    },
    itemPrice: {
      fontWeight: 600,
      color: "#c9a962",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      paddingTop: "1rem",
      marginTop: "0.5rem",
      borderTop: "1px solid rgba(201, 169, 98, 0.2)",
    },
    totalLabel: {
      fontSize: "1.1rem",
      fontWeight: 700,
      color: "#fff",
    },
    totalAmount: {
      fontSize: "1.25rem",
      fontWeight: 800,
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    },
    spinner: {
      width: "40px",
      height: "40px",
      border: "3px solid rgba(201, 169, 98, 0.2)",
      borderTop: "3px solid #c9a962",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  };

  const progressSteps = [
    { key: "Confirmed", label: "Placed" },
    { key: "Packed", label: "Packed" },
    { key: "Shipped", label: "Shipped" },
    { key: "Out Of Delivery", label: "Out" },
    { key: "Delivered", label: "Done" },
  ];

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
        </div>
        <style>{`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!order) return null;

  const currentIndex = getStatusIndex(order.status);
  const progressWidth = currentIndex >= 0 ? `${(currentIndex / (progressSteps.length - 1)) * 100}%` : "0%";

  const timelineEvents = [
    { status: "Order Placed", date: order.createdAt, completed: true },
    { status: "Packed", date: order.assignedAt, completed: currentIndex >= 1 },
    { status: "Shipped", date: order.assignedAt, completed: currentIndex >= 2 },
    { status: "Out For Delivery", date: order.assignedAt, completed: currentIndex >= 3, active: currentIndex === 3 },
    { status: "Delivered", date: order.deliveredAt, completed: currentIndex >= 4 },
  ];

  const deliveryPartner = order.deliveryBoyName 
    ? { name: order.deliveryBoyName, phone: order.deliveryBoyPhone } 
    : order.deliveryBoy 
      ? { name: order.deliveryBoy.name || order.deliveryBoy.username, phone: order.deliveryBoy.phone } 
      : null;

  return (
    <div style={styles.container}>
      <button 
        style={styles.backBtn}
        onClick={() => navigate("/orders")}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(201, 169, 98, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(201, 169, 98, 0.1)";
        }}
      >
        <FaArrowLeft /> Back to Orders
      </button>

      <div style={styles.orderCard}>
        <div style={styles.orderCardHeader}>
          <div style={styles.orderIdSection}>
            <FaBox style={styles.boxIcon} />
            <h2 style={styles.orderId}>Order #{order._id.slice(-6).toUpperCase()}</h2>
          </div>
          <span style={styles.statusBadge(order.status)}>
            {order.status === "Out Of Delivery" && <FaTruck />}
            {order.status === "Delivered" && <FaCheck />}
            {order.status}
          </span>
        </div>
        <div style={styles.expectedSection}>
          <div style={styles.expectedLabel}>Expected Delivery</div>
          <div style={styles.expectedValue}>
            {order.status === "Delivered" ? "Delivered" : order.expectedDelivery || "Today"}
          </div>
        </div>
      </div>

      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div style={styles.progressLine} />
          <div style={{ ...styles.progressLineFilled, width: progressWidth }} />
          {progressSteps.map((step, idx) => {
            const completed = idx <= currentIndex;
            const active = idx === currentIndex;
            return (
              <div key={step.key} style={styles.progressStep(completed, active)}>
                <div style={styles.stepCircle(completed, active)}>
                  {completed ? (
                    <FaCheck style={{ color: "#000", fontSize: "0.8rem" }} />
                  ) : (
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
                  )}
                </div>
                <span style={styles.stepLabel(completed, active)}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.timelineSection}>
        <h3 style={styles.timelineTitle}>Order Timeline</h3>
        {timelineEvents.map((event, idx) => (
          <div key={idx} style={styles.timelineItem(idx === timelineEvents.length - 1)}>
            {idx < timelineEvents.length - 1 && <div style={styles.timelineLine} />}
            <div style={styles.timelineDot(event.completed ? "completed" : event.active ? "active" : "pending")}>
              {event.completed ? (
                <FaCheck style={{ fontSize: "0.7rem" }} />
              ) : event.active ? (
                <FaTruck style={{ fontSize: "0.7rem" }} />
              ) : (
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
              )}
            </div>
            <div style={styles.timelineContent}>
              <div style={styles.timelineStatus(event.active ? "active" : "pending")}>
                {event.status === "Out Of Delivery" && "🚚 "}
                {event.status}{event.active && " (LIVE)"}
              </div>
              {event.date && (
                <div style={styles.timelineDate}>
                  {formatDate(event.date)}, {formatTime(event.date)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {deliveryPartner && order.status !== "Delivered" && (
        <div style={styles.deliveryCard}>
          <div style={styles.deliveryHeader}>
            <FaTruck style={styles.deliveryIcon} />
            <h4 style={styles.deliveryTitle}>Delivery Partner</h4>
          </div>
          <div style={styles.deliveryInfo}>
            <div style={styles.deliveryLabel}>Name</div>
            <div style={styles.deliveryValue}>{deliveryPartner.name}</div>
          </div>
          <div style={styles.deliveryInfo}>
            <div style={styles.deliveryLabel}>Phone</div>
            <div style={styles.deliveryValue}>{deliveryPartner.phone}</div>
          </div>
          <button 
            style={styles.callBtn}
            onClick={() => handleCall(deliveryPartner.phone)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 25px rgba(201, 169, 98, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(201, 169, 98, 0.4)";
            }}
          >
            <FaPhone /> Call Delivery Partner
          </button>
        </div>
      )}

      <div style={styles.itemsSection}>
        <h3 style={styles.itemsTitle}>Order Items</h3>
        {order.items.map((item, idx) => (
          <div key={idx} style={styles.item}>
            <span style={styles.itemName}>{item.product?.name || "Product"}</span>
            <span style={styles.itemQty}>× {item.quantity}</span>
            <span style={styles.itemPrice}>
              ₹{(item.quantity * (item.product?.price || 0)).toLocaleString("en-IN")}
            </span>
          </div>
        ))}
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total</span>
          <span style={styles.totalAmount}>₹{order.totalAmount.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}