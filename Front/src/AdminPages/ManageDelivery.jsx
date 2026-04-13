
// src/AdminPages/ManageDelivery.jsx
import React, { useEffect, useState } from "react";
import { getAllDeliveryBoys, createDeliveryBoy, deleteDeliveryBoy, toggleBlockDeliveryBoy } from "../api/api";
import Swal from "sweetalert2";
import { useTheme } from "../context/ThemeContext";

const ManageDelivery = () => {
  const { isDarkMode } = useTheme();
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
 
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
 
  const fetchDeliveryBoys = async () => {
    try {
      const data = await getAllDeliveryBoys();
      setDeliveryBoys(data.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch delivery boys", "error");
    }
  };
 
  useEffect(() => {
    fetchDeliveryBoys();
  }, []);
 
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createDeliveryBoy(formData);
      Swal.fire("Success", "Delivery boy created", "success");
      setFormData({ username: "", email: "", password: "" });
      setShowForm(false);
      fetchDeliveryBoys();
    } catch (err) {
      Swal.fire("Error", "Failed to create delivery boy", "error");
    }
  };
 
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
 
    if (result.isConfirmed) {
      try {
        await deleteDeliveryBoy(id);
        Swal.fire("Deleted!", "Delivery boy has been deleted.", "success");
        fetchDeliveryBoys();
      } catch (err) {
        Swal.fire("Error", "Failed to delete delivery boy", "error");
      }
    }
  };
 
  const handleBlockToggle = async (id) => {
    try {
      await toggleBlockDeliveryBoy(id);
      Swal.fire("Success", "Status updated", "success");
      fetchDeliveryBoys();
    } catch (err) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };
 
  // Filter and paginate
  const filteredBoys = deliveryBoys.filter(boy => 
    boy.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    boy.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBoys.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBoys.length / itemsPerPage);
 
  const styles = {
    container: {
      padding: isMobile ? "15px" : "20px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "15px" : "0",
    },
    title: {
      fontSize: isMobile ? "1.3rem" : "2rem",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
      margin: 0,
    },
    addButton: {
      padding: isMobile ? "10px 20px" : "8px 16px",
      border: "none",
      borderRadius: "5px",
      backgroundColor: isDarkMode ? "#c9a962" : "#007bff",
      color: isDarkMode ? "#0f172a" : "#fff",
      cursor: "pointer",
      width: isMobile ? "100%" : "auto",
    },
    searchInput: {
      width: "100%",
      padding: "10px",
      marginBottom: "20px",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`,
      borderRadius: "8px",
      fontSize: "1rem",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#ffffff",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
    },
    formContainer: {
      padding: "20px",
      margin: "20px 0",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`,
      borderRadius: "8px",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.4)" : "#f8f9fa",
    },
    formInput: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#ced4da"}`,
      borderRadius: "5px",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#ffffff",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
    },
    submitButton: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      backgroundColor: "#28a745",
      color: "#fff",
      cursor: "pointer",
      width: isMobile ? "100%" : "auto",
    },
    // Desktop table styles
    tableContainer: {
      overflowX: "auto",
      borderRadius: "8px",
      boxShadow: isDarkMode ? "0 10px 40px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.05)",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.6)" : "#ffffff",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "800px",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.6)" : "#ffffff",
    },
    th: {
      padding: "12px",
      textAlign: "left",
      backgroundColor: isDarkMode ? "rgba(20, 20, 30, 0.8)" : "#e9ecef",
      borderBottom: `2px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#dee2e6"}`,
      color: isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b",
    },
    td: {
      padding: "12px",
      borderBottom: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.1)" : "#dee2e6"}`,
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
    },
    // Mobile card styles
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
    mobileCardRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
      paddingBottom: "10px",
      borderBottom: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.1)" : "#eee"}`,
    },
    mobileLabel: {
      fontWeight: "bold",
      color: isDarkMode ? "rgba(255,255,255,0.5)" : "#555",
    },
    mobileValue: {
      color: isDarkMode ? "#e8d5a3" : "#333",
    },
    mobileActions: {
      display: "flex",
      gap: "10px",
      marginTop: "10px",
    },
    badge: (blocked) => ({
      display: "inline-block",
      padding: "4px 8px",
      borderRadius: "12px",
      color: "#fff",
      backgroundColor: blocked ? (isDarkMode ? "#f87171" : "#dc3545") : (isDarkMode ? "#34d399" : "#28a745"),
      fontSize: "12px",
    }),
    button: (color) => ({
      padding: isMobile ? "8px 15px" : "5px 10px",
      border: "none",
      borderRadius: "5px",
      color: "#fff",
      cursor: "pointer",
      backgroundColor: color,
      flex: isMobile ? 1 : "none",
    }),
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
      marginTop: "20px",
      flexWrap: "wrap",
    },
    pageButton: {
      padding: "8px 12px",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#dee2e6"}`,
      borderRadius: "5px",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.6)" : "#ffffff",
      color: isDarkMode ? "#c9a962" : "#007bff",
      cursor: "pointer",
    },
  };
 
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Manage Delivery Boys</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={styles.addButton}
        >
          {showForm ? "Cancel" : "+ Add Delivery Boy"}
        </button>
      </div>
 
      <input
        type="text"
        placeholder="Search by username or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />
 
      {showForm && (
  <form onSubmit={handleCreate} style={styles.formContainer}>
    <input
      type="text"
      placeholder="Username"
      value={formData.username}
      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      required
      style={styles.formInput}
      autoComplete="username" // ✅ Added for username
    />
    <input
      type="email"
      placeholder="Email"
      value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      required
      style={styles.formInput}
      autoComplete="email" // ✅ Added for email
    />
    <input
      type="password"
      placeholder="Password"
      value={formData.password}
      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      required
      style={styles.formInput}
      autoComplete="new-password" // ✅ This is the key fix for the warning
    />
    <button type="submit" style={styles.submitButton}>
      Create Delivery Boy
    </button>
  </form>
)}
 
      {/* Desktop Table View */}
      {!isMobile && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((d) => (
                <tr
                  key={d._id}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? "rgba(201, 169, 98, 0.05)" : "#f8f9fa"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <td style={styles.td}>{d._id.slice(-6)}</td>
                  <td style={styles.td}>{d.username}</td>
                  <td style={styles.td}>{d.email}</td>
                  <td style={styles.td}>
                    <span style={styles.badge(d.isBlocked)}>
                      {d.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleBlockToggle(d._id)}
                      style={styles.button(d.isBlocked ? "#28a745" : "#ffc107")}
                    >
                      {d.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      onClick={() => handleDelete(d._id)}
                      style={{ ...styles.button("#dc3545"), marginLeft: "5px" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
 
      {/* Mobile Card View */}
      {isMobile && (
        <div style={styles.mobileCards}>
          {currentItems.map((d) => (
            <div key={d._id} style={styles.mobileCard}>
              <div style={styles.mobileCardRow}>
                <span style={styles.mobileLabel}>ID:</span>
                <span style={styles.mobileValue}>#{d._id.slice(-6)}</span>
              </div>
              <div style={styles.mobileCardRow}>
                <span style={styles.mobileLabel}>Username:</span>
                <span style={styles.mobileValue}>{d.username}</span>
              </div>
              <div style={styles.mobileCardRow}>
                <span style={styles.mobileLabel}>Email:</span>
                <span style={styles.mobileValue}>{d.email}</span>
              </div>
              <div style={styles.mobileCardRow}>
                <span style={styles.mobileLabel}>Status:</span>
                <span style={styles.badge(d.isBlocked)}>
                  {d.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
              <div style={styles.mobileActions}>
                <button
                  onClick={() => handleBlockToggle(d._id)}
                  style={styles.button(d.isBlocked ? "#28a745" : "#ffc107")}
                >
                  {d.isBlocked ? "Unblock" : "Block"}
                </button>
                <button
                  onClick={() => handleDelete(d._id)}
                  style={styles.button("#dc3545")}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
 
      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            style={styles.pageButton}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
 
export default ManageDelivery;