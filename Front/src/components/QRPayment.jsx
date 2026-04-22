import React, { useState, useEffect } from "react";
import { generateQRCode } from "../api/api";
import { FaQrcode, FaCheck, FaClock, FaTimes, FaDownload } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const QRPayment = ({ amount, orderId, customerName, onSuccess, onCancel }) => {
  const { isDarkMode } = useTheme();
  const [qrData, setQRData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const accentColor = "#c9a962";
  const accentLight = "#e8d5a3";

  useEffect(() => {
    generateQR();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const generateQR = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await generateQRCode({
        amount,
        orderId,
        customerName,
        note: `ShopEase Order ${orderId}`
      });
      setQRData(response.data);
      setTimeLeft(response.data.expiresIn || 300);
    } catch (err) {
      setError("Failed to generate QR code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleConfirmPayment = () => {
    setPaymentConfirmed(true);
    if (onSuccess) onSuccess();
  };

  const handleDownload = () => {
    if (!qrData?.qrCodeImage) return;
    const link = document.createElement("a");
    link.download = `payment-qr-${orderId}.png`;
    link.href = qrData.qrCodeImage;
    link.click();
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "1.5rem",
      background: isDarkMode ? "rgba(20, 20, 28, 0.98)" : "#ffffff",
      borderRadius: "20px",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`,
      maxWidth: "360px",
      margin: "0 auto",
      boxShadow: isDarkMode 
        ? "0 20px 60px rgba(0,0,0,0.5)" 
        : "0 20px 60px rgba(0,0,0,0.1)",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "1.5rem",
    },
    headerIcon: {
      width: "48px",
      height: "48px",
      borderRadius: "14px",
      background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    headerText: {
      display: "flex",
      flexDirection: "column",
    },
    title: {
      fontSize: "1.2rem",
      fontWeight: 700,
      color: isDarkMode ? "#ffffff" : "#0f172a",
      margin: 0,
    },
    subtitle: {
      fontSize: "0.85rem",
      color: isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b",
      margin: 0,
    },
    timerBox: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 20px",
      borderRadius: "12px",
      background: timeLeft <= 60 
        ? "rgba(239, 68, 68, 0.1)" 
        : (isDarkMode ? "rgba(201, 169, 98, 0.1)" : "rgba(201, 169, 98, 0.1)"),
      border: `1px solid ${timeLeft <= 60 ? "rgba(239, 68, 68, 0.3)" : "rgba(201, 169, 98, 0.3)"}`,
      marginBottom: "1rem",
    },
    timerText: {
      fontSize: "1rem",
      fontWeight: 700,
      color: timeLeft <= 60 ? "#ef4444" : accentColor,
    },
    qrContainer: {
      padding: "16px",
      background: "#ffffff",
      borderRadius: "16px",
      marginBottom: "1rem",
      boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
    },
    qrImage: {
      width: "200px",
      height: "200px",
      display: "block",
    },
    amountBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "16px",
      background: isDarkMode ? "rgba(201, 169, 98, 0.1)" : "rgba(201, 169, 98, 0.1)",
      borderRadius: "12px",
      marginBottom: "1rem",
      width: "100%",
    },
    amountLabel: {
      fontSize: "0.8rem",
      color: isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b",
      marginBottom: "4px",
    },
    amountValue: {
      fontSize: "1.8rem",
      fontWeight: 800,
      background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    upiBox: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 16px",
      background: isDarkMode ? "rgba(255,255,255,0.05)" : "#f8fafc",
      borderRadius: "10px",
      marginBottom: "1rem",
      width: "100%",
    },
    upiText: {
      fontSize: "0.9rem",
      color: isDarkMode ? "rgba(255,255,255,0.8)" : "#334155",
      fontWeight: 500,
    },
    instructions: {
      fontSize: "0.85rem",
      color: isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b",
      textAlign: "center",
      marginBottom: "1rem",
      lineHeight: 1.6,
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      width: "100%",
    },
    confirmBtn: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "14px",
      borderRadius: "12px",
      background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
      border: "none",
      color: "#0f172a",
      fontSize: "0.95rem",
      fontWeight: 700,
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: `0 8px 25px ${accentColor}30`,
    },
    cancelBtn: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "14px",
      borderRadius: "12px",
      background: isDarkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9",
      border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
      color: isDarkMode ? "rgba(255,255,255,0.7)" : "#64748b",
      fontSize: "0.95rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    downloadBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "10px 16px",
      borderRadius: "10px",
      background: "transparent",
      border: `1px solid ${accentColor}`,
      color: accentColor,
      fontSize: "0.85rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "0.5rem",
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "3rem",
    },
    spinner: {
      width: "48px",
      height: "48px",
      border: `4px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`,
      borderTop: `4px solid ${accentColor}`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginBottom: "1rem",
    },
    errorContainer: {
      textAlign: "center",
      padding: "2rem",
    },
    errorText: {
      fontSize: "0.95rem",
      color: "#ef4444",
      marginBottom: "1rem",
    },
    retryBtn: {
      padding: "12px 24px",
      borderRadius: "10px",
      background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
      border: "none",
      color: "#0f172a",
      fontSize: "0.9rem",
      fontWeight: 600,
      cursor: "pointer",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={{ color: isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b" }}>
            Generating QR Code...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error}</p>
          <button style={styles.retryBtn} onClick={generateQR}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (paymentConfirmed) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(34, 197, 94, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
          }}>
            <FaCheck style={{ fontSize: "32px", color: "#22c55e" }} />
          </div>
          <h3 style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#22c55e",
            marginBottom: "0.5rem",
          }}>
            Payment Initiated!
          </h3>
          <p style={{
            fontSize: "0.9rem",
            color: isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b",
          }}>
            Your payment request has been initiated. Admin will confirm once payment is received.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <FaQrcode style={{ color: "#fff", fontSize: "24px" }} />
        </div>
        <div style={styles.headerText}>
          <h3 style={styles.title}>Pay with QR Code</h3>
          <p style={styles.subtitle}>Scan to pay ₹{amount}</p>
        </div>
      </div>

      <div style={styles.timerBox}>
        <FaClock style={{ color: timeLeft <= 60 ? "#ef4444" : accentColor }} />
        <span style={styles.timerText}>
          Expires in {formatTime(timeLeft)}
        </span>
      </div>

      <div style={styles.qrContainer}>
        <img 
          src={qrData?.qrCodeImage} 
          alt="Payment QR Code" 
          style={styles.qrImage}
        />
      </div>

      <button style={styles.downloadBtn} onClick={handleDownload}>
        <FaDownload /> Download QR
      </button>

      <div style={styles.amountBox}>
        <span style={styles.amountLabel}>Pay Amount</span>
        <span style={styles.amountValue}>₹{qrData?.amount || amount}</span>
      </div>

      <div style={styles.upiBox}>
        <span style={styles.upiText}>UPI ID: {qrData?.upiId}</span>
      </div>

      <p style={styles.instructions}>
        1. Open PhonePe / Google Pay / Paytm<br/>
        2. Scan the QR code or pay to UPI ID<br/>
        3. Complete payment and click below
      </p>

      <div style={styles.buttonGroup}>
        <button style={styles.cancelBtn} onClick={onCancel}>
          <FaTimes /> Cancel
        </button>
        <button style={styles.confirmBtn} onClick={handleConfirmPayment}>
          <FaCheck /> I've Paid
        </button>
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

export default QRPayment;