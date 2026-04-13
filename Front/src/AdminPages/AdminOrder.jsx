 
// src/AdminPages/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
 
const STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Shipped",
  "Out Of Delivery",
  "Delivered",
  "Confirmed",
  "Cancelled",
];
 
const STATUS_COLORS = {
  Pending: "#ffc107",
  Processing: "#17a2b8",
  Shipped: "#007bff",
  "Out Of Delivery": "#fd7e14",
  Delivered: "#28a745",
  Confirmed: "#6f42c1",
  Cancelled: "#dc3545",
};
 
export default function AdminOrders() {
  const { isDarkMode } = useTheme();
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const ordersPerPage = 10;
 
  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
 
  // Load all orders
  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/orders/admin/all");
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };
 
  // Load delivery boys
  const loadDeliveryBoys = async () => {
    try {
      const res = await apiFetch("/admin/users/delivery");
      setDeliveryBoys(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load delivery boys");
    }
  };
 
  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      await apiFetch(`/orders/admin/update/${orderId}`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    }
  };
 
  // Cancel order
  const cancelOrder = async (orderId) => {
    try {
      await apiFetch(`/orders/cancel/${orderId}`, { method: "PATCH" });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
      toast.success("Order cancelled!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
    }
  };
 
  // ✅ FIXED: Assign delivery boy with better state update
  const assignDeliveryBoy = async (orderId, deliveryBoyId) => {
    if (!deliveryBoyId) return;
 
    try {
      const res = await apiFetch(`/orders/admin/assign/${orderId}`, {
        method: "PATCH",
        body: { deliveryBoyId },
      });
 
      // ✅ Ensure deliveryBoy data is properly stored
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { 
                ...order, 
                deliveryBoy: res.data.deliveryBoy || deliveryBoys.find(b => b._id === deliveryBoyId),
                status: res.data.status || order.status 
              }
            : order
        )
      );
      toast.success("Delivery boy assigned!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign delivery boy");
    }
  };
 
  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
 
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
 
    return matchesSearch && matchesStatus;
  });
 
  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
 
  useEffect(() => {
    loadOrders();
    loadDeliveryBoys();
  }, []);

  const styles = {
    assignedContainer: {
      marginTop: "8px",
      padding: "6px 10px",
      backgroundColor: isDarkMode ? "rgba(52, 211, 153, 0.1)" : "#e8f5e9",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      flexWrap: "wrap",
    },
    assignedLabel: {
      fontSize: "0.8rem",
      color: isDarkMode ? "#34d399" : "#2e7d32",
      fontWeight: "500",
    },
    assignedName: {
      fontSize: "0.9rem",
      color: isDarkMode ? "#10b981" : "#1b5e20",
      fontWeight: "600",
    },
    blockedBadge: {
      fontSize: "0.7rem",
      padding: "2px 6px",
      backgroundColor: isDarkMode ? "rgba(248, 113, 113, 0.2)" : "#ffebee",
      color: isDarkMode ? "#f87171" : "#c62828",
      borderRadius: "4px",
      marginLeft: "4px",
    },
    notAssignedText: {
      margin: "5px 0 0 0",
      fontSize: "0.8rem",
      color: isDarkMode ? "#fbbf24" : "#ff9800",
      fontStyle: "italic",
    },
    mobileAssignedContainer: {
      marginTop: "8px",
      padding: "8px 12px",
      backgroundColor: isDarkMode ? "rgba(52, 211, 153, 0.1)" : "#e8f5e9",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    container: {
      padding: "20px",
      maxWidth: "1400px",
      margin: "0 auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      marginBottom: "30px",
      textAlign: "center",
    },
    title: {
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
      fontSize: "clamp(1.5rem, 5vw, 2rem)",
      marginBottom: "5px",
    },
    subtitle: {
      color: isDarkMode ? "rgba(255,255,255,0.5)" : "#64748b",
      fontSize: "clamp(0.9rem, 3vw, 1rem)",
    },
    filters: {
      display: "flex",
      flexDirection: "row",
      gap: "15px",
      marginBottom: "25px",
      flexWrap: "wrap",
    },
    searchInput: {
      flex: "2",
      minWidth: "250px",
      padding: "10px 15px",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`,
      borderRadius: "8px",
      fontSize: "1rem",
      outline: "none",
      transition: "border-color 0.3s",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#ffffff",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
    },
    statusFilter: {
      flex: "1",
      minWidth: "150px",
      padding: "10px 15px",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`,
      borderRadius: "8px",
      fontSize: "1rem",
      outline: "none",
      cursor: "pointer",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#ffffff",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
    },
    tableContainer: {
      overflowX: "auto",
      borderRadius: "12px",
      boxShadow: isDarkMode ? "0 10px 40px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.05)",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.6)" : "#ffffff",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "1000px",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.6)" : "#ffffff",
    },
    tableHeader: {
      backgroundColor: isDarkMode ? "rgba(20, 20, 30, 0.8)" : "#f8f9fa",
      borderBottom: `2px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#dee2e6"}`,
    },
    th: {
      padding: "15px",
      textAlign: "left",
      fontWeight: "600",
      color: isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b",
      fontSize: "0.9rem",
    },
    tableRow: {
      borderBottom: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.1)" : "#e9ecef"}`,
      transition: "background-color 0.2s",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
    },
    td: {
      padding: "15px",
      fontSize: "0.9rem",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
    },
    userInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
    },
    item: {
      marginBottom: "4px",
    },
    statusSelect: {
      padding: "6px 10px",
      borderRadius: "6px",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`,
      fontWeight: "500",
      cursor: "pointer",
      width: "130px",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#ffffff",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
    },
    assignSelect: {
      padding: "6px 10px",
      borderRadius: "6px",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`,
      width: "150px",
      cursor: "pointer",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#ffffff",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
    },
    assignedText: {
      margin: "5px 0 0 0",
      fontSize: "0.8rem",
      color: isDarkMode ? "rgba(255,255,255,0.5)" : "#666",
    },
    cancelButton: {
      backgroundColor: isDarkMode ? "#c9a962" : "#dc3545",
      color: isDarkMode ? "#0f172a" : "#fff",
      border: "none",
      padding: "6px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
      transition: "background-color 0.2s",
      width: "80px",
    },
    mobileCards: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    mobileCard: {
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.6)" : "#ffffff",
      borderRadius: "12px",
      padding: "15px",
      boxShadow: isDarkMode ? "0 10px 40px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.1)" : "#e2e8f0"}`,
    },
    mobileCardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
      paddingBottom: "10px",
      borderBottom: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.1)" : "#eee"}`,
    },
    orderId: {
      fontWeight: "bold",
      fontSize: "1.1rem",
      color: isDarkMode ? "#c9a962" : "#007bff",
    },
    mobileStatus: {
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: "500",
    },
    mobileCardBody: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    mobileInfo: {
      fontSize: "0.95rem",
      color: isDarkMode ? "#e8d5a3" : "#333",
    },
    mobileItem: {
      marginLeft: "15px",
      fontSize: "0.9rem",
      color: isDarkMode ? "rgba(255,255,255,0.5)" : "#666",
    },
    mobileSelect: {
      marginLeft: "10px",
      padding: "4px 8px",
      borderRadius: "6px",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`,
      width: "calc(100% - 70px)",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#ffffff",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
    },
    mobileCancelButton: {
      backgroundColor: isDarkMode ? "#c9a962" : "#dc3545",
      color: isDarkMode ? "#0f172a" : "#fff",
      border: "none",
      padding: "10px",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      marginTop: "10px",
      width: "100%",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "15px",
      marginTop: "25px",
      flexWrap: "wrap",
    },
    pageButton: {
      padding: "8px 16px",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#dee2e6"}`,
      borderRadius: "6px",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.6)" : "#ffffff",
      color: isDarkMode ? "#c9a962" : "#007bff",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    pageInfo: {
      color: isDarkMode ? "rgba(255,255,255,0.5)" : "#6c757d",
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "300px",
    },
    spinner: {
      width: "40px",
      height: "40px",
      border: `3px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#f3f3f3"}`,
      borderTop: `3px solid ${isDarkMode ? "#c9a962" : "#3498db"}`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginBottom: "15px",
    },
    noOrders: {
      textAlign: "center",
      padding: "50px",
      color: isDarkMode ? "rgba(255,255,255,0.5)" : "#666",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.6)" : "#ffffff",
      borderRadius: "12px",
      boxShadow: isDarkMode ? "0 10px 40px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.05)",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.1)" : "#e2e8f0"}`,
    },
  };

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p>Loading orders...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>All Orders</h2>
        <p style={styles.subtitle}>Total Orders: {orders.length}</p>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by order ID, user, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.statusFilter}
        >
          <option value="All">All Status</option>
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
 
      {filteredOrders.length === 0 ? (
        <div style={styles.noOrders}>
          <p>No orders found matching your criteria.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          {!isMobile && (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>User</th>
                    <th style={styles.th}>Items</th>
                    <th style={styles.th}>Total</th>
                    <th style={styles.th}>Payment</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Assign</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => {
                    const isDisabled = ["Delivered", "Cancelled"].includes(order.status);
 
                    // ✅ SAFE ACCESS: Get delivery boy name with fallback
                    const deliveryBoyName = order.deliveryBoy?.username || 
                                           order.deliveryBoy?.name || 
                                           "Not Assigned";
 
                    // ✅ Find if delivery boy exists in list
                    const currentDeliveryBoyId = order.deliveryBoy?._id || "";
 
                    return (
                      <tr 
                        key={order._id} 
                        style={styles.tableRow}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? "rgba(201, 169, 98, 0.05)" : "#f8f9fa"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <td style={styles.td}>#{order._id.slice(-6)}</td>
                        <td style={styles.td}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td style={styles.td}>
                          <div style={styles.userInfo}>
                            <strong>{order.user?.username || "Unknown"}</strong>
                            <small>{order.user?.email || "No email"}</small>
                          </div>
                        </td>
                        <td style={styles.td}>
                          {order.items?.map((item, idx) => (
                            <div key={idx} style={styles.item}>
                              {item.product?.name || "Deleted Product"} × {item.quantity}
                            </div>
                          ))}
                        </td>
                        <td style={styles.td}>₹{order.totalAmount || 0}</td>
                        <td style={styles.td}>{order.paymentMethod || "N/A"}</td>
                        <td style={styles.td}>
                          <select
                            value={order.status || "Pending"}
                            disabled={isDisabled}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            style={{
                              ...styles.statusSelect,
                              backgroundColor: STATUS_COLORS[order.status] + "20",
                              color: STATUS_COLORS[order.status],
                            }}
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={styles.td}>
                          <div>
                            <select
                              value={currentDeliveryBoyId}
                              disabled={isDisabled}
                              onChange={(e) => assignDeliveryBoy(order._id, e.target.value)}
                              style={styles.assignSelect}
                            >
                              <option value="">Select Delivery Boy</option>
                              {deliveryBoys.map((boy) => (
                                <option key={boy._id} value={boy._id}>
                                  {boy.username} {boy.isBlocked ? "(Blocked)" : ""}
                                </option>
                              ))}
                            </select>
 
                            {/* ✅ ALWAYS SHOW ASSIGNED DELIVERY BOY NAME */}
                            {order.deliveryBoy && (
                              <div style={styles.assignedContainer}>
                                <span style={styles.assignedLabel}>Assigned:</span>
                                <span style={styles.assignedName}>
                                  {deliveryBoyName}
                                </span>
                                {order.deliveryBoy.isBlocked && (
                                  <span style={styles.blockedBadge}>Blocked</span>
                                )}
                              </div>
                            )}
 
                            {!order.deliveryBoy && !isDisabled && (
                              <p style={styles.notAssignedText}>
                                Not assigned yet
                              </p>
                            )}
                          </div>
                        </td>
                        <td style={styles.td}>
                          {!isDisabled && (
                            <button
                              onClick={() => cancelOrder(order._id)}
                              style={styles.cancelButton}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? "#b8944d" : "#c82333"}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? "#c9a962" : "#dc3545"}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
 
          {/* Mobile Card View */}
          {isMobile && (
            <div style={styles.mobileCards}>
              {currentOrders.map((order) => {
                const isDisabled = ["Delivered", "Cancelled"].includes(order.status);
 
                // ✅ SAFE ACCESS for mobile
                const deliveryBoyName = order.deliveryBoy?.username || 
                                       order.deliveryBoy?.name || 
                                       "Not Assigned";
 
                const currentDeliveryBoyId = order.deliveryBoy?._id || "";
 
                return (
                  <div key={order._id} style={styles.mobileCard}>
                    <div style={styles.mobileCardHeader}>
                      <span style={styles.orderId}>#{order._id.slice(-6)}</span>
                      <span style={{
                        ...styles.mobileStatus,
                        backgroundColor: STATUS_COLORS[order.status] + "20",
                        color: STATUS_COLORS[order.status],
                      }}>
                        {order.status || "Pending"}
                      </span>
                    </div>
 
                    <div style={styles.mobileCardBody}>
                      <div style={styles.mobileInfo}>
                        <strong>User:</strong> {order.user?.username || "Unknown"}
                      </div>
                      <div style={styles.mobileInfo}>
                        <strong>Email:</strong> {order.user?.email || "No email"}
                      </div>
                      <div style={styles.mobileInfo}>
                        <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div style={styles.mobileInfo}>
                        <strong>Items:</strong>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={styles.mobileItem}>
                            {item.product?.name || "Deleted Product"} × {item.quantity}
                          </div>
                        ))}
                      </div>
                      <div style={styles.mobileInfo}>
                        <strong>Total:</strong> ₹{order.totalAmount || 0}
                      </div>
                      <div style={styles.mobileInfo}>
                        <strong>Payment:</strong> {order.paymentMethod || "N/A"}
                      </div>
 
                      <div style={styles.mobileInfo}>
                        <strong>Status:</strong>
                        <select
                          value={order.status || "Pending"}
                          disabled={isDisabled}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          style={styles.mobileSelect}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
 
                      <div style={styles.mobileInfo}>
                        <strong>Assign:</strong>
                        <select
                          value={currentDeliveryBoyId}
                          disabled={isDisabled}
                          onChange={(e) => assignDeliveryBoy(order._id, e.target.value)}
                          style={styles.mobileSelect}
                        >
                          <option value="">Select Delivery Boy</option>
                          {deliveryBoys.map((boy) => (
                            <option key={boy._id} value={boy._id}>
                              {boy.username}
                            </option>
                          ))}
                        </select>
 
                        {/* ✅ ALWAYS SHOW DELIVERY BOY NAME ON MOBILE */}
                        {order.deliveryBoy && (
                          <div style={styles.mobileAssignedContainer}>
                            <span style={styles.assignedLabel}>👤 Assigned:</span>
                            <span style={styles.assignedName}>
                              {deliveryBoyName}
                            </span>
                          </div>
                        )}
                      </div>
 
                      {!isDisabled && (
                        <button
                          onClick={() => cancelOrder(order._id)}
                          style={styles.mobileCancelButton}
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
 
          {/* Pagination */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={styles.pageButton}
              >
                Previous
              </button>
              <span style={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={styles.pageButton}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
 

 
 
 