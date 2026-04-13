import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FaShoppingBag, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaHeart } from "react-icons/fa";

export default function Footer() {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (user?.role === "admin" || user?.role === "delivery") {
    return null;
  }

  const accentColor = isDarkMode ? "#c9a962" : "#6366f1";
  const accentLight = isDarkMode ? "#e8d5a3" : "#818cf8";
  const bgColor = isDarkMode ? "#050507" : "#f8fafc";
  const textColor = isDarkMode ? "#ffffff" : "#0f172a";
  const textSecondary = isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  const styles = {
    footer: {
      backgroundColor: bgColor,
      padding: isMobile ? "60px 20px 30px" : "80px 40px 40px",
      borderTop: `1px solid ${borderColor}`,
      position: "relative",
      overflow: "hidden",
    },
    bgOrb1: {
      position: "absolute",
      top: "-30%",
      right: "-10%",
      width: "400px",
      height: "400px",
      borderRadius: "50%",
      background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`,
      filter: "blur(60px)",
      pointerEvents: "none",
    },
    bgOrb2: {
      position: "absolute",
      bottom: "-20%",
      left: "-10%",
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background: `radial-gradient(circle, ${accentLight}10 0%, transparent 70%)`,
      filter: "blur(60px)",
      pointerEvents: "none",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      position: "relative",
      zIndex: 1,
    },
    topSection: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr 1fr 1fr",
      gap: isMobile ? "40px" : "60px",
      marginBottom: "50px",
    },
    brandSection: {
      maxWidth: "320px",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "16px",
    },
    logoIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "10px",
      background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    logoText: {
      fontSize: "20px",
      fontWeight: "700",
      color: textColor,
      letterSpacing: "3px",
    },
    brandDesc: {
      fontSize: "14px",
      color: textSecondary,
      lineHeight: "1.8",
      marginBottom: "20px",
    },
    socialLinks: {
      display: "flex",
      gap: "10px",
    },
    socialLink: {
      width: "40px",
      height: "40px",
      borderRadius: "10px",
      border: `1px solid ${borderColor}`,
      backgroundColor: cardBg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: textSecondary,
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    columnTitle: {
      fontSize: "13px",
      fontWeight: "700",
      color: accentColor,
      letterSpacing: "2px",
      textTransform: "uppercase",
      marginBottom: "20px",
    },
    linkList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    link: {
      fontSize: "14px",
      color: textSecondary,
      textDecoration: "none",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    contactItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      marginBottom: "14px",
      fontSize: "14px",
      color: textSecondary,
    },
    contactIcon: {
      color: accentColor,
      marginTop: "2px",
    },
    bottomBar: {
      paddingTop: "30px",
      borderTop: `1px solid ${borderColor}`,
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
    },
    copyright: {
      fontSize: "13px",
      color: textSecondary,
    },
    bottomLinks: {
      display: "flex",
      gap: "24px",
    },
    bottomLink: {
      fontSize: "13px",
      color: textSecondary,
      textDecoration: "none",
      transition: "color 0.3s ease",
      cursor: "pointer",
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />

      <div style={styles.container}>
        <div style={styles.topSection}>
          <div style={styles.brandSection}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <FaShoppingBag style={{ color: "white", fontSize: "18px" }} />
              </div>
              <span style={styles.logoText}>ShopEase</span>
            </div>
            <p style={styles.brandDesc}>
              Curating premium experiences for the discerning. Where quality meets elegance.
            </p>
            <div style={styles.socialLinks}>
              {[FaTwitter, FaInstagram, FaLinkedin, FaGithub].map((Icon, i) => (
                <div key={i} style={styles.socialLink}>
                  <Icon style={{ fontSize: "16px" }} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={styles.columnTitle}>Account</h4>
            <div style={styles.linkList}>
              {["Sign In", "Register", "Orders", "Wishlist"].map((item, i) => (
                <Link key={i} to={item === "Sign In" ? "/login" : item === "Register" ? "/register" : item === "Orders" ? "/orders" : "/favourites"} style={styles.link}>
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={styles.columnTitle}>Company</h4>
            <div style={styles.linkList}>
              {["About Us", "Careers", "Blog", "Press"].map((item, i) => (
                <span key={i} style={styles.link}>{item}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 style={styles.columnTitle}>Support</h4>
            <div style={styles.linkList}>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📍</span>
                <span>123 ShopEase Ave, Manhattan, NY</span>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>✉️</span>
                <span>support@ShopEase.com</span>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>⏰</span>
                <span>Mon-Sat: 10AM - 9PM</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.bottomBar}>
          <p style={styles.copyright}>© 2024 ShopEase Collective. All rights reserved.</p>
          <div style={styles.bottomLinks}>
            {["Privacy Policy", "Terms of Service", "Shipping"].map((item, i) => (
              <span key={i} style={styles.bottomLink}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }
      `}</style>
    </footer>
  );
}
