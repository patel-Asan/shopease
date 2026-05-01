
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API, { getImageUrl } from "../api/api";
import { useTheme } from "../context/ThemeContext";
 
function AdminContact() {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState([]);
  const [removingMessageId, setRemovingMessageId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchMessages = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filterCategory !== "all") params.set("category", filterCategory);
    if (filterPriority !== "all") params.set("priority", filterPriority);
    if (filterStatus !== "all") params.set("status", filterStatus);

    API.get(`/contact?${params.toString()}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchMessages();
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) {
      Swal.fire("Error!", "Reply cannot be empty", "error");
      return;
    }
    try {
      const res = await API.post(`/contact/${id}/reply`, { reply: replyText });
      if (res.status === 200) {
        Swal.fire("Success!", "Reply sent successfully", "success");
        setReplyingId(null);
        setReplyText("");
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to send reply", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This message will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff4d4f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });
 
    if (!result.isConfirmed) return;
 
    try {
      const res = await API.delete(`/contact/${id}`);
      const data = res.data;
      if (res.status === 200) {
        setRemovingMessageId(id);
        setTimeout(() => {
          setMessages((prev) => prev.filter((msg) => msg._id !== id));
          setRemovingMessageId(null);
        }, 400);
 
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: data.message,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Error!", data.message || "Failed to delete message", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Something went wrong. Please try again later.", "error");
    }
  };

  const priorityColors = { urgent: "#ef4444", normal: "#3b82f6", low: "#10b981" };
  const categoryLabels = { complaint: "⚠️ Complaint", inquiry: "💬 Inquiry", feedback: "👍 Feedback", bug_report: "🐛 Bug" };

  const filterBarBg = isDarkMode ? "rgba(30,30,40,0.8)" : "#fff";
  const inputBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#f1f5f9";
  const inputText = isDarkMode ? "#e8d5a3" : "#0f172a";
  const optStyle = { background: isDarkMode ? "#1a1a2e" : "#fff", color: isDarkMode ? "#e8d5a3" : "#0f172a" };
  const btnBg = isDarkMode ? "#c9a962" : "#6366f1";
  const btnText = isDarkMode ? "#0f172a" : "#fff";
 
  const styles = {
    container: {
      padding: isMobile ? "1rem" : "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      textAlign: "center",
      marginBottom: isMobile ? "1.5rem" : "2rem",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
      fontSize: isMobile ? "1.5rem" : "2rem",
    },
    filterBar: {
      background: filterBarBg,
      borderRadius: "12px",
      padding: isMobile ? "16px" : "20px",
      marginBottom: "2rem",
      boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.05)",
    },
    filterRow: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      alignItems: "flex-end",
    },
    filterField: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      flex: isMobile ? "1 1 100%" : "1 1 180px",
    },
    filterLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: isDarkMode ? "#c9a962" : "#64748b",
    },
    filterInput: {
      padding: "10px 14px",
      borderRadius: "8px",
      border: `1px solid ${isDarkMode ? "rgba(201,169,98,0.2)" : "#e2e8f0"}`,
      background: inputBg,
      color: inputText,
      fontSize: "14px",
      outline: "none",
      fontFamily: "inherit",
    },
    filterBtn: {
      padding: "10px 24px",
      background: btnBg,
      color: btnText,
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: "14px",
      height: "42px",
    },
    messagesGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(380px, 1fr))",
      gap: "1.5rem",
    },
    messageCard: (isRemoving) => ({
      background: isDarkMode ? "rgba(30, 30, 40, 0.6)" : "#ffffff",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.1)" : "#e0e0e0"}`,
      borderRadius: "12px",
      padding: isMobile ? "1rem" : "1.5rem",
      boxShadow: isDarkMode ? "0 10px 40px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.05)",
      transition: "all 0.4s ease",
      transform: "translateY(0)",
      opacity: isRemoving ? 0 : 1,
      height: "fit-content",
      position: "relative",
      borderLeft: `4px solid ${!isDarkMode ? (removingMessageId ? "transparent" : "transparent") : "transparent"}`,
    }),
    unreadDot: {
      position: "absolute",
      top: "16px",
      right: "16px",
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      background: "#ef4444",
      boxShadow: "0 0 8px rgba(239,68,68,0.6)",
    },
    badges: {
      display: "flex",
      gap: "8px",
      marginBottom: "12px",
      flexWrap: "wrap",
    },
    badge: (bg) => ({
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      color: "#fff",
      background: bg,
    }),
    messageInfo: {
      margin: "0.3rem 0",
      fontSize: isMobile ? "0.9rem" : "1rem",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
    },
    replyBox: {
      marginTop: "12px",
      padding: "12px",
      background: isDarkMode ? "rgba(201,169,98,0.1)" : "#f0fdf4",
      borderRadius: "8px",
      borderLeft: `3px solid ${isDarkMode ? "#c9a962" : "#10b981"}`,
    },
    replyText: {
      fontSize: "13px",
      color: isDarkMode ? "#e8d5a3" : "#166534",
      lineHeight: "1.5",
    },
    replyInput: {
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      border: `1px solid ${isDarkMode ? "rgba(201,169,98,0.2)" : "#e2e8f0"}`,
      background: inputBg,
      color: inputText,
      fontSize: "14px",
      resize: "vertical",
      minHeight: "80px",
      outline: "none",
      fontFamily: "inherit",
      marginBottom: "8px",
      boxSizing: "border-box",
    },
    replyBtn: {
      padding: "8px 16px",
      background: isDarkMode ? "#c9a962" : "#10b981",
      color: isDarkMode ? "#0f172a" : "#fff",
      border: "none",
      borderRadius: "6px",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: "13px",
      marginRight: "8px",
    },
    replyCancelBtn: {
      padding: "8px 16px",
      background: isDarkMode ? "rgba(255,255,255,0.1)" : "#e5e7eb",
      color: isDarkMode ? "#e8d5a3" : "#374151",
      border: "none",
      borderRadius: "6px",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: "13px",
    },
    deleteBtn: {
      marginTop: "1.2rem",
      padding: isMobile ? "0.8rem" : "0.6rem 1.2rem",
      background: isDarkMode ? "#c9a962" : "#ff4d4f",
      color: isDarkMode ? "#0f172a" : "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.2s ease",
      width: isMobile ? "100%" : "auto",
    },
    replyBtnMain: {
      marginTop: "1.2rem",
      padding: isMobile ? "0.8rem" : "0.6rem 1.2rem",
      background: isDarkMode ? "rgba(201,169,98,0.2)" : "#e0f2fe",
      color: isDarkMode ? "#e8d5a3" : "#0284c7",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.2s ease",
      width: isMobile ? "100%" : "auto",
      marginRight: "8px",
    },
    noMessages: {
      textAlign: "center",
      color: isDarkMode ? "rgba(255,255,255,0.5)" : "#888",
      fontStyle: "italic",
      marginTop: "2rem",
      padding: "2rem",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.6)" : "#ffffff",
      borderRadius: "12px",
      boxShadow: isDarkMode ? "0 10px 40px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.05)",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.1)" : "#e2e8f0"}`,
    },
    attachments: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.8rem",
      marginTop: "1rem",
      justifyContent: isMobile ? "center" : "flex-start",
    },
    attachmentItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: isMobile ? "120px" : "150px",
    },
    attachmentImg: {
      width: "100%",
      height: "100px",
      objectFit: "cover",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    attachmentVideo: {
      width: "100%",
      height: "100px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    attachmentPdf: {
      textDecoration: "none",
      color: isDarkMode ? "#c9a962" : "#1890ff",
      fontWeight: "bold",
      marginTop: "0.5rem",
      fontSize: "0.85rem",
      textAlign: "center",
    },
  };
 
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>User Messages</h1>

      <form onSubmit={handleFilter} style={styles.filterBar}>
        <div style={styles.filterRow}>
          <div style={styles.filterField}>
            <label style={styles.filterLabel}>Search</label>
            <input style={styles.filterInput} placeholder="Name, email, message..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={styles.filterField}>
            <label style={styles.filterLabel}>Category</label>
            <select style={styles.filterInput} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all" style={optStyle}>All</option>
              <option value="complaint" style={optStyle}>Complaint</option>
              <option value="inquiry" style={optStyle}>Inquiry</option>
              <option value="feedback" style={optStyle}>Feedback</option>
              <option value="bug_report" style={optStyle}>Bug Report</option>
            </select>
          </div>
          <div style={styles.filterField}>
            <label style={styles.filterLabel}>Priority</label>
            <select style={styles.filterInput} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="all" style={optStyle}>All</option>
              <option value="urgent" style={optStyle}>Urgent</option>
              <option value="normal" style={optStyle}>Normal</option>
              <option value="low" style={optStyle}>Low</option>
            </select>
          </div>
          <div style={styles.filterField}>
            <label style={styles.filterLabel}>Status</label>
            <select style={styles.filterInput} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all" style={optStyle}>All</option>
              <option value="unread" style={optStyle}>Unread</option>
              <option value="replied" style={optStyle}>Replied</option>
            </select>
          </div>
          <button type="submit" style={styles.filterBtn}>🔍 Filter</button>
        </div>
      </form>

      {messages.length === 0 ? (
        <p style={styles.noMessages}>No messages found.</p>
      ) : (
        <div style={styles.messagesGrid}>
          {messages.map((msg) => (
            <div
              key={msg._id}
              style={styles.messageCard(removingMessageId === msg._id)}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = isDarkMode ? "0 15px 40px rgba(201, 169, 98, 0.2)" : "0 8px 20px rgba(0,0,0,0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = isDarkMode ? "0 10px 40px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.05)";
                }
              }}
            >
              {!msg.isRead && <div style={styles.unreadDot} />}
              <div style={styles.badges}>
                <span style={styles.badge(priorityColors[msg.priority] || "#667eea")}>
                  {msg.priority === "urgent" ? "🔴 Urgent" : msg.priority === "low" ? "🟢 Low" : "🔵 Normal"}
                </span>
                <span style={styles.badge("#8b5cf6")}>{categoryLabels[msg.category] || msg.category}</span>
              </div>
              <div style={styles.messageInfo}>
                <p><strong>Name:</strong> {msg.name}</p>
                <p><strong>Email:</strong> {msg.email}</p>
                <p><strong>Message:</strong> {msg.message}</p>
                <p style={{ fontSize: "12px", color: "#888" }}>{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
 
              {msg.attachments?.length > 0 && (
                <div style={styles.attachments}>
                  {msg.attachments.map((file, i) => (
                    <div key={i} style={styles.attachmentItem}>
                      {file.mimetype?.startsWith("image/") && (
                        <img src={getImageUrl(file.path)} alt={file.filename} style={styles.attachmentImg} />
                      )}
                      {file.mimetype?.startsWith("video/") && (
                        <video src={getImageUrl(file.path)} controls style={styles.attachmentVideo} />
                      )}
                      {file.mimetype === "application/pdf" && (
                        <a href={`http://localhost:5000/${file.path}`} target="_blank" rel="noreferrer" style={styles.attachmentPdf}>
                          📄 {file.filename.length > 15 ? file.filename.substring(0, 12) + "..." : file.filename}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {msg.reply && (
                <div style={styles.replyBox}>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: isDarkMode ? "#c9a962" : "#10b981", margin: "0 0 6px" }}>
                    ✅ Your Reply ({new Date(msg.replyAt).toLocaleString()}):
                  </p>
                  <p style={styles.replyText}>{msg.reply}</p>
                </div>
              )}

              <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                {replyingId === msg._id ? (
                  <>
                    <button onClick={() => handleReply(msg._id)} style={styles.replyBtn}>Send Reply</button>
                    <button onClick={() => { setReplyingId(null); setReplyText(""); }} style={styles.replyCancelBtn}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => { setReplyingId(msg._id); setReplyText(msg.reply || ""); }} style={styles.replyBtnMain}>
                    {msg.reply ? "Edit Reply" : "Reply"}
                  </button>
                )}
              </div>

              {replyingId === msg._id && (
                <textarea
                  style={styles.replyInput}
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              )}

              <button
                onClick={() => handleDelete(msg._id)}
                style={styles.deleteBtn}
                onMouseEnter={(e) => {
                  if (!isMobile) e.currentTarget.style.background = isDarkMode ? "#b8944d" : "#d9363e";
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) e.currentTarget.style.background = isDarkMode ? "#c9a962" : "#ff4d4f";
                }}
              >
                Delete Message
              </button>
            </div>
          ))}
        </div>
      )}
      <style>{`
        select option {
          background: ${isDarkMode ? '#1a1a2e' : '#ffffff'};
          color: ${isDarkMode ? '#e8d5a3' : '#0f172a'};
          padding: 8px;
        }
        select {
          background: ${isDarkMode ? 'rgba(255,255,255,0.08)' : '#f1f5f9'};
          color: ${isDarkMode ? '#e8d5a3' : '#0f172a'};
        }
      `}</style>
    </div>
  );
}
 
export default AdminContact;
