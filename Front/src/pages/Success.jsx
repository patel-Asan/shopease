import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheck, FaBox, FaArrowRight, FaClock } from "react-icons/fa";

function Success() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const orderId = search.get("orderId") || "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const [countdown, setCountdown] = useState(5);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/orders");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const accentColor = "#10b981";
  const accentLight = "#34d399";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1e2e 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        top: "-20%",
        right: "-10%",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(16,185,129,.15) 0%, transparent 70%)",
        filter: "blur(80px)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-20%",
        left: "-10%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,.12) 0%, transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: "480px",
        width: "100%",
        background: "rgba(30, 30, 40, 0.8)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",
        padding: isMobile ? "32px 24px" : "48px 40px",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
        animation: "fadeIn .6s ease",
        boxShadow: "0 25px 50px rgba(0,0,0,.3)",
      }}>
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
          boxShadow: `0 12px 40px ${accentColor}40`,
          animation: "bounceIn .5s ease",
        }}>
          <FaCheck style={{ color: "#fff", fontSize: "36px" }} />
        </div>

        <h1 style={{
          fontSize: isMobile ? "22px" : "28px",
          fontWeight: "800",
          color: "#ffffff",
          marginBottom: "12px",
          letterSpacing: "-0.5px",
        }}>
          Order Placed Successfully!
        </h1>
        <p style={{
          fontSize: "15px",
          color: "rgba(255,255,255,0.5)",
          marginBottom: "32px",
          lineHeight: "1.6",
        }}>
          Thank you for your order. We're preparing it for you!
        </p>

        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "28px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "12px" }}>
            <FaBox style={{ color: accentColor, fontSize: "14px" }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>Order ID</span>
          </div>
          <span style={{
            fontSize: "18px",
            fontWeight: "700",
            color: accentColor,
            fontFamily: "monospace",
            letterSpacing: "2px",
          }}>
            {orderId}
          </span>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "14px",
          background: "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.15)",
          borderRadius: "12px",
          marginBottom: "24px",
        }}>
          <FaClock style={{ color: "#818cf8", fontSize: "14px" }} />
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
            Redirecting to orders in <strong style={{ color: "#818cf8" }}>{countdown}s</strong>
          </span>
        </div>

        <button
          onClick={() => navigate("/orders")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "14px 32px",
            background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
            border: "none",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: "700",
            color: "#0f172a",
            cursor: "pointer",
            transition: "transform .2s, box-shadow .2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 12px 30px ${accentColor}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          View My Orders <FaArrowRight style={{ fontSize: "14px" }} />
        </button>
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default Success;
