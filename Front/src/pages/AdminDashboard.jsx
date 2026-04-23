
import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import {
  FaUsers,
  FaShoppingBag,
  FaSignOutAlt,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaHeart,
  FaSun,
  FaMoon,
  FaTrophy,
  FaChartLine,
  FaBox,
  FaDollarSign,
  FaCog,
  FaUserPlus,
  FaFileAlt,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaGem,
  FaCalendarAlt,
  FaClock,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import { GrProductHunt } from "react-icons/gr";
import { MdDashboard, MdDeliveryDining } from "react-icons/md";

import OrdersPage from "../AdminPages/AdminOrder";
import DashboardPage from "../AdminPages/DashboardPage";
import ProductPage from "../AdminPages/ProductPage";
import ManageUsers from "../AdminPages/ManageUsers";
import FavouriteProducts from "../AdminPages/FavouriteProducts";
import ProfileDropdown from "../components/ProfileDropdown";
import AdminContact from "../AdminPages/ContectPage";
import ManageDelivery from "../AdminPages/ManageDelivery";
import NotificationBell from "../components/NotificationBell";

const Particles = ({ isDarkMode }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 100;
    const accentColor = "#c9a962";
    const accentPurple = "#8b5cf6";
    const accentPink = "#ec4899";
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 4 + 1,
        color: [accentColor, accentPurple, accentPink][Math.floor(Math.random() * 3)],
        alpha: Math.random() * 0.6 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        twinkle: Math.random() > 0.8,
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        const currentAlpha = p.alpha * (0.5 + Math.sin(p.pulse) * 0.5);
        
        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = p.color;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
        gradient.addColorStop(0, p.color + Math.floor(currentAlpha * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.5, p.color + Math.floor(currentAlpha * 0.5 * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Connect nearby particles
        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(201, 169, 98, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
        
        ctx.shadowBlur = 0;
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: isDarkMode ? 0.8 : 0.4,
      }}
    />
  );
};

const FloatingOrb = ({ delay, size, color, top, left, isDarkMode }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const float = () => {
      const newX = Math.sin(Date.now() / 3000 + delay) * 30;
      const newY = Math.cos(Date.now() / 4000 + delay) * 20;
      setPosition({ x: newX, y: newY });
      requestAnimationFrame(float);
    };
    float();
  }, [delay]);
  
  return (
    <div style={{
      position: "fixed",
      top: `${top}%`,
      left: `${left}%`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: "none",
      zIndex: 0,
      filter: "blur(40px)",
      animation: `float ${5 + delay / 1000}s ease-in-out infinite`,
    }} />
  );
};

const MouseGlow = ({ isDarkMode }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "400px",
      height: "400px",
      borderRadius: "50%",
      background: `radial-gradient(circle, ${isDarkMode ? "rgba(201, 169, 98, 0.08)" : "rgba(201, 169, 98, 0.05)"} 0%, transparent 70%)`,
      transform: `translate(${mousePos.x - 200}px, ${mousePos.y - 200}px)`,
      pointerEvents: "none",
      zIndex: 1,
      transition: "transform 0.1s ease-out",
    }} />
  );
};

const sidebarItems = [
  { icon: <MdDashboard />, label: "Dashboard", key: "dashboard", color: "#c9a962" },
  { icon: <FaUsers />, label: "Manage Users", key: "manageusers", color: "#10b981" },
  { icon: <FaShoppingBag />, label: "Orders", key: "orders", color: "#f59e0b" },
  { icon: <MdDeliveryDining />, label: "Manage Delivery", key: "managedelivery", color: "#8b5cf6" },
  { icon: <GrProductHunt />, label: "Products", key: "products", color: "#ef4444" },
  { icon: <FaHeart />, label: "Favourites", key: "favouriteproduct", color: "#ec4899" },
  { icon: <FaEnvelope />, label: "Messages", key: "usermessages", color: "#14b8a6" },
  { icon: <FaSignOutAlt />, label: "Logout", key: "logout", action: "logout", color: "#6b7280" },
];

