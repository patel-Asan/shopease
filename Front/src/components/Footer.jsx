import { Link } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FaShoppingBag, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

function ParticleCanvas({ isDarkMode, accentColor }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef();
  const mouseRef = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let running = true;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    const initParticles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 8000);
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
      }));
    };

    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const animate = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const color = hexToRgb(accentColor);
      const maxDist = 120;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},0.5)`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${0.15 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = { x: null, y: null }; };

    resize();
    animate();
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, [accentColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

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
      <ParticleCanvas isDarkMode={isDarkMode} accentColor={accentColor} />

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
          <p style={styles.copyright}>© 2026 ShopEase Collective. All rights reserved.</p>
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
