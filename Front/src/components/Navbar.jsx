import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { FavouritesContext } from "../context/FavouritesContext";
import { useTheme } from "../context/ThemeContext";
import { FaShoppingBag, FaSun, FaMoon, FaHome, FaHeart, FaShoppingCart, FaBox, FaHeadset, FaCrown, FaUser, FaSignOutAlt, FaBell, FaEdit, FaMapMarkerAlt, FaEnvelope, FaBoxOpen } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const { favouritesCount } = useContext(FavouritesContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const accentColor = isDarkMode ? "#c9a962" : "#6366f1";
  const accentLight = isDarkMode ? "#e8d5a3" : "#818cf8";
  const bgColor = isDarkMode ? "#050507" : "#f8fafc";
  const textColor = isDarkMode ? "#ffffff" : "#0f172a";
  const textSecondary = isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.9)";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  const navItems = [
    { path: "/", icon: <FaHome />, label: "Home", isActive: location.pathname === "/" },
    { path: "/favourites", icon: <FaHeart />, label: "Favorites", count: favouritesCount, isActive: location.pathname === "/favourites" },
    { path: "/cart", icon: <FaShoppingCart />, label: "Cart", count: cartCount, isActive: location.pathname === "/cart" },
    { path: "/orders", icon: <FaBox />, label: "Orders", isActive: location.pathname === "/orders" },
    { path: "/contact", icon: <FaHeadset />, label: "Contact", isActive: location.pathname === "/contact" },
  ];

  const styles = {
    navbar: {
      position: "sticky",
      top: 0,
      zIndex: 1000,
      padding: isMobile ? "12px 16px" : "12px 32px",
      backgroundColor: scrolled ? (isDarkMode ? "rgba(5,5,7,0.95)" : "rgba(248,250,252,0.95)") : (isDarkMode ? "rgba(5,5,7,0.8)" : "rgba(248,250,252,0.8)"),
      backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${borderColor}`,
      transition: "all 0.3s ease",
    },
    container: {
      maxWidth: "1400px",
      margin: "0 auto",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "8px" : "10px",
      textDecoration: "none",
      flexShrink: 0,
    },
    logoIcon: {
      width: isMobile ? "36px" : "40px",
      height: isMobile ? "36px" : "40px",
      borderRadius: isMobile ? "8px" : "10px",
      background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    logoText: {
      fontSize: isMobile ? "18px" : "20px",
      fontWeight: "700",
      color: textColor,
      letterSpacing: "2px",
    },
    navLinks: {
      display: isMobile ? "none" : "flex",
      alignItems: "center",
      gap: "8px",
    },
    navLink: (isActive) => ({
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 16px",
      borderRadius: "12px",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: isActive ? "600" : "500",
      color: isActive ? accentColor : textSecondary,
      backgroundColor: isActive ? `${accentColor}15` : "transparent",
      transition: "all 0.3s ease",
    }),
    badge: {
      minWidth: "20px",
      height: "20px",
      borderRadius: "10px",
      background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
      color: "white",
      fontSize: "11px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 6px",
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    iconBtn: {
      width: "38px",
      height: "38px",
      borderRadius: "10px",
      border: `1px solid ${borderColor}`,
      backgroundColor: cardBg,
      color: textSecondary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    themeBtn: {
      width: "38px",
      height: "38px",
      borderRadius: "10px",
      border: `1px solid ${borderColor}`,
      backgroundColor: cardBg,
      color: accentColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    menuBtn: {
      width: "38px",
      height: "38px",
      borderRadius: "10px",
      border: "none",
      background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
      color: "white",
      display: isMobile ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "16px",
    },
    mobileMenu: {
      position: "fixed",
      top: "65px",
      left: "16px",
      right: "16px",
      backgroundColor: isDarkMode ? "rgba(10,10,15,0.98)" : "rgba(255,255,255,0.98)",
      border: `1px solid ${borderColor}`,
      borderRadius: "20px",
      padding: "16px",
      zIndex: 999,
      display: isMobile && mobileMenuOpen ? "block" : "none",
      backdropFilter: "blur(20px)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    },
    mobileLink: (isActive) => ({
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "14px 16px",
      borderRadius: "12px",
      textDecoration: "none",
      fontSize: "15px",
      fontWeight: isActive ? "600" : "500",
      color: isActive ? accentColor : textColor,
      backgroundColor: isActive ? `${accentColor}15` : "transparent",
      marginBottom: "4px",
    }),
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 998,
      display: isMobile && mobileMenuOpen ? "block" : "none",
    },
  };

  return (
    <>
      <div style={styles.overlay} onClick={() => setMobileMenuOpen(false)} />
      
      <nav style={styles.navbar} ref={menuRef}>
        <div style={styles.container}>
          <Link to="/" style={styles.logo}>
            <div style={styles.logoIcon}>
              <FaShoppingBag style={{ color: "white", fontSize: "18px" }} />
            </div>
            <span style={styles.logoText}>ShopEase</span>
          </Link>

          <div style={styles.navLinks}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={styles.navLink(item.isActive)}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.count > 0 && <span style={styles.badge}>{item.count}</span>}
              </Link>
            ))}
          </div>

          <div style={styles.rightSection}>
            <div ref={profileRef}>
              <ProfileDropdown />
            </div>

            <button
              style={styles.themeBtn}
              onClick={toggleTheme}
            >
              {isDarkMode ? <FaSun style={{ fontSize: "16px" }} /> : <FaMoon style={{ fontSize: "16px" }} />}
            </button>

            {user && <NotificationBell />}

            <button
              style={styles.menuBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      <div style={styles.mobileMenu}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={styles.mobileLink(item.isActive)}
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.count > 0 && <span style={styles.badge}>{item.count}</span>}
          </Link>
        ))}
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}
