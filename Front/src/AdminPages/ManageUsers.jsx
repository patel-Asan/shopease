
// src/AdminPages/ManageUsers.jsx
import React, { useEffect, useState, useCallback } from "react";
import API from "../api/api";
import { FaUsers, FaSearch, FaUserCheck, FaUserTimes, FaTrash, FaUserShield, FaEnvelope, FaTruck } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const Modal = ({ title, children, onConfirm, onCancel }) => {
  const { isDarkMode } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const styles = {
    backdrop: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(8px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.95)" : "#ffffff",
      padding: isMobile ? "1.5rem" : "2rem",
      borderRadius: "20px",
      width: "90%",
      maxWidth: "400px",
      textAlign: "center",
      boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "rgba(0,0,0,0.05)"}`,
    },
    title: {
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
      marginBottom: "1rem",
      fontSize: isMobile ? "1.2rem" : "1.5rem",
      fontWeight: 700,
    },
    content: {
      color: isDarkMode ? "rgba(255,255,255,0.7)" : "#64748b",
      marginBottom: "1.5rem",
      fontSize: isMobile ? "0.95rem" : "1rem",
      lineHeight: 1.6,
    },
    buttonContainer: {
      display: "flex",
      gap: "12px",
      justifyContent: "center",
      flexDirection: isMobile ? "column" : "row",
    },
    confirmButton: {
      padding: isMobile ? "14px" : "12px 24px",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
      color: "white",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "0.95rem",
      flex: isMobile ? 1 : "none",
      transition: "all 0.3s ease",
    },
    cancelButton: {
      padding: isMobile ? "14px" : "12px 24px",
      borderRadius: "12px",
      border: "1px solid var(--border-color)",
      background: "var(--bg-primary)",
      color: "var(--text-primary)",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "0.95rem",
      flex: isMobile ? 1 : "none",
      transition: "all 0.3s ease",
    },
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.content}>{children}</p>
        <div style={styles.buttonContainer}>
          <button style={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button style={styles.confirmButton} onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageUsers = () => {
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const usersPerPage = isMobile ? 5 : 7;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Session expired. Please login again.");
    return token;
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deleteUser = async (id) => {
    try {
      setActionLoading(id);
      await API.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers((prev) => {
        const updated = prev.filter((user) => user._id !== id);
        if ((currentPage - 1) * usersPerPage >= updated.length && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
        return updated;
      });
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleBlock = async (id) => {
    try {
      setActionLoading(id);
      await axios.patch(
        `/admin/users/block/${id}`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isBlocked: !user.isBlocked } : user
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const styles = {
    container: {
      padding: isMobile ? "1rem" : "1.5rem",
      maxWidth: "1400px",
      margin: "0 auto",
      minHeight: "100vh",
    },
    header: {
      marginBottom: "1.5rem",
    },
    headerTop: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      marginBottom: "1rem",
    },
    iconContainer: {
      width: isMobile ? "45px" : "50px",
      height: isMobile ? "45px" : "50px",
      borderRadius: "14px",
      background: isDarkMode 
        ? "linear-gradient(135deg, #c9a962 0%, #d4b87a 100%)"
        : "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: isMobile ? "1.2rem" : "1.3rem",
      color: isDarkMode ? "#0f172a" : "#fff",
      boxShadow: isDarkMode 
        ? "0 8px 25px rgba(201, 169, 98, 0.4)"
        : "0 8px 25px rgba(139, 92, 246, 0.4)",
    },
    title: {
      fontSize: isMobile ? "1.3rem" : "1.6rem",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
      margin: 0,
      fontWeight: 700,
    },
    subtitle: {
      color: isDarkMode ? "rgba(255,255,255,0.5)" : "#64748b",
      fontSize: isMobile ? "0.85rem" : "0.95rem",
      marginTop: "0.25rem",
    },
    searchContainer: {
      position: "relative",
    },
    searchIcon: {
      position: "absolute",
      left: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      color: isDarkMode ? "rgba(255,255,255,0.4)" : "#94a3b8",
    },
    searchInput: {
      width: "100%",
      padding: isMobile ? "12px 12px 12px 42px" : "14px 14px 14px 44px",
      border: `2px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`,
      borderRadius: "14px",
      fontSize: "0.95rem",
      background: isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#ffffff",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
      transition: "all 0.3s ease",
    },
    tableContainer: {
      overflowX: "auto",
      borderRadius: "16px",
      boxShadow: isDarkMode ? "0 10px 40px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.08)",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.6)" : "#ffffff",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.1)" : "#e2e8f0"}`,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: isMobile ? "100%" : "900px",
    },
    th: {
      padding: isMobile ? "12px" : "16px",
      textAlign: "left",
      backgroundColor: isDarkMode ? "rgba(20, 20, 30, 0.8)" : "#f8fafc",
      color: isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b",
      borderBottom: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.1)" : "#e2e8f0"}`,
      fontSize: isMobile ? "0.85rem" : "0.9rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    td: {
      padding: isMobile ? "12px" : "16px",
      borderBottom: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.1)" : "#e2e8f0"}`,
      fontSize: isMobile ? "0.85rem" : "0.95rem",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
    },
    mobileCards: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    mobileCard: {
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.6)" : "#ffffff",
      borderRadius: "16px",
      padding: "1rem",
      boxShadow: isDarkMode ? "0 10px 40px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.08)",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.1)" : "#e2e8f0"}`,
    },
    mobileCardRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "0.75rem",
      paddingBottom: "0.75rem",
      borderBottom: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.1)" : "#e2e8f0"}`,
    },
    mobileLabel: {
      fontWeight: 600,
      color: isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b",
      fontSize: "0.85rem",
    },
    mobileValue: {
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
      fontSize: "0.9rem",
    },
    mobileActions: {
      display: "flex",
      gap: "8px",
      marginTop: "0.75rem",
    },
    statusActive: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: isDarkMode ? "rgba(52, 211, 153, 0.15)" : "rgba(16, 185, 129, 0.15)",
      color: isDarkMode ? "#34d399" : "#10b981",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: 600,
    },
    statusBlocked: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: isDarkMode ? "rgba(248, 113, 113, 0.15)" : "rgba(239, 68, 68, 0.15)",
      color: isDarkMode ? "#f87171" : "#ef4444",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: 600,
    },
    roleBadge: (role) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      background: role === "admin" 
        ? isDarkMode ? "rgba(201, 169, 98, 0.2)" : "rgba(139, 92, 246, 0.15)"
        : role === "delivery"
        ? isDarkMode ? "rgba(251, 191, 36, 0.2)" : "rgba(245, 158, 11, 0.15)"
        : isDarkMode ? "rgba(148, 163, 184, 0.15)" : "rgba(148, 163, 184, 0.15)",
      color: role === "admin" ? (isDarkMode ? "#c9a962" : "#a78bfa") : role === "delivery" ? (isDarkMode ? "#fbbf24" : "#f59e0b") : (isDarkMode ? "#94a3b8" : "#64748b"),
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: 600,
    }),
    button: (variant) => {
      const variants = {
        block: {
          bg: isDarkMode ? "linear-gradient(135deg, #c9a962 0%, #d4b87a 100%)" : "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
        },
        unblock: {
          bg: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
        },
        delete: {
          bg: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
        },
      };
      return {
        padding: isMobile ? "10px 14px" : "8px 16px",
        borderRadius: "10px",
        border: "none",
        background: variants[variant].bg,
        color: variant === "block" && isDarkMode ? "#0f172a" : "white",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "0.85rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        transition: "all 0.3s ease",
      };
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: isMobile ? "6px" : "10px",
      marginTop: "2rem",
      flexWrap: "wrap",
    },
    pageButton: (active) => ({
      padding: isMobile ? "8px 14px" : "10px 18px",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`,
      borderRadius: "10px",
      background: active 
        ? (isDarkMode ? "linear-gradient(135deg, #c9a962 0%, #d4b87a 100%)" : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)")
        : (isDarkMode ? "rgba(30, 30, 40, 0.6)" : "#ffffff"),
      color: active ? (isDarkMode ? "#0f172a" : "#fff") : (isDarkMode ? "#e8d5a3" : "#0f172a"),
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "0.9rem",
      transition: "all 0.3s ease",
    }),
    loadingContainer: {
      textAlign: "center",
      padding: "4rem",
    },
    spinner: {
      width: "50px",
      height: "50px",
      border: `4px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`,
      borderTop: `4px solid ${isDarkMode ? "#c9a962" : "#6366f1"}`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto 1rem",
    },
    error: {
      color: isDarkMode ? "#f87171" : "#ef4444",
      textAlign: "center",
      padding: "2rem",
      background: isDarkMode ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.1)",
      borderRadius: "16px",
      margin: "2rem 0",
    },
    emptyState: {
      textAlign: "center",
      padding: "4rem 2rem",
      color: isDarkMode ? "rgba(255,255,255,0.4)" : "#94a3b8",
    },
  };

  if (error) return <div style={styles.error}>{error}</div>;

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={{ color: isDarkMode ? "rgba(255,255,255,0.5)" : "#64748b" }}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.iconContainer}>
            <FaUsers style={{ color: "#fff" }} />
          </div>
          <div>
            <h1 style={styles.title}>Manage Users</h1>
            <p style={styles.subtitle}>{users.length} total users</p>
          </div>
        </div>
        <div style={styles.searchContainer}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => {
              e.target.style.borderColor = isDarkMode ? "#c9a962" : "#6366f1";
              e.target.style.boxShadow = isDarkMode ? "0 0 0 4px rgba(201, 169, 98, 0.15)" : "0 0 0 4px rgba(99, 102, 241, 0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {!isMobile ? (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr
                  key={user._id}
                  style={{ transition: "background 0.3s ease" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? "rgba(201, 169, 98, 0.05)" : "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <td style={styles.td}>{indexOfFirstUser + index + 1}</td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.9rem"
                      }}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500 }}>{user.username}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FaEnvelope style={{ color: isDarkMode ? "rgba(255,255,255,0.4)" : "#94a3b8" }} />
                      {user.email}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.roleBadge(user.role)}>
                      {user.role === "admin" && <FaUserShield />}
                      {user.role === "delivery" && <FaTruck />}
                      {user.role === "user" && <FaUsers />}
                      {user.role}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {user.isBlocked ? (
                      <span style={styles.statusBlocked}>
                        <FaUserTimes /> Blocked
                      </span>
                    ) : (
                      <span style={styles.statusActive}>
                        <FaUserCheck /> Active
                      </span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        disabled={actionLoading === user._id}
                        onClick={() => toggleBlock(user._id)}
                        style={styles.button(user.isBlocked ? "unblock" : "block")}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                      <button
                        disabled={actionLoading === user._id}
                        onClick={() => { setSelectedUserId(user._id); setShowModal(true); }}
                        style={styles.button("delete")}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.mobileCards}>
          {currentUsers.map((user, index) => (
            <div key={user._id} style={styles.mobileCard}>
              <div style={styles.mobileCardRow}>
                <span style={styles.mobileLabel}>#</span>
                <span style={styles.mobileValue}>{indexOfFirstUser + index + 1}</span>
              </div>
              <div style={styles.mobileCardRow}>
                <span style={styles.mobileLabel}>Username</span>
                <span style={styles.mobileValue}>{user.username}</span>
              </div>
              <div style={styles.mobileCardRow}>
                <span style={styles.mobileLabel}>Email</span>
                <span style={styles.mobileValue}>{user.email}</span>
              </div>
              <div style={styles.mobileCardRow}>
                <span style={styles.mobileLabel}>Role</span>
                <span style={styles.roleBadge(user.role)}>{user.role}</span>
              </div>
              <div style={styles.mobileCardRow}>
                <span style={styles.mobileLabel}>Status</span>
                {user.isBlocked ? (
                  <span style={styles.statusBlocked}>Blocked</span>
                ) : (
                  <span style={styles.statusActive}>Active</span>
                )}
              </div>
              <div style={styles.mobileActions}>
                <button
                  disabled={actionLoading === user._id}
                  onClick={() => toggleBlock(user._id)}
                  style={{ ...styles.button(user.isBlocked ? "unblock" : "block"), flex: 1 }}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
                <button
                  disabled={actionLoading === user._id}
                  onClick={() => { setSelectedUserId(user._id); setShowModal(true); }}
                  style={{ ...styles.button("delete"), flex: 1 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            style={styles.pageButton(false)}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={styles.pageButton(currentPage === page)}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={styles.pageButton(false)}
          >
            Next
          </button>
        </div>
      )}

      {showModal && (
        <Modal
          title="Confirm Delete"
          onConfirm={() => deleteUser(selectedUserId)}
          onCancel={() => setShowModal(false)}
        >
          Are you sure you want to delete this user? This action cannot be undone.
        </Modal>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ManageUsers;