const premiumStats = [
  { label: "Total Users", value: "12,847", icon: <FaUsers />, trend: "+12%", up: true, color: "#c9a962" },
  { label: "Total Orders", value: "8,294", icon: <FaShoppingBag />, trend: "+8%", up: true, color: "#10b981" },
  { label: "Revenue", value: "₹4.2L", icon: <FaDollarSign />, trend: "+23%", up: true, color: "#8b5cf6" },
  { label: "Products", value: "2,156", icon: <FaBox />, trend: "-3%", up: false, color: "#f59e0b" },
];

const recentActivity = [
  { id: 1, text: "New user registered", time: "2 min ago", icon: <FaUserPlus />, color: "#10b981" },
  { id: 2, text: "Order #1234 placed", time: "5 min ago", icon: <FaShoppingBag />, color: "#c9a962" },
  { id: 3, text: "New message received", time: "12 min ago", icon: <FaEnvelope />, color: "#8b5cf6" },
  { id: 4, text: "Product added to stock", time: "1 hour ago", icon: <FaBox />, color: "#f59e0b" },
  { id: 5, text: "Delivery assigned", time: "2 hours ago", icon: <MdDeliveryDining />, color: "#ec4899" },
];

const SidebarItem = ({ icon, label, sidebarOpen, active, onClick, isMobile, color, isDarkMode }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: sidebarOpen ? "flex-start" : "center",
        gap: "1rem",
        padding: isMobile ? "0.9rem 1.5rem" : (sidebarOpen ? "0.9rem 1.2rem" : "0.9rem 0"),
        borderRadius: "16px",
        cursor: "pointer",
        background: active 
          ? `linear-gradient(135deg, ${color}25, ${color}10)` 
          : hovered 
            ? (isDarkMode ? "rgba(255,255,255,0.08)" : "#f8fafc")
            : "transparent",
        color: active ? color : hovered ? color : (isDarkMode ? "rgba(255,255,255,0.7)" : "#64748b"),
        fontWeight: active ? 600 : 500,
        margin: "0.3rem 0.5rem",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        fontSize: "0.95rem",
        width: isMobile ? "calc(100% - 1rem)" : "auto",
        position: "relative",
        overflow: "hidden",
        boxShadow: active ? `0 4px 15px ${color}20` : "none",
      }}
    >
      {active && (
        <>
          <div style={{
            position: "absolute",
            left: 0,
            top: "15%",
            bottom: "15%",
            width: "4px",
            background: `linear-gradient(180deg, ${color}, ${color}80)`,
            borderRadius: "0 4px 4px 0",
          }} />
        </>
      )}

      <span style={{
        fontSize: "1.3rem",
        transform: hovered ? "scale(1.1)" : "scale(1)",
        transition: "transform 0.2s ease",
        color: active ? color : hovered ? color : (isDarkMode ? "rgba(255,255,255,0.7)" : "#64748b"),
        minWidth: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {icon}
      </span>

      {(isMobile || sidebarOpen) && (
        <span style={{
          opacity: hovered ? 1 : 0.9,
          transform: hovered ? "translateX(4px)" : "translateX(0)",
          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "0.9rem",
        }}>
          {label}
        </span>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, trend, up, color, isDarkMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);
  
  return (
    <div style={{
      background: isDarkMode 
        ? "linear-gradient(135deg, rgba(30, 30, 40, 0.9) 0%, rgba(20, 20, 28, 0.9) 100%)"
        : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      borderRadius: "24px",
      padding: "1.5rem",
      position: "relative",
      overflow: "hidden",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.15)" : "rgba(0,0,0,0.05)"}`,
      boxShadow: isDarkMode 
        ? "0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)" 
        : "0 4px 20px rgba(0,0,0,0.04)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
      animation: loaded ? `fadeIn 0.5s ease-out 0.1s` : "none",
      opacity: loaded ? 1 : 0,
    }}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Border */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: "24px",
        padding: "2px",
        background: `linear-gradient(135deg, ${color}, ${color}80, transparent)`,
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        opacity: isHovered ? 1 : 0,
        transition: "opacity 0.3s ease",
      }} />
      
      {/* Glow Effect */}
      {isHovered && (
        <div style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: `radial-gradient(circle at center, ${color}15 0%, transparent 50%)`,
          pointerEvents: "none",
          animation: "pulse 2s ease-in-out infinite",
        }} />
      )}
    
    <div style={{
      position: "absolute",
      top: "-30px",
      right: "-30px",
      width: "100px",
      height: "100px",
      background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`,
      borderRadius: "50%",
      transition: "all 0.3s ease",
      transform: isHovered ? "scale(1.5)" : "scale(1)",
    }} />
    
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: "1rem",
      position: "relative",
      zIndex: 1,
    }}>
      <div style={{
        width: "56px",
        height: "56px",
        borderRadius: "16px",
        background: `linear-gradient(135deg, ${color}30, ${color}10)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.4rem",
        color: color,
        boxShadow: `0 8px 25px ${color}25`,
        transition: "all 0.3s ease",
        transform: isHovered ? "rotate(5deg) scale(1.1)" : "rotate(0) scale(1)",
      }}>
        {icon}
      </div>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "6px 12px",
        borderRadius: "20px",
        background: up ? (isDarkMode ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.15)") : (isDarkMode ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.15)"),
        color: up ? "#10b981" : "#ef4444",
        fontSize: "0.8rem",
        fontWeight: 600,
        transition: "all 0.3s ease",
      }}>
        {up ? <FaArrowUp /> : <FaArrowDown />} {trend}
      </div>
    </div>
    
    <h3 style={{
      fontSize: "2.2rem",
      fontWeight: 800,
      color: isDarkMode ? "#ffffff" : "#0f172a",
      marginBottom: "0.25rem",
      background: `linear-gradient(135deg, ${isDarkMode ? "#ffffff" : "#0f172a"} 0%, ${color} 100%)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      position: "relative",
      zIndex: 1,
    }}>
      {value}
    </h3>
    
    <p style={{
      fontSize: "0.95rem",
      color: isDarkMode ? "rgba(255,255,255,0.5)" : "#64748b",
      fontWeight: 500,
      position: "relative",
      zIndex: 1,
    }}>
      {label}
    </p>
  </div>
  );
};

const ActivityItem = ({ text, time, icon, color, isDarkMode, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "0.9rem",
      marginBottom: "0.5rem",
      borderRadius: "16px",
      border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"}`,
      background: isHovered 
        ? (isDarkMode ? "rgba(255,255,255,0.05)" : "#f8fafc")
        : (isDarkMode ? "rgba(255,255,255,0.02)" : "transparent"),
      transition: "all 0.3s ease",
      cursor: "pointer",
      transform: isHovered ? "translateX(4px)" : "translateX(0)",
      animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
    }}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        width: "44px",
        height: "44px",
        borderRadius: "14px",
        background: `linear-gradient(135deg, ${color}25, ${color}10)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: color,
        fontSize: "1.1rem",
        flexShrink: 0,
        boxShadow: isHovered ? `0 4px 15px ${color}30` : "none",
        transition: "all 0.3s ease",
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: "0.9rem",
          color: isDarkMode ? "#ffffff" : "#0f172a",
          fontWeight: 500,
          marginBottom: "0.2rem",
        }}>
          {text}
        </p>
        <p style={{
          fontSize: "0.8rem",
          color: isDarkMode ? "rgba(255,255,255,0.4)" : "#94a3b8",
        }}>
          {time}
        </p>
      </div>
      <div style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 10px ${color}`,
        animation: "pulse 2s ease-in-out infinite",
      }} />
    </div>
  );
};

const AdminDashboard = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { logoutUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeContent, setActiveContent] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  // Handle URL query parameters for navigation from notifications
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    if (page && ['dashboard', 'orders', 'products', 'manageusers', 'managedelivery', 'usermessages', 'favouriteproduct'].includes(page)) {
      setActiveContent(page);
      // Clear the URL parameter after setting the page
      navigate(location.pathname, { replace: true });
    }
  }, [location]);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
        setMobileMenuOpen(false);
      } else {
        setSidebarOpen(true);
        setMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = "/login";
  };

  const handleMobileNavClick = (key) => {
    if (key === "logout") {
      handleLogout();
    } else {
      setActiveContent(key);
      setMobileMenuOpen(false);
    }
  };

  const renderContent = () => {
    switch(activeContent) {
      case "manageusers":
        return <ManageUsers />;
      case "dashboard":
        return <DashboardPage />;
      case "products":
        return <ProductPage />;
      case "favouriteproduct":
        return <FavouriteProducts />;
      case "orders":
        return <OrdersPage />;
      case "usermessages":
        return <AdminContact />;
      case "managedelivery":
        return <ManageDelivery />;
      default:
        return <DashboardPage />;
    }
  };

  const formattedDate = currentDateTime.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  const formattedTime = currentDateTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: true 
  });

  const bgColor = isDarkMode ? "#050507" : "#f8fafc";
  const cardBg = isDarkMode ? "rgba(20, 20, 28, 0.95)" : "#ffffff";
  const textColor = isDarkMode ? "#ffffff" : "#0f172a";
  const textSecondary = isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b";
  const borderColor = isDarkMode ? "rgba(201, 169, 98, 0.1)" : "rgba(0,0,0,0.05)";
  const sidebarBg = isDarkMode ? "rgba(15, 15, 20, 0.98)" : "#ffffff";
  const accentColor = "#c9a962";
  const accentLight = "#e8d5a3";

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: isDarkMode 
        ? "linear-gradient(135deg, #050507 0%, #0a0a10 50%, #050507 100%)"
        : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)",
      position: "relative",
      width: "100%",
    }}>
      {/* Floating Particles Background */}
      <Particles isDarkMode={isDarkMode} />
      
      {/* Floating Orbs */}
      <FloatingOrb delay={0} size={300} color="#c9a962" top={10} left={80} isDarkMode={isDarkMode} />
      <FloatingOrb delay={1000} size={250} color="#8b5cf6" top={60} left={10} isDarkMode={isDarkMode} />
      <FloatingOrb delay={2000} size={200} color="#ec4899" top={80} left={60} isDarkMode={isDarkMode} />
      
      {/* Mouse Following Glow */}
      <MouseGlow isDarkMode={isDarkMode} />
      
      {/* Background Pattern */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: isDarkMode 
          ? `radial-gradient(circle at 20% 20%, rgba(201, 169, 98, 0.03) 0%, transparent 50%),
             radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)`
          : `radial-gradient(circle at 20% 20%, rgba(201, 169, 98, 0.05) 0%, transparent 50%),
             radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)`,
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 1000,
            backdropFilter: "blur(8px)",
          }}
        />
      )}

      {/* Mobile Header Bar */}
      {isMobile && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          background: sidebarBg,
          borderBottom: `1px solid ${borderColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1rem",
          zIndex: 1100,
          backdropFilter: isDarkMode ? "blur(20px)" : "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={toggleSidebar}
              style={{
                background: cardBg,
                color: accentColor,
                border: `1px solid ${borderColor}`,
                borderRadius: "12px",
                padding: "0.6rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <FaGem style={{ color: "#0f172a", fontSize: "1rem" }} />
              </div>
              <span style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #c9a962, #e8d5a3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                ShopEase
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              onClick={toggleTheme}
              style={{
                background: cardBg,
                color: accentColor,
                border: `1px solid ${borderColor}`,
                borderRadius: "12px",
                padding: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isDarkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
            </div>
            <NotificationBell />
            <ProfileDropdown />
          </div>
        </div>
      )}

      {/* Premium Sidebar - Sticky */}
      <div style={{
        width: isMobile 
          ? (mobileMenuOpen ? "280px" : "0px") 
          : (sidebarOpen ? "280px" : "80px"),
        background: sidebarBg,
        boxShadow: isDarkMode 
          ? "0 0 60px rgba(0,0,0,0.5), inset right 1px solid rgba(255,255,255,0.03)" 
          : "4px 0 30px rgba(0,0,0,0.05)",
        transition: isMobile ? "width 0.3s ease" : "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: isMobile ? "1rem 0" : "1.5rem 0",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1050,
        overflowY: "auto",
        overflowX: "hidden",
        flexShrink: 0,
        backdropFilter: isDarkMode ? "blur(30px)" : "none",
        borderRight: `1px solid ${borderColor}`,
        height: "100vh",
      }}>
        {/* Logo Section */}
        {(!isMobile || (isMobile && mobileMenuOpen)) && (
          <div style={{
            width: "100%",
            padding: isMobile ? "0 1.5rem" : (sidebarOpen ? "0 1.5rem" : "0 0.5rem"),
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}>
            <div style={{
              width: "50px",
              height: "50px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 25px rgba(201, 169, 98, 0.4)",
              flexShrink: 0,
            }}>
              <FaGem style={{ color: "#0f172a", fontSize: "1.3rem" }} />
            </div>
            {(!isMobile && sidebarOpen) && (
              <div>
                <span style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #c9a962, #e8d5a3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "block",
                  lineHeight: 1.2,
                }}>
                  ShopEase
                </span>
                <span style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: isDarkMode ? "rgba(255,255,255,0.5)" : "#64748b",
                  letterSpacing: "3px",
                }}>
                  COLLECTIVE
                </span>
              </div>
            )}
          </div>
        )}

        {/* Profile Section - Desktop Only */}
        {!isMobile && (
          <div style={{
            width: "100%",
            padding: sidebarOpen ? "0 1.5rem" : "0 0.5rem",
            marginBottom: "1.5rem",
          }}>
            <ProfileDropdown sidebarOpen={sidebarOpen} />
          </div>
        )}

        {/* Navigation Items */}
        <div style={{ width: "100%", flex: 1 }}>
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              sidebarOpen={isMobile ? true : sidebarOpen}
              active={activeContent === item.key}
              isMobile={isMobile}
              color={item.color}
              isDarkMode={isDarkMode}
              onClick={
                item.action === "logout"
                  ? handleLogout
                  : isMobile 
                    ? () => handleMobileNavClick(item.key)
                    : () => setActiveContent(item.key)
              }
            />
          ))}
        </div>

        {/* Theme Toggle */}
        {!isMobile && (
          <div style={{
            width: "100%",
            padding: sidebarOpen ? "0 1.5rem" : "0 0.5rem",
            marginTop: "1rem",
          }}>
            <div
              onClick={toggleTheme}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: sidebarOpen ? "flex-start" : "center",
                gap: "1rem",
                padding: "0.9rem 1rem",
                borderRadius: "16px",
                cursor: "pointer",
                background: isDarkMode 
                  ? "linear-gradient(135deg, rgba(201, 169, 98, 0.15), rgba(201, 169, 98, 0.05))"
                  : "linear-gradient(135deg, rgba(0,0,0,0.03), rgba(0,0,0,0.01))",
                border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "rgba(0,0,0,0.05)"}`,
                transition: "all 0.3s ease",
              }}
            >
              <span style={{
                fontSize: "1.2rem",
                color: accentColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </span>
              {sidebarOpen && (
                <span style={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: isDarkMode ? "rgba(255,255,255,0.7)" : "#64748b",
                }}>
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Collapse Button */}
        {!isMobile && (
          <div
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              position: "absolute",
              bottom: "1.5rem",
              right: "-18px",
              cursor: "pointer",
              color: accentColor,
              transition: "all 0.2s",
              zIndex: 1001,
              background: isDarkMode ? "rgba(20, 20, 28, 0.98)" : "#ffffff",
              borderRadius: "50%",
              width: "38px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 15px ${accentColor}40`,
              border: `2px solid ${accentColor}50`,
            }}
          >
            {sidebarOpen ? <FaAngleLeft size={24} /> : <FaAngleRight size={24} />}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        width: isMobile ? "100%" : `calc(100% - ${sidebarOpen ? '280px' : '80px'})`,
        marginLeft: isMobile ? 0 : (sidebarOpen ? "280px" : "80px"),
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Sticky Header - Desktop */}
        {!isMobile && (
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem 1.5rem",
            background: isDarkMode ? "rgba(15, 15, 20, 0.95)" : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${borderColor}`,
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.05)",
          }}>
            {/* Greeting */}
            <div>
              <h1 style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: textColor,
                marginBottom: "0.15rem",
              }}>
                Welcome Back, Admin! 👋
              </h1>
              <p style={{
                fontSize: "0.85rem",
                color: textSecondary,
              }}>
                Here's what's happening with your store today.
              </p>
            </div>

            {/* Right Actions */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}>
              {/* Notifications */}
              <NotificationBell />

              {/* Date & Time */}
              <div style={{
                background: cardBg,
                borderRadius: "16px",
                padding: "0.75rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                boxShadow: isDarkMode 
                  ? "0 4px 20px rgba(0,0,0,0.2)" 
                  : "0 2px 10px rgba(0,0,0,0.04)",
                border: `1px solid ${borderColor}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FaCalendarAlt style={{ color: accentColor, fontSize: "0.9rem" }} />
                  <span style={{ 
                    fontSize: "0.9rem", 
                    fontWeight: 500, 
                    color: textColor 
                  }}>
                    {formattedDate}
                  </span>
                </div>
                <div style={{ 
                  width: "1px", 
                  height: "20px", 
                  background: borderColor 
                }} />
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FaClock style={{ color: accentColor, fontSize: "0.9rem" }} />
                  <span style={{ 
                    fontSize: "0.9rem", 
                    fontWeight: 600,
                    color: accentColor,
                    fontFamily: "'SF Mono', 'Courier New', monospace",
                  }}>
                    {formattedTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sticky Header - Mobile - Hidden, using top bar instead */}
        {isMobile && false && (
          <div style={{
            display: "none",
          }}>
          </div>
        )}

        {/* Scrollable Content Area */}
        <div style={{
          flex: 1,
          padding: isMobile ? "1rem" : "1.5rem",
          paddingTop: isMobile ? "80px" : "1.5rem",
          overflowY: "auto",
          overflowX: "hidden",
        }}>
        {/* Main Content Card */}
        <div style={{
          background: cardBg,
          borderRadius: "20px",
          padding: isMobile ? "1.5rem" : "1.5rem",
          boxShadow: isDarkMode 
            ? "0 10px 50px rgba(0,0,0,0.4)" 
            : "0 8px 40px rgba(0,0,0,0.04)",
          transition: "all 0.3s",
          width: "100%",
          overflowX: "auto",
          border: `1px solid ${borderColor}`,
          position: "relative",
          marginBottom: "2rem",
        }}>
          {/* Premium Top Border */}
          <div style={{
            position: "absolute",
            top: 0,
            left: "5%",
            right: "5%",
            height: "3px",
            background: "linear-gradient(90deg, transparent, #c9a962, #e8d5a3, #c9a962, transparent)",
            borderRadius: "0 0 4px 4px",
          }} />


          {renderContent()}
        </div>
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
          overflow-x: hidden; 
        }

        ::-webkit-scrollbar { 
          width: 6px; 
          height: 6px; 
        }
        
        ::-webkit-scrollbar-track { 
          background: ${isDarkMode ? "#0a0a0f" : "#f1f5f9"}; 
          border-radius: 10px; 
        }
        
        ::-webkit-scrollbar-thumb { 
          background: ${isDarkMode ? "#2a2a3a" : "#cbd5e1"}; 
          border-radius: 10px; 
        }
        
        ::-webkit-scrollbar-thumb:hover { 
          background: ${accentColor}; 
        }

        ::selection {
          background: ${accentColor}40;
          color: ${isDarkMode ? "#ffffff" : "#0f172a"};
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-15px) translateX(10px); }
          50% { transform: translateY(-5px) translateX(-10px); }
          75% { transform: translateY(-20px) translateX(5px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px ${accentColor}30; }
          50% { box-shadow: 0 0 40px ${accentColor}50; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
