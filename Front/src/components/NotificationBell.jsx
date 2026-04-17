
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext";
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaCheckDouble,
  FaTimes,
  FaShoppingBag,
  FaBox,
  FaUser,
  FaMotorcycle,
  FaEnvelope,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaDollarSign,
  FaLock,
  FaUnlock,
} from "react-icons/fa";

const NotificationBell = ({ size = 40, fontSize = 18 }) => {
  const { 
    notifications, 
    unreadCount, 
    loading,
    hasMore,
    loadMore,
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    clearAll,
    fetchNotifications,
  } = useNotifications();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const accentColor = "#c9a962";

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    if (notification.link) {
      // Handle query parameter links
      if (notification.link.includes('?')) {
        navigate(notification.link);
      } else {
        navigate(notification.link);
      }
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "NEW_ORDER":
      case "ORDER_CONFIRMED":
        return <FaShoppingBag />;
      case "ORDER_STATUS_UPDATE":
        return <FaBox />;
      case "ORDER_SHIPPED":
      case "ORDER_OUT_FOR_DELIVERY":
        return <FaBox />;
      case "ORDER_DELIVERED":
        return <FaCheckCircle />;
      case "ORDER_CANCELLED":
        return <FaTimesCircle />;
      case "PAYMENT_RECEIVED":
        return <FaDollarSign />;
      case "NEW_USER":
      case "NEW_REGISTRATION":
        return <FaUser />;
      case "DELIVERY_ASSIGNED":
        return <FaMotorcycle />;
      case "NEW_MESSAGE":
        return <FaEnvelope />;
      case "LOW_STOCK":
        return <FaExclamationTriangle />;
      case "ACCOUNT_BLOCKED":
        return <FaLock />;
      case "ACCOUNT_UNBLOCKED":
        return <FaUnlock />;
      default:
        return <FaBell />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "NEW_ORDER":
      case "ORDER_CONFIRMED":
        return "#3b82f6";
      case "ORDER_STATUS_UPDATE":
        return "#f59e0b";
      case "ORDER_SHIPPED":
      case "ORDER_OUT_FOR_DELIVERY":
        return "#8b5cf6";
      case "ORDER_DELIVERED":
        return "#10b981";
      case "ORDER_CANCELLED":
        return "#ef4444";
      case "PAYMENT_RECEIVED":
        return "#22c55e";
      case "NEW_USER":
      case "NEW_REGISTRATION":
        return "#f59e0b";
      case "DELIVERY_ASSIGNED":
        return "#ec4899";
      case "LOW_STOCK":
        return "#f97316";
      case "ACCOUNT_BLOCKED":
      case "ACCOUNT_UNBLOCKED":
        return "#6366f1";
      default:
        return accentColor;
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const styles = {
    container: {
      position: "relative",
    },
    bellButton: {
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "12px",
      background: isDarkMode ? "rgba(20, 20, 28, 0.98)" : "#ffffff",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "rgba(0,0,0,0.05)"}`,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: accentColor,
      fontSize: `${fontSize}px`,
      transition: "all 0.3s ease",
      position: "relative",
    },
    badge: {
      position: "absolute",
      top: "-6px",
      right: "-6px",
      minWidth: "20px",
      height: "20px",
      borderRadius: "10px",
      background: "linear-gradient(135deg, #ef4444, #f87171)",
      color: "#fff",
      fontSize: "0.7rem",
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 4px",
      boxShadow: "0 2px 10px rgba(239, 68, 68, 0.4)",
      border: "2px solid var(--bg-primary, #fff)",
    },
    dropdown: {
      position: "absolute",
      top: "100%",
      right: 0,
      marginTop: "0.5rem",
      width: "380px",
      maxHeight: "500px",
      background: isDarkMode ? "rgba(20, 20, 28, 0.98)" : "#ffffff",
      borderRadius: "20px",
      boxShadow: isDarkMode 
        ? "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(201, 169, 98, 0.1)" 
        : "0 25px 60px rgba(0,0,0,0.15)",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "rgba(0,0,0,0.08)"}`,
      overflow: "hidden",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
    },
    dropdownHeader: {
      padding: "1rem 1.25rem",
      borderBottom: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.1)" : "#e2e8f0"}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dropdownTitle: {
      fontSize: "1rem",
      fontWeight: 700,
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
    },
    headerActions: {
      display: "flex",
      gap: "0.5rem",
    },
    headerBtn: {
      padding: "0.4rem 0.6rem",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontSize: "0.75rem",
      fontWeight: 600,
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.3rem",
    },
    markAllBtn: {
      background: `${accentColor}20`,
      color: accentColor,
    },
    clearBtn: {
      background: "rgba(239, 68, 68, 0.1)",
      color: "#ef4444",
    },
    notificationList: {
      flex: 1,
      overflowY: "auto",
      maxHeight: "400px",
    },
    notificationItem: (isRead) => ({
      padding: "1rem 1.25rem",
      display: "flex",
      gap: "1rem",
      alignItems: "flex-start",
      cursor: "pointer",
      transition: "all 0.2s ease",
      background: isRead 
        ? "transparent" 
        : (isDarkMode ? "rgba(201, 169, 98, 0.05)" : "rgba(59, 130, 246, 0.05)"),
      borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.03)" : "#f1f5f9"}`,
    }),
    iconContainer: (color) => ({
      width: "42px",
      height: "42px",
      borderRadius: "12px",
      background: `${color}20`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: color,
      fontSize: "1.1rem",
      flexShrink: 0,
    }),
    notificationContent: {
      flex: 1,
      minWidth: 0,
    },
    notificationTitle: (isRead) => ({
      fontSize: "0.9rem",
      fontWeight: isRead ? 500 : 700,
      color: isDarkMode ? (isRead ? "rgba(255,255,255,0.6)" : "#ffffff") : (isRead ? "#64748b" : "#0f172a"),
      margin: 0,
      flex: 1,
    }),
    notificationHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "0.3rem",
    },
    notificationMessage: {
      fontSize: "0.9rem",
      fontWeight: 500,
      color: isDarkMode ? "rgba(255,255,255,0.8)" : "#334155",
      lineHeight: 1.5,
      margin: "4px 0 0 0",
      padding: 0,
    },
    notificationTime: {
      fontSize: "0.7rem",
      color: isDarkMode ? "rgba(255,255,255,0.4)" : "#94a3b8",
    },
    viewLink: {
      fontSize: "0.75rem",
      color: accentColor,
      marginTop: "0.4rem",
      cursor: "pointer",
    },
    unreadDot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: accentColor,
      flexShrink: 0,
      marginTop: "0.5rem",
      boxShadow: `0 0 10px ${accentColor}`,
    },
    deleteBtn: {
      padding: "0.4rem",
      borderRadius: "8px",
      border: "none",
      background: "transparent",
      color: isDarkMode ? "rgba(255,255,255,0.3)" : "#cbd5e1",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    emptyState: {
      padding: "3rem 1.5rem",
      textAlign: "center",
    },
    emptyIcon: {
      fontSize: "3rem",
      marginBottom: "1rem",
      opacity: 0.5,
    },
    emptyText: {
      fontSize: "0.95rem",
      color: isDarkMode ? "rgba(255,255,255,0.5)" : "#64748b",
    },
    loadMoreBtn: {
      padding: "0.75rem",
      border: "none",
      background: `${accentColor}10`,
      color: accentColor,
      fontSize: "0.85rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s ease",
      width: "100%",
      textAlign: "center",
    },
    scrollbar: {
      scrollbarWidth: "thin",
      scrollbarColor: `${isDarkMode ? "#2a2a3a" : "#cbd5e1"} transparent`,
    },
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      <button
        style={styles.bellButton}
        onClick={() => {
          setShowDropdown(!showDropdown);
          if (!showDropdown) {
            fetchNotifications(true);
          }
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = `${accentColor}30`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span style={styles.badge}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <span style={styles.dropdownTitle}>
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </span>
            <div style={styles.headerActions}>
              {unreadCount > 0 && (
                <button
                  style={{ ...styles.headerBtn, ...styles.markAllBtn }}
                  onClick={markAllAsRead}
                  onMouseEnter={(e) => e.currentTarget.style.background = `${accentColor}30`}
                  onMouseLeave={(e) => e.currentTarget.style.background = `${accentColor}20`}
                >
                  <FaCheckDouble /> Mark All Read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  style={{ ...styles.headerBtn, ...styles.clearBtn }}
                  onClick={clearAll}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
                >
                  <FaTrash /> Clear
                </button>
              )}
            </div>
          </div>

          <div style={{ ...styles.notificationList, ...styles.scrollbar }}>
            {notifications.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🔔</div>
                <p style={styles.emptyText}>No notifications yet</p>
              </div>
            ) : (
              <>
                {notifications.map((notification) => {
                  const color = getColor(notification.type);
                  return (
                    <div
                      key={notification._id}
                      style={styles.notificationItem(!notification.isRead)}
                      onClick={() => handleNotificationClick(notification)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDarkMode 
                          ? "rgba(255,255,255,0.05)" 
                          : "#f8fafc";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = notification.isRead 
                          ? "transparent" 
                          : (isDarkMode ? "rgba(201, 169, 98, 0.05)" : "rgba(59, 130, 246, 0.05)");
                      }}
                    >
                      <div style={styles.iconContainer(color)}>
                        {getIcon(notification.type)}
                      </div>
                      <div style={styles.notificationContent}>
                        <div style={styles.notificationHeader}>
                          <p style={styles.notificationTitle(!notification.isRead)}>
                            {notification.title}
                          </p>
                          <span style={styles.notificationTime}>
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                        <p style={styles.notificationMessage}>
                          {notification.message}
                        </p>
                        {notification.link && (
                          <span style={styles.viewLink}>Click to view →</span>
                        )}
                      </div>
                      {!notification.isRead && <div style={styles.unreadDot} />}
                      <button
                        style={styles.deleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification._id);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                          e.currentTarget.style.color = "#ef4444";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = isDarkMode ? "rgba(255,255,255,0.3)" : "#cbd5e1";
                        }}
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  );
                })}
                {hasMore && (
                  <button
                    style={styles.loadMoreBtn}
                    onClick={loadMore}
                    disabled={loading}
                    onMouseEnter={(e) => e.currentTarget.style.background = `${accentColor}20`}
                    onMouseLeave={(e) => e.currentTarget.style.background = `${accentColor}10`}
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
