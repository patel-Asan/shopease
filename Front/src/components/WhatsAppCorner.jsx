import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppCorner = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Page load pe smooth appear effect
    setIsVisible(true);
  }, []);

  const handleClick = () => {
    window.open("https://wa.me/917984941356?text=Hi!%20I%20need%20help", "_blank");
  };

  const styles = {
    container: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 1000,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "scale(1)" : "scale(0.5)",
      transition: "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
    button: {
      width: "65px",
      height: "65px",
      borderRadius: "50%",
      background: "linear-gradient(145deg, #25D366, #128C7E)",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "35px",
      color: "white",
      boxShadow: isHovered 
        ? "0 15px 30px rgba(37, 211, 102, 0.5), 0 0 0 4px rgba(255, 255, 255, 0.8)" 
        : "0 10px 25px rgba(37, 211, 102, 0.4)",
      transform: isHovered ? "scale(1.1) rotate(5deg)" : "scale(1) rotate(0)",
      transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      animation: "float 3s ease-in-out infinite",
      position: "relative",
      outline: "none",
      backdropFilter: "blur(5px)",
    },
    pulse: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: "50%",
      background: "rgba(37, 211, 102, 0.4)",
      animation: "pulse 2s ease-out infinite",
      zIndex: -1,
    },
    glow: {
      position: "absolute",
      top: "-5px",
      left: "-5px",
      right: "-5px",
      bottom: "-5px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(37,211,102,0.3) 0%, rgba(37,211,102,0) 70%)",
      animation: "glow 2s ease-in-out infinite",
      zIndex: -2,
    },
    badge: {
      position: "absolute",
      top: "-5px",
      right: "-5px",
      width: "22px",
      height: "22px",
      borderRadius: "50%",
      background: "#ff4757",
      color: "white",
      fontSize: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      border: "2px solid white",
      animation: "pulseBadge 1.5s ease infinite",
    },
  };

  return (
    <div style={styles.container}>
      <div style={{ position: "relative" }}>
        <div style={styles.glow} />
        <div style={styles.pulse} />
        <button
          style={styles.button}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <FaWhatsapp />
          <span style={styles.badge}>1</span>
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0);
          }
          50% {
            transform: translateY(-8px) rotate(3deg);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.3);
            opacity: 0;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes glow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes pulseBadge {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default WhatsAppCorner;