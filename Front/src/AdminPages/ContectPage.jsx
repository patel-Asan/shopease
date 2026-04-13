
// src/AdminPages/ContectPage.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useTheme } from "../context/ThemeContext";
 
function AdminContact() {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState([]);
  const [removingMessageId, setRemovingMessageId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
 
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
 
  const fetchMessages = () => {
    fetch("http://localhost:5000/api/contact")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error(err));
  };
 
  useEffect(() => {
    fetchMessages();
  }, []);
 
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
      const res = await fetch(`http://localhost:5000/api/contact/${id}`, {
        method: "DELETE",
      });
 
      const data = await res.json();
 
      if (res.ok) {
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
    messagesGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(350px, 1fr))",
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
    }),
    messageInfo: {
      margin: "0.3rem 0",
      fontSize: isMobile ? "0.9rem" : "1rem",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
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
  };
 
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>User Messages</h1>
      {messages.length === 0 ? (
        <p style={styles.noMessages}>No messages yet.</p>
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
              <div style={styles.messageInfo}>
                <p><strong>Name:</strong> {msg.name}</p>
                <p><strong>Email:</strong> {msg.email}</p>
                <p><strong>Message:</strong> {msg.message}</p>
              </div>
 
              {msg.attachments?.length > 0 && (
                <div style={styles.attachments}>
                  {msg.attachments.map((file, i) => (
                    <div key={i} style={styles.attachmentItem}>
                      {file.mimetype?.startsWith("image/") && (
                        <img
                          src={`http://localhost:5000/${file.path}`}
                          alt={file.filename}
                          style={styles.attachmentImg}
                        />
                      )}
                      {file.mimetype?.startsWith("video/") && (
                        <video
                          src={`http://localhost:5000/${file.path}`}
                          controls
                          style={styles.attachmentVideo}
                        />
                      )}
                      {file.mimetype === "application/pdf" && (
                        <a
                          href={`http://localhost:5000/${file.path}`}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.attachmentPdf}
                        >
                          📄 {file.filename.length > 15 
                            ? file.filename.substring(0, 12) + "..." 
                            : file.filename}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
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
    </div>
  );
}
 
export default AdminContact;