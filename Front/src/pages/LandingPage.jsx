import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { 
  FaShoppingBag, FaShieldAlt, FaTruck, FaHeadset, 
  FaArrowRight, FaStar, FaCheck, FaAward,
  FaChevronDown, FaPlay, FaQuoteLeft, FaGem, FaCrown,
  FaSun, FaMoon, FaFire, FaRocket,
  FaLeaf as FaLeafAlt, FaBox, FaLock, FaPercent, FaGift,
  FaChevronLeft, FaChevronRight, FaUsers, FaStore
} from "react-icons/fa";

const API_URL = "https://shopease-511p.onrender.com";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentShowcase, setCurrentShowcase] = useState(0);
  const [countersAnimated, setCountersAnimated] = useState(false);
  const [statsData, setStatsData] = useState({
    totalUsers: "2000000",
    totalProducts: "50000",
    avgRating: "4.9"
  });
  const statsRef = useRef(null);

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/dashboard/public`);
        if (response.data) {
          setStatsData({
            totalUsers: response.data.totalUsers?.toString() || "2000000",
            totalProducts: response.data.totalProducts?.toString() || "50000",
            avgRating: response.data.avgRating || "4.9"
          });
        }
      } catch (error) {
        console.log("Using default stats");
      }
    };
    fetchPublicStats();
  }, []);


  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    setTimeout(() => setIsLoaded(true), 100);
    return () => {
      window.removeEventListener('resize', checkScreen);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShowcase(prev => (prev + 1) % showcases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !countersAnimated) {
          setCountersAnimated(true);
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [countersAnimated]);

  const AnimatedCounter = ({ value, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!countersAnimated) return;
      let start = 0;
      const end = parseInt(value.replace(/[^0-9]/g, ''));
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }, [value, countersAnimated, duration]);

    const suffix = value.includes('%') ? '%' : value.includes('/') ? '/5' : '+';
    return <span>{count.toLocaleString()}{suffix}</span>;
  };

  const showcases = [
    { icon: <FaGem />, title: "Luxury Collection", desc: "Handpicked premium products" },
    { icon: <FaFire />, title: "Hot Deals", desc: "Up to 70% off daily" },
    { icon: <FaGift />, title: "Gift Cards", desc: "Perfect for any occasion" },
    { icon: <FaStore />, title: "New Arrivals", desc: "Fresh drops weekly" },
  ];

  const features = [
    { icon: <FaBox />, title: "Premium Products", desc: "Curated selection of luxury items that exceed expectations", color: "#c9a962" },
    { icon: <FaRocket />, title: "Express Delivery", desc: "Next-day delivery on all orders, nationwide coverage", color: "#3b82f6" },
    { icon: <FaLock />, title: "Secure Payments", desc: "256-bit encryption for complete transaction security", color: "#10b981" },
    { icon: <FaHeadset />, title: "Concierge Support", desc: "24/7 white-glove service from dedicated specialists", color: "#f43f5e" },
    { icon: <FaPercent />, title: "Exclusive Rewards", desc: "Earn points on every purchase, redeem for discounts", color: "#a855f7" },
    { icon: <FaLeafAlt />, title: "Eco Commitment", desc: "Carbon-neutral shipping and sustainable packaging", color: "#22c55e" },
  ];

  const testimonials = [
    { name: "Victoria Chen", role: "Premium Member", text: "The attention to detail is extraordinary. Every purchase feels like unwrapping a precious gift. This is shopping redefined.", avatar: "VC" },
    { name: "Alexander Sterling", role: "VIP Customer", text: "Finally, a shopping experience that matches my expectations. The quality is unmatched, and delivery is always prompt.", avatar: "AS" },
    { name: "Isabella Romano", role: "Loyal Customer", text: "The customer service is world-class. They remember my preferences perfectly and always go the extra mile.", avatar: "IR" },
  ];

  const steps = [
    { num: "01", title: "Create Account", desc: "Sign up in seconds with email verification" },
    { num: "02", title: "Browse Collection", desc: "Explore thousands of premium products" },
    { num: "03", title: "Place Order", desc: "Secure checkout with multiple payment options" },
    { num: "04", title: "Enjoy Delivery", desc: "Track your order until it arrives" },
  ];

  const bgColor = isDarkMode ? "#050507" : "#fafbfc";
  const textColor = isDarkMode ? "#ffffff" : "#0f172a";
  const textSecondary = isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b";
  const cardBg = isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.9)";
  const borderColor = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";
  const accentColor = isDarkMode ? "#c9a962" : "#6366f1";
  const accentColorLight = isDarkMode ? "#e8d5a3" : "#818cf8";

  const getStyles = () => ({
    container: { minHeight: "100vh", position: "relative", overflow: "hidden", backgroundColor: bgColor, color: textColor, transition: "all 0.4s ease" },
    bgContainer: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none" },
    gradientOrb1: { position: "absolute", top: "-20%", right: "-10%", width: "600px", height: "600px", borderRadius: "50%", filter: "blur(100px)", background: isDarkMode ? "radial-gradient(circle, rgba(201, 169, 98, 0.12) 0%, transparent 70%)" : "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)" },
    gradientOrb2: { position: "absolute", bottom: "30%", left: "-15%", width: "500px", height: "500px", borderRadius: "50%", filter: "blur(100px)", background: isDarkMode ? "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)" : "radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)" },
    gradientOrb3: { position: "absolute", top: "50%", right: "20%", width: "400px", height: "400px", borderRadius: "50%", filter: "blur(80px)", background: isDarkMode ? "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)" : "radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%)" },
    navbar: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: "16px 0", backgroundColor: scrollY > 30 ? (isDarkMode ? 'rgba(5, 5, 7, 0.9)' : 'rgba(250, 251, 252, 0.9)') : 'transparent', backdropFilter: scrollY > 30 ? 'blur(20px)' : 'none', borderBottom: scrollY > 30 ? `1px solid ${borderColor}` : 'none', transition: "all 0.3s ease" },
    navContent: { maxWidth: "1400px", margin: "0 auto", padding: "0 40px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    logo: { display: "flex", alignItems: "center", gap: "10px" },
    logoIcon: { width: "42px", height: "42px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColorLight} 100%)`, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" },
    logoIconInner: { fontSize: "18px", color: isDarkMode ? "#050507" : "white" },
    logoText: { fontSize: "22px", fontWeight: "700", letterSpacing: "3px", color: textColor },
    logoSubtext: { fontSize: "9px", fontWeight: "500", letterSpacing: "4px", opacity: 0.5, marginTop: "3px" },
    navLink: { fontSize: "14px", fontWeight: "500", background: "none", border: "none", cursor: "pointer", color: textColor, padding: "8px 0" },
    navButtons: { display: "flex", gap: "12px", alignItems: "center" },
    themeToggle: { width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: cardBg, border: `1px solid ${borderColor}`, color: accentColor, transition: "all 0.3s ease", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" },
    themeIcon: { fontSize: "16px" },
    navLoginBtn: { padding: "10px 24px", background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "50px", fontSize: "14px", fontWeight: "500", cursor: "pointer", color: textColor, transition: "all 0.3s ease", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" },
    navRegisterBtn: { padding: "10px 24px", background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColorLight} 100%)`, border: "none", borderRadius: "50px", fontSize: "14px", fontWeight: "600", cursor: "pointer", color: isDarkMode ? "#050507" : "white", transition: "all 0.3s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" },
    hero: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "140px 40px 80px", maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 2 },
    heroContent: { maxWidth: "580px", opacity: isLoaded ? 1 : 0, transform: isLoaded ? 'translateY(0)' : 'translateY(40px)', transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)" },
    heroBadge: { display: "inline-flex", alignItems: "center", gap: "10px", padding: "8px 16px", border: "1px solid", borderRadius: "50px", marginBottom: "24px", backgroundColor: `${accentColor}15`, borderColor: `${accentColor}40`, boxShadow: `0 0 20px ${accentColor}20` },
    badgeDot: { width: "6px", height: "6px", borderRadius: "50%", backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}`, animation: "pulse 2s infinite" },
    heroTitle: { marginBottom: "24px" },
    heroTitleLine1: { display: "block", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: "400", lineHeight: "1.2", marginBottom: "8px", color: textSecondary },
    heroTitleLine2: { display: "block", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: "700", lineHeight: "1.2", background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColorLight} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    cursor: { display: "inline-block", width: "3px", height: "1em", marginLeft: "4px", backgroundColor: accentColor, animation: "pulse 1s infinite", verticalAlign: "text-bottom" },
    heroSubtitle: { fontSize: "17px", lineHeight: "1.8", marginBottom: "32px", maxWidth: "480px", color: textSecondary },
    heroButtons: { display: "flex", gap: "16px", marginBottom: "40px" },
    heroPrimaryBtn: { display: "flex", alignItems: "center", gap: "10px", padding: "16px 32px", background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColorLight} 100%)`, border: "none", borderRadius: "60px", fontSize: "15px", fontWeight: "600", cursor: "pointer", color: isDarkMode ? "#050507" : "white", boxShadow: `0 10px 40px ${accentColor}40`, transition: "all 0.3s ease", transform: "translateY(0)" },
    btnIcon: { fontSize: "14px" },
    heroSecondaryBtn: { display: "flex", alignItems: "center", gap: "10px", padding: "16px 32px", background: "transparent", border: "1px solid", borderRadius: "60px", fontSize: "15px", fontWeight: "500", cursor: "pointer", color: textColor, borderColor: borderColor, transition: "all 0.3s ease", backdropFilter: "blur(10px)" },
    playIcon: { fontSize: "12px", color: accentColor },
    heroTrust: { display: "flex", gap: "32px" },
    trustItem: { display: "flex", alignItems: "center", gap: "8px" },
    trustIcon: { fontSize: "16px" },
    heroVisual: { position: "relative", width: "450px", height: "450px", transform: `translateY(${scrollY * 0.2}px)`, transition: "transform 0.1s ease-out" },
    heroImageWrapper: { position: "relative", width: "100%", height: "100%" },
    heroRing: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "380px", height: "380px", borderRadius: "50%", border: `1px dashed ${accentColor}30`, animation: "rotate 30s linear infinite" },
    heroRing2: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "300px", height: "300px", borderRadius: "50%", border: `1px solid ${accentColor}15` },
    heroCircle: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "220px", height: "220px", borderRadius: "50%", background: `linear-gradient(135deg, ${accentColor}10 0%, ${accentColor}05 100%)`, border: `1px solid ${accentColor}30`, display: "flex", alignItems: "center", justifyContent: "center" },
    crownIcon: { fontSize: "70px", color: accentColor, filter: `drop-shadow(0 0 30px ${accentColor}50)` },
    floatingCard1: { position: "absolute", top: "30px", right: "-10px", padding: "12px 16px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "12px", background: cardBg, border: `1px solid ${borderColor}`, backdropFilter: "blur(20px)", boxShadow: "0 10px 40px rgba(0,0,0,0.2)", animation: "float 4s infinite ease-in-out" },
    floatingCardIcon: { width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)", color: "white", fontSize: "12px" },
    floatingCardTitle: { display: "block", fontSize: "13px", fontWeight: "600", color: textColor },
    floatingCardSubtitle: { display: "block", fontSize: "11px", color: textSecondary },
    floatingCard2: { position: "absolute", bottom: "60px", right: "-20px", padding: "14px 18px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "8px", background: cardBg, border: `1px solid ${borderColor}`, backdropFilter: "blur(20px)", boxShadow: "0 10px 40px rgba(0,0,0,0.2)", animation: "float 5s infinite ease-in-out 0.5s" },
    floatingCard3: { position: "absolute", bottom: "140px", left: "-30px", padding: "12px 18px", borderRadius: "50px", display: "flex", alignItems: "center", gap: "10px", background: cardBg, border: `1px solid ${borderColor}`, backdropFilter: "blur(20px)", boxShadow: "0 10px 40px rgba(0,0,0,0.2)", animation: "float 4.5s infinite ease-in-out 1s", fontSize: "13px", fontWeight: "500", color: textColor },
    scrollIndicator: { position: "absolute", bottom: "30px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", color: textSecondary },
    scrollIcon: { animation: "scrollBounce 2s infinite" },
    statsSection: { padding: "50px 40px", display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap", backgroundColor: cardBg, borderTop: "1px solid", borderBottom: "1px solid", borderColor: borderColor, maxWidth: "1400px", margin: "0 auto" },
    statCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "24px 40px", border: "1px solid", borderColor: borderColor, borderRadius: "20px", minWidth: "180px", transition: "all 0.3s ease", backdropFilter: "blur(10px)", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" },
    statIconWrapper: { width: "48px", height: "48px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${accentColor}20 0%, ${accentColor}10 100%)`, boxShadow: `0 4px 15px ${accentColor}20` },
    statIcon: { fontSize: "20px", color: accentColor },
    statValue: { fontSize: "28px", fontWeight: "700", color: textColor, textShadow: "0 2px 10px rgba(0,0,0,0.1)" },
    statLabel: { fontSize: "12px", fontWeight: "500", letterSpacing: "1px", textTransform: "uppercase", color: textSecondary },
    showcaseTeaser: { padding: "80px 40px", backgroundColor: cardBg, maxWidth: "1400px", margin: "0 auto" },
    showcaseHeader: { textAlign: "center", marginBottom: "50px" },
    sectionTag: { display: "inline-block", fontSize: "11px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "16px", color: accentColor },
    sectionTitle: { fontSize: "clamp(28px, 4vw, 40px)", fontWeight: "700", marginBottom: "12px", color: textColor },
    sectionSubtitle: { fontSize: "16px", maxWidth: "500px", margin: "0 auto", color: textSecondary },
    showcaseGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" },
    showcaseCard: { padding: "30px 24px", border: "1px solid", borderRadius: "20px", textAlign: "center", cursor: "pointer", transition: "all 0.3s ease", backgroundColor: cardBg, borderColor: borderColor, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" },
    showcaseCardIcon: { width: "56px", height: "56px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "24px", color: "white", background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColorLight} 100%)`, boxShadow: `0 8px 25px ${accentColor}40` },
    showcaseCardTitle: { fontSize: "16px", fontWeight: "600", marginBottom: "6px", color: textColor },
    showcaseCardDesc: { fontSize: "13px", color: textSecondary },
    howItWorks: { padding: "100px 40px", maxWidth: "1200px", margin: "0 auto" },
    stepsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginTop: "60px" },
    stepCard: { padding: "32px", border: "1px solid", borderColor: borderColor, borderRadius: "24px", position: "relative", transition: "all 0.3s ease", background: cardBg },
    stepNum: { display: "inline-block", fontSize: "13px", fontWeight: "700", padding: "6px 14px", borderRadius: "30px", marginBottom: "16px", background: `${accentColor}15`, color: accentColor },
    stepTitle: { fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: textColor },
    stepDesc: { fontSize: "14px", color: textSecondary },
    features: { padding: "100px 40px", backgroundColor: cardBg, maxWidth: "1400px", margin: "0 auto" },
    featuresGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginTop: "60px" },
    featureCard: { padding: "36px", border: "1px solid", borderColor: borderColor, borderRadius: "24px", position: "relative", overflow: "hidden", transition: "all 0.3s ease", background: cardBg, boxShadow: "0 4px 30px rgba(0,0,0,0.05)" },
    featureIcon: { width: "56px", height: "56px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", background: "transparent" },
    featureTitle: { fontSize: "18px", fontWeight: "600", marginBottom: "10px", color: textColor },
    featureDesc: { fontSize: "14px", lineHeight: "1.7", color: textSecondary },
    featureBar: { position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", opacity: 0.5 },
    testimonials: { padding: "100px 40px", maxWidth: "1000px", margin: "0 auto" },
    testimonialWrapper: { display: "flex", alignItems: "center", gap: "24px", marginTop: "60px" },
    testimonialNav: { width: "48px", height: "48px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s ease", background: cardBg, border: `1px solid ${borderColor}`, color: textColor, flexShrink: 0 },
    testimonialContainer: { flex: 1, textAlign: "center" },
    quoteIcon: { fontSize: "48px", opacity: 0.3, marginBottom: "20px", color: accentColor },
    testimonialCard: { border: "1px solid", borderColor: borderColor, borderRadius: "28px", padding: "48px", background: cardBg, boxShadow: "0 10px 50px rgba(0,0,0,0.08)" },
    testimonialStars: { display: "flex", justifyContent: "center", gap: "4px", marginBottom: "24px" },
    starIcon: { fontSize: "18px", color: accentColor },
    testimonialText: { fontSize: "20px", lineHeight: "1.8", fontStyle: "italic", fontFamily: "'Playfair Display', serif", marginBottom: "32px", color: textColor },
    testimonialAuthor: { display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" },
    authorAvatar: { width: "50px", height: "50px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: "white", background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColorLight} 100%)` },
    authorName: { display: "block", fontSize: "16px", fontWeight: "600", marginBottom: "2px", color: textColor },
    authorRole: { display: "block", fontSize: "13px", fontWeight: "500", letterSpacing: "1px", textTransform: "uppercase", color: accentColor },
    testimonialDots: { display: "flex", justifyContent: "center", gap: "8px", marginTop: "32px" },
    testimonialDot: { height: "8px", borderRadius: "4px", border: "none", cursor: "pointer", transition: "all 0.3s ease" },
    mapSection: { padding: "100px 40px", maxWidth: "1200px", margin: "0 auto" },
    mapContainer: { display: "flex", gap: "40px", alignItems: "stretch", marginTop: "50px" },
    mapWrapper: { flex: 2, borderRadius: "24px", overflow: "hidden", border: `1px solid ${borderColor}`, minHeight: "400px" },
    mapIframe: { width: "100%", height: "100%", minHeight: "400px", border: "none" },
    mapInfo: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" },
    mapInfoCard: { padding: "32px", background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.08)" },
    mapInfoTitle: { fontSize: "22px", fontWeight: "700", color: textColor, marginBottom: "16px" },
    mapInfoText: { fontSize: "15px", color: textSecondary, marginBottom: "8px", lineHeight: "1.6" },
    mapInfoHours: { marginTop: "20px", paddingTop: "20px", borderTop: `1px solid ${borderColor}` },
    mapInfoLabel: { display: "block", fontSize: "12px", fontWeight: "700", color: accentColor, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" },
    cta: { padding: "120px 40px", position: "relative", overflow: "hidden", textAlign: "center" },
    ctaBg: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
    ctaOrb1: { position: "absolute", top: "-40%", left: "30%", width: "500px", height: "500px", borderRadius: "50%", filter: "blur(80px)", background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)` },
    ctaOrb2: { position: "absolute", bottom: "-40%", right: "20%", width: "400px", height: "400px", borderRadius: "50%", filter: "blur(80px)", background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)" },
    ctaContent: { position: "relative", zIndex: 1 },
    ctaTitle: { fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "700", marginBottom: "16px", color: textColor },
    ctaSubtitle: { fontSize: "18px", marginBottom: "32px", color: textSecondary },
    ctaButtons: { display: "flex", justifyContent: "center", gap: "16px", marginBottom: "20px" },
    ctaButton: { display: "inline-flex", alignItems: "center", gap: "10px", padding: "18px 40px", background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColorLight} 100%)`, border: "none", borderRadius: "60px", fontSize: "16px", fontWeight: "600", cursor: "pointer", color: isDarkMode ? "#050507" : "white", boxShadow: "0 10px 40px rgba(0,0,0,0.2), 0 0 30px ${accentColor}30", transition: "all 0.3s ease" },
    ctaNote: { fontSize: "13px", color: textSecondary },
    footer: { padding: "80px 40px 40px", backgroundColor: isDarkMode ? "rgba(3, 3, 5, 1)" : "rgba(248, 250, 252, 1)", borderTop: `1px solid ${borderColor}` },
    footerContent: { maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", gap: "80px", marginBottom: "60px" },
    footerBrand: { maxWidth: "320px" },
    footerDesc: { marginTop: "20px", fontSize: "14px", lineHeight: "1.8", marginBottom: "24px", color: textSecondary },
    socialLinks: { display: "flex", gap: "12px" },
    socialLink: { padding: "8px 16px", border: "1px solid", borderColor: borderColor, borderRadius: "8px", fontSize: "12px", fontWeight: "500", background: "none", cursor: "pointer", transition: "all 0.2s ease", color: textSecondary },
    footerLinks: { display: "flex", gap: "60px" },
    footerColumn: { display: "flex", flexDirection: "column", gap: "12px" },
    footerColumnTitle: { fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px", color: accentColor },
    footerLink: { fontSize: "14px", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, fontFamily: "inherit", color: textSecondary },
    footerText: { fontSize: "14px", color: textSecondary },
    footerBottom: { maxWidth: "1200px", margin: "0 auto", paddingTop: "30px", borderTop: `1px solid ${borderColor}`, textAlign: "center" },
    copyright: { fontSize: "13px", color: textSecondary },
  });

  const s = getStyles();

  const getResponsiveStyles = () => {
    if (isMobile) {
      return {
        hero: { ...s.hero, flexDirection: "column", padding: "120px 20px 60px", textAlign: "center" },
        heroContent: { ...s.heroContent, maxWidth: "100%" },
        heroTitle: { ...s.heroTitle, marginBottom: "16px" },
        heroTitleLine1: { display: "block", fontSize: "28px", fontWeight: "400", lineHeight: "1.2", marginBottom: "8px", color: textSecondary },
        heroTitleLine2: { display: "block", fontSize: "32px", fontWeight: "700", lineHeight: "1.2", background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColorLight} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
        heroSubtitle: { fontSize: "15px", marginBottom: "24px", maxWidth: "100%" },
        heroButtons: { display: "flex", gap: "12px", marginBottom: "30px", justifyContent: "center", flexWrap: "wrap" },
        heroPrimaryBtn: { display: "flex", alignItems: "center", gap: "8px", padding: "14px 24px", background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColorLight} 100%)`, border: "none", borderRadius: "60px", fontSize: "14px", fontWeight: "600", cursor: "pointer", color: isDarkMode ? "#050507" : "white", boxShadow: `0 8px 30px ${accentColor}40`, transition: "all 0.3s ease" },
        heroSecondaryBtn: { display: "flex", alignItems: "center", gap: "8px", padding: "14px 24px", background: "transparent", border: "1px solid", borderRadius: "60px", fontSize: "14px", fontWeight: "500", cursor: "pointer", color: textColor, borderColor: borderColor, transition: "all 0.3s ease" },
        heroTrust: { display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" },
        heroVisual: { display: "none" },
        scrollIndicator: { display: "none" },
        navContent: { padding: "0 20px" },
        statsSection: { padding: "30px 20px", gap: "16px" },
        statCard: { minWidth: "140px", padding: "16px 20px" },
        statValue: { fontSize: "22px" },
        showcaseTeaser: { padding: "60px 20px" },
        showcaseGrid: { gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
        showcaseCard: { padding: "20px 16px" },
        showcaseCardIcon: { width: "44px", height: "44px", fontSize: "20px" },
        showcaseCardTitle: { fontSize: "14px" },
        showcaseCardDesc: { fontSize: "12px" },
        howItWorks: { padding: "60px 20px" },
        stepsGrid: { gridTemplateColumns: "1fr", gap: "16px" },
        stepCard: { padding: "24px" },
        features: { padding: "60px 20px" },
        featuresGrid: { gridTemplateColumns: "1fr", gap: "16px" },
        featureCard: { padding: "24px" },
        testimonials: { padding: "60px 20px" },
        testimonialCard: { padding: "24px" },
        testimonialText: { fontSize: "16px" },
        mapSection: { padding: "60px 20px" },
        mapContainer: { flexDirection: "column", gap: "24px" },
        mapWrapper: { minHeight: "300px" },
        mapIframe: { minHeight: "300px" },
        cta: { padding: "80px 20px" },
        ctaButtons: { flexWrap: "wrap" },
        ctaButton: { padding: "16px 32px", fontSize: "15px" },
        footer: { padding: "60px 20px 30px" },
        footerContent: { flexDirection: "column", gap: "40px" },
        footerBrand: { maxWidth: "100%" },
        footerLinks: { flexWrap: "wrap", gap: "30px" },
      };
    }
    return {};
  };

  const responsiveStyles = getResponsiveStyles();
  const mergedStyles = { ...s, ...responsiveStyles };

  return (
    <div style={s.container}>
      <div style={s.bgContainer}>
        <div style={s.gradientOrb1} />
        <div style={s.gradientOrb2} />
        <div style={s.gradientOrb3} />
      </div>

      <nav style={s.navbar} className="navbar">
        <div style={s.navContent} className="nav-content">
          <div style={s.logo}>
            <div style={s.logoIcon}>
              <FaShoppingBag style={s.logoIconInner} />
            </div>
            <span style={isMobile ? { ...s.logoText, fontSize: "18px" } : s.logoText}>ShopEase</span>
            <span style={isMobile ? { ...s.logoSubtext, display: "none" } : s.logoSubtext}>COLLECTIVE</span>
          </div>


          <div style={s.navButtons} className="nav-buttons">
            <button
              onClick={toggleTheme}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: cardBg,
                border: `1px solid ${borderColor}`,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                color: accentColor,
                transition: "all 0.3s ease",
              }}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button style={s.navLoginBtn} onClick={() => navigate("/login")} className="nav-login-btn desktop-only">Sign In</button>
            <button style={s.navRegisterBtn} onClick={() => navigate("/register")} className="nav-register-btn">Join Now</button>
          </div>
        </div>
      </nav>

      <section style={isMobile ? { ...s.hero, flexDirection: "column", padding: "100px 16px 40px", textAlign: "center", minHeight: "auto" } : s.hero} className="hero">
        <div style={isMobile ? { ...s.heroContent, maxWidth: "100%", textAlign: "center" } : s.heroContent} className="hero-content">
          <div style={s.heroBadge}>
            <span style={s.badgeDot} />
            <span style={{color: accentColor, fontSize: "12px", fontWeight: "600", letterSpacing: "2px"}}>NEW COLLECTION 2026</span>
          </div>
          
          <h1 style={s.heroTitle} className="hero-title">
            <span style={s.heroTitleLine1} className="hero-title-line1">Elevate Your</span>
            <span style={s.heroTitleLine2} className="hero-title-line2">{typedText}<span style={s.cursor} /></span>
          </h1>
          
          <p style={s.heroSubtitle}>
            Discover a world of premium products curated for those who appreciate the finer things. 
            Experience luxury shopping redefined.
          </p>

          <div style={s.heroButtons} className="hero-buttons">
            <button style={isMobile ? { ...s.heroPrimaryBtn, width: "100%", justifyContent: "center" } : s.heroPrimaryBtn} className="hero-primary-btn" onClick={() => navigate("/register")}>
              <span>Get Started</span>
              <FaArrowRight style={s.btnIcon} />
            </button>
            <button style={isMobile ? { ...s.heroSecondaryBtn, width: "100%", justifyContent: "center" } : s.heroSecondaryBtn} className="hero-secondary-btn" onClick={() => navigate("/login")}>
              <FaPlay style={s.playIcon} />
              <span>Explore Demo</span>
            </button>
          </div>

          <div style={isMobile ? { ...s.heroTrust, justifyContent: "center", flexWrap: "wrap", gap: "12px" } : s.heroTrust} className="hero-trust">
            <div style={s.trustItem}>
              <FaShieldAlt style={{...s.trustIcon, color: "#10b981"}} />
              <span style={{color: textSecondary}}>Secure Checkout</span>
            </div>
            <div style={s.trustItem}>
              <FaTruck style={{...s.trustIcon, color: "#3b82f6"}} />
              <span style={{color: textSecondary}}>Free Shipping</span>
            </div>
            <div style={s.trustItem}>
              <FaAward style={{...s.trustIcon, color: accentColor}} />
              <span style={{color: textSecondary}}>Quality Guaranteed</span>
            </div>
          </div>
        </div>

        <div style={isMobile ? { display: "none" } : s.heroVisual} className="hero-visual">
          <div style={s.heroImageWrapper}>
            <div style={s.heroRing} />
            <div style={s.heroRing2} />
            <div style={s.heroCircle}>
              <FaCrown style={s.crownIcon} />
            </div>
            
            <div style={s.floatingCard1}>
              <div style={s.floatingCardIcon}><FaCheck /></div>
              <div>
                <span style={s.floatingCardTitle}>Order Placed</span>
                <span style={s.floatingCardSubtitle}>Successfully</span>
              </div>
            </div>
            
            <div style={s.floatingCard2}>
              <FaStar style={{color: "#fbbf24", fontSize: "20px"}} />
              <span style={s.floatingCardTitle}>4.9</span>
            </div>
            
            <div style={s.floatingCard3}>
              <div style={{...s.floatingCardIcon, background: `linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)`}}>
                <FaRocket style={{fontSize: "12px", color: "white"}} />
              </div>
              <span>Express Delivery</span>
            </div>
          </div>
        </div>

        <div style={isMobile ? { display: "none" } : s.scrollIndicator} className="scroll-indicator">
          <span style={{fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase"}}>Scroll</span>
          <FaChevronDown style={s.scrollIcon} />
        </div>
      </section>

      <section ref={statsRef} style={s.statsSection} className="stats-section">
        {[
          { value: statsData.totalUsers, label: "Happy Customers", icon: <FaUsers /> },
          { value: "99", label: "Uptime %", icon: <FaRocket /> },
          { value: statsData.totalProducts, label: "Products", icon: <FaStore /> },
          { value: statsData.avgRating, label: "Rating", icon: <FaStar /> },
        ].map((stat, i) => (
          <div key={i} style={s.statCard} className="stat-card stagger-{i + 1}">
            <div style={s.statIconWrapper} className="stat-icon-wrapper"><span style={s.statIcon}>{stat.icon}</span></div>
            <span style={s.statValue} className="stat-value"><AnimatedCounter value={stat.value} duration={2000 + i * 500} /></span>
            <span style={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </section>

      <section style={s.showcaseTeaser} className="showcase-teaser">
        <div style={s.showcaseHeader}>
          <span style={s.sectionTag}>QUICK ACCESS</span>
          <h2 style={s.sectionTitle}>What Awaits You</h2>
        </div>
        <div style={s.showcaseGrid} className="showcase-grid">
          {showcases.map((item, i) => (
            <div key={i} style={{...s.showcaseCard, backgroundColor: i === currentShowcase ? `${accentColor}15` : cardBg, borderColor: i === currentShowcase ? `${accentColor}40` : borderColor}}>
              <div style={s.showcaseCardIcon}>{item.icon}</div>
              <h3 style={s.showcaseCardTitle}>{item.title}</h3>
              <p style={s.showcaseCardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={s.howItWorks} className="how-it-works">
        <div style={s.sectionHeader}>
          <span style={s.sectionTag}>HOW IT WORKS</span>
          <h2 style={s.sectionTitle}>Simple Steps, Big Results</h2>
          <p style={s.sectionSubtitle}>Get started in minutes with our streamlined process</p>
        </div>
        <div style={s.stepsGrid} className="steps-grid">
          {steps.map((step, i) => (
            <div key={i} style={s.stepCard}>
              <span style={s.stepNum}>{step.num}</span>
              <h3 style={s.stepTitle}>{step.title}</h3>
              <p style={s.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={s.features} className="features">
        <div style={s.sectionHeader}>
          <span style={s.sectionTag}>WHY CHOOSE US</span>
          <h2 style={s.sectionTitle}>Experience the Difference</h2>
          <p style={s.sectionSubtitle}>Premium features designed for an exceptional shopping journey</p>
        </div>
        <div style={s.featuresGrid} className="features-grid">
          {features.map((feature, i) => (
            <div key={i} style={s.featureCard}>
              <div style={{...s.featureIcon, background: `linear-gradient(135deg, ${feature.color}20 0%, ${feature.color}05 100%)`, border: `1px solid ${feature.color}30`}}>
                <span style={{color: feature.color, fontSize: "24px"}}>{feature.icon}</span>
              </div>
              <h3 style={s.featureTitle}>{feature.title}</h3>
              <p style={s.featureDesc}>{feature.desc}</p>
              <div style={{...s.featureBar, background: `linear-gradient(90deg, ${feature.color}, ${feature.color}40)`}} />
            </div>
          ))}
        </div>
      </section>

      <section style={s.testimonials} className="testimonials">
        <div style={s.sectionHeader}>
          <span style={s.sectionTag}>TESTIMONIALS</span>
          <h2 style={s.sectionTitle}>Trusted by Thousands</h2>
          <p style={s.sectionSubtitle}>See what our customers have to say</p>
        </div>
        <div style={s.testimonialWrapper} className="testimonial-wrapper">
          <button style={s.testimonialNav} onClick={() => setCurrentTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}>
            <FaChevronLeft />
          </button>
          <div style={s.testimonialContainer}>
            <FaQuoteLeft style={s.quoteIcon} />
            <div style={isMobile ? { ...s.testimonialCard, padding: "16px", borderRadius: "16px" } : s.testimonialCard} className="testimonial-card">
              <div style={s.testimonialStars}>
                {[...Array(5)].map((_, i) => <FaStar key={i} style={s.starIcon} />)}
              </div>
              <p style={s.testimonialText}>"{testimonials[currentTestimonial].text}"</p>
              <div style={s.testimonialAuthor} className="testimonial-author">
                <div style={s.authorAvatar}>{testimonials[currentTestimonial].avatar}</div>
                <div>
                  <span style={s.authorName}>{testimonials[currentTestimonial].name}</span>
                  <span style={s.authorRole}>{testimonials[currentTestimonial].role}</span>
                </div>
              </div>
            </div>
          </div>
          <button style={s.testimonialNav} onClick={() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length)}>
            <FaChevronRight />
          </button>
        </div>
        <div style={s.testimonialDots}>
          {testimonials.map((_, i) => (
            <button key={i} style={{...s.testimonialDot, backgroundColor: i === currentTestimonial ? accentColor : borderColor, width: i === currentTestimonial ? "24px" : "8px"}} onClick={() => setCurrentTestimonial(i)} />
          ))}
        </div>
      </section>

      <section style={s.mapSection} className="map-section">
        <div style={s.sectionHeader}>
          <span style={s.sectionTag}>FIND US</span>
          <h2 style={s.sectionTitle}>Visit Our Store</h2>
          <p style={s.sectionSubtitle}>Come see us in person at our flagship location</p>
        </div>
        <div style={s.mapContainer} className="map-container">
          <div style={isMobile ? { ...s.mapWrapper, minHeight: "250px", borderRadius: "16px", flex: 1, width: "100%" } : s.mapWrapper} className="map-wrapper">
            <iframe          
src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59545.2337809546!2d72.81590777135139!3d21.129419469336128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0504b8ffaf081%3A0xf13809cbd265ef9a!2sBhestan%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1776611099403!5m2!1sen!2sin"              style={s.mapIframe}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Store Location"
            />
          </div>
          <div style={isMobile ? { ...s.mapInfo, flex: 1, width: "100%" } : s.mapInfo} className="map-info">
            <div style={isMobile ? { ...s.mapInfoCard, padding: "16px", borderRadius: "16px" } : s.mapInfoCard}>
              <h3 style={s.mapInfoTitle}>ShopEase Store</h3>
              <p style={s.mapInfoText}>123 ShopEase Avenue, Manhattan</p>
              <p style={s.mapInfoText}>Surat, NY 10001</p>
              <div style={s.mapInfoHours}>
                <span style={s.mapInfoLabel}>Opening Hours:</span>
                <span style={s.mapInfoText}>Mon - Sat: 10AM - 9PM</span>
                <span style={s.mapInfoText}>Sunday: 11AM - 6PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={s.cta} className="cta">
        <div style={s.ctaBg}>
          <div style={s.ctaOrb1} />
          <div style={s.ctaOrb2} />
        </div>
        <div style={s.ctaContent}>
          <span style={s.sectionTag}>LIMITED OFFER</span>
          <h2 style={s.ctaTitle}>Get 20% Off Your First Order</h2>
          <p style={s.ctaSubtitle}>Join our community today and unlock exclusive benefits</p>
          <div style={s.ctaButtons}>
            <button style={s.ctaButton} onClick={() => navigate("/register")}>
              <span>Create Free Account</span>
              <FaArrowRight style={s.btnIcon} />
            </button>
          </div>
          <p style={s.ctaNote}>No credit card required • Instant access • Cancel anytime</p>
        </div>
      </section>

      <footer style={s.footer} className="footer">
        <div style={s.footerContent}>
          <div style={s.footerBrand}>
            <div style={s.logo}>
              <div style={s.logoIcon}><FaShoppingBag style={s.logoIconInner} /></div>
              <span style={s.logoText}>ShopEase</span>
              <span style={s.logoSubtext}>COLLECTIVE</span>
            </div>
            <p style={s.footerDesc}>Curating premium experiences for the discerning. Where quality meets elegance.</p>
            <div style={s.socialLinks}>
              {["Twitter", "Instagram", "LinkedIn"].map((social, i) => (
                <button key={i} style={s.socialLink}>{social}</button>
              ))}
            </div>
          </div>
          <div style={s.footerLinks}>
            <div style={s.footerColumn}>
              <h4 style={s.footerColumnTitle}>Account</h4>
              <button style={s.footerLink} onClick={() => navigate("/login")}>Sign In</button>
              <button style={s.footerLink} onClick={() => navigate("/register")}>Register</button>
            </div>
            <div style={s.footerColumn}>
              <h4 style={s.footerColumnTitle}>Company</h4>
              <span style={s.footerText}>About Us</span>
              <span style={s.footerText}>Careers</span>
            </div>
            <div style={s.footerColumn}>
              <h4 style={s.footerColumnTitle}>Support</h4>
              <span style={s.footerText}>Help Center</span>
              <span style={s.footerText}>Contact Us</span>
            </div>
          </div>
        </div>
        <div style={s.footerBottom}>
          <p style={s.copyright}>© 2024 ShopEase Collective. All rights reserved.</p>
        </div>
      </footer>

<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }
        html { scroll-behavior: smooth; }
        
        /* ========== ANIMATIONS ========== */
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes scrollBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
        @keyframes rotate { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(201, 169, 98, 0.3); } 50% { box-shadow: 0 0 40px rgba(201, 169, 98, 0.6); } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        
        /* Animation Classes */
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.5s ease-out forwards; }
        .animate-slideInLeft { animation: slideInLeft 0.6s ease-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.6s ease-out forwards; }
        
        /* ========== ADDITIONAL ANIMATIONS ========== */
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes tilt { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-2deg); } 75% { transform: rotate(2deg); } }
        @keyframes wave { 0%, 100% { transform: translateY(0) scaleY(1); } 50% { transform: translateY(-5px) scaleY(1.05); } }
        @keyframes shimmerMove { 0% { background-position: -500px 0; } 100% { background-position: 500px 0; } }
        @keyframes borderGlow { 0%, 100% { border-color: rgba(201, 169, 98, 0.3); } 50% { border-color: rgba(201, 169, 98, 0.8); } }
        @keyframes iconBounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3); } }
        @keyframes shine { 0% { left: -100%; } 100% { left: 200%; } }
        @keyframes gradientPulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes cardGlow { 0%, 100% { box-shadow: 0 0 20px rgba(201, 169, 98, 0.2); } 50% { box-shadow: 0 0 40px rgba(201, 169, 98, 0.5); } }
        @keyframes floatingOrb { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(20px, -20px) scale(1.1); } }
        @keyframes morphGlow { 0%, 100% { border-radius: 20px; } 50% { border-radius: 30px; } }
        @keyframes blurPulse { 0%, 100% { filter: blur(0px); } 50% { filter: blur(2px); } }
        @keyframes starTwinkle { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.2); } }
        @keyframes borderDash { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: 60; } }
        @keyframes textGlow { 0%, 100% { text-shadow: 0 0 10px rgba(201, 169, 98, 0.5); } 50% { text-shadow: 0 0 25px rgba(201, 169, 98, 1); } }
        @keyframes ripple { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(4); opacity: 0; } }
        @keyframes flip { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
        @keyframes wobble { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-3deg); } 75% { transform: rotate(3deg); } }
        @keyframes skewPulse { 0%, 100% { transform: skewX(0deg); } 50% { transform: skewX(2deg); } }
        @keyframes spinPulse { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.1); } 100% { transform: rotate(360deg) scale(1); } }
        @keyframes revealLeft { 0% { clip-path: inset(0 100% 0 0); } 100% { clip-path: inset(0 0 0 0); } }
        @keyframes revealUp { 0% { clip-path: inset(100% 0 0 0); } 100% { clip-path: inset(0 0 0 0); } }
        
        /* Animation Utility Classes */
        .animate-bounce { animation: bounce 1s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
        .animate-tilt { animation: tilt 3s ease-in-out infinite; }
        .animate-wave { animation: wave 2s ease-in-out infinite; }
        .animate-iconBounce { animation: iconBounce 0.6s ease-in-out; }
        .animate-cardGlow { animation: cardGlow 2s ease-in-out infinite; }
        .animate-floatingOrb { animation: floatingOrb 6s ease-in-out infinite; }
        .animate-morphGlow { animation: morphGlow 3s ease-in-out infinite; }
        .animate-blurPulse { animation: blurPulse 2s ease-in-out infinite; }
        .animate-starTwinkle { animation: starTwinkle 1.5s ease-in-out infinite; }
        .animate-wobble { animation: wobble 1s ease-in-out infinite; }
        .animate-skewPulse { animation: skewPulse 2s ease-in-out infinite; }
        .animate-spinPulse { animation: spinPulse 3s linear infinite; }
        
        /* Stagger Animation Delays */
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .stagger-6 { animation-delay: 0.6s; }
        
        /* Shine Effect Overlay */
        .shine-overlay { position: relative; overflow: hidden; }
        .shine-overlay::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); animation: shine 3s ease-in-out infinite; }
        
        /* ========== HOVER EFFECTS ========== */
        .hero-primary-btn { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hero-primary-btn:hover { transform: translateY(-4px) !important; box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 30px rgba(201, 169, 98, 0.4) !important; }
        
        .hero-secondary-btn { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hero-secondary-btn:hover { background: rgba(255,255,255,0.08) !important; transform: translateY(-4px) !important; border-color: #c9a962 !important; color: #c9a962 !important; }
        
        .nav-register-btn { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .nav-register-btn:hover { transform: scale(1.05) translateY(-2px) !important; box-shadow: 0 8px 30px rgba(0,0,0,0.3), 0 0 20px rgba(201, 169, 98, 0.3) !important; }
        
        .theme-toggle { transition: all 0.3s ease; }
        .theme-toggle:hover { transform: rotate(15deg) scale(1.1); box-shadow: 0 0 20px rgba(201, 169, 98, 0.4) !important; }
        
        .stat-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); opacity: 0; animation: fadeInUp 0.6s ease-out forwards; cursor: pointer; position: relative; overflow: hidden; }
        .stat-card::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.15), transparent); transition: left 0.6s ease; }
        .stat-card:hover::before { left: 100%; }
        .stat-card:hover { transform: translateY(-8px) scale(1.02) !important; box-shadow: 0 25px 60px rgba(0,0,0,0.25), 0 0 30px rgba(201, 169, 98, 0.3) !important; border-color: #c9a962 !important; }
        .stat-card:hover .stat-icon { transform: scale(1.3); animation: iconBounce 0.5s ease; }
        .stat-card:hover .stat-value { color: #c9a962 !important; text-shadow: 0 0 20px rgba(201, 169, 98, 0.6); transform: scale(1.15); }
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }
        .stat-icon-wrapper { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; z-index: 1; }
        .stat-icon-wrapper::before { content: ''; position: absolute; inset: -4px; border-radius: 16px; background: linear-gradient(135deg, #c9a962, #e8d5a3); opacity: 0; transition: opacity 0.3s ease; z-index: -1; }
        .stat-card:hover .stat-icon-wrapper::before { opacity: 0.6; animation: borderGlow 1s ease-in-out infinite; }
        .stat-value { transition: all 0.4s ease; display: inline-block; }
        .stat-icon { transition: transform 0.3s ease; }
        
        .stat-card:active { transform: scale(0.95); }
        
        .showcase-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .showcase-card:hover { transform: translateY(-8px) scale(1.02) !important; box-shadow: 0 25px 60px rgba(0,0,0,0.2) !important; border-color: #c9a962 !important; }
        .showcase-card:hover .showcase-card-icon { transform: scale(1.1) rotate(5deg); }
        .showcase-card-icon { transition: all 0.3s ease; }
        
        .step-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .step-card:hover { transform: translateY(-8px) !important; box-shadow: 0 20px 50px rgba(0,0,0,0.15) !important; border-color: #c9a962 !important; }
        .step-card:hover .step-num { transform: scale(1.1); }
        .step-num { transition: transform 0.3s ease; }
        
        .feature-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .feature-card:hover { transform: translateY(-8px) scale(1.02) !important; box-shadow: 0 25px 60px rgba(0,0,0,0.2) !important; }
        .feature-card:hover .feature-icon { transform: scale(1.15) rotate(10deg); }
        .feature-icon { transition: all 0.3s ease; }
        
        .testimonial-card { transition: all 0.4s ease; }
        .testimonial-card:hover { transform: scale(1.02); box-shadow: 0 30px 70px rgba(0,0,0,0.12) !important; }
        
        .testimonial-nav { transition: all 0.3s ease; }
        .testimonial-nav:hover { background: #c9a962 !important; color: white !important; transform: scale(1.1); }
        
        .testimonial-dot { transition: all 0.3s ease; }
        .testimonial-dot:hover { transform: scale(1.3); }
        
        .cta-button { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .cta-button:hover { transform: translateY(-5px) scale(1.02) !important; box-shadow: 0 25px 60px rgba(0,0,0,0.35), 0 0 50px rgba(201, 169, 98, 0.5) !important; }
        
        .social-link { transition: all 0.3s ease; }
        .social-link:hover { transform: translateY(-3px); border-color: #c9a962 !important; color: #c9a962 !important; box-shadow: 0 5px 20px rgba(201, 169, 98, 0.3) !important; }
        
        .footer-link { transition: all 0.3s ease; display: inline-block; }
        .footer-link:hover { color: #c9a962 !important; transform: translateX(8px) !important; }
        
        .showcase-card { cursor: pointer; }
        .showcase-card:active { transform: scale(0.98); }
        
        .map-wrapper { transition: all 0.4s ease; }
        .map-wrapper:hover { box-shadow: 0 20px 60px rgba(0,0,0,0.2) !important; }
        
        .logo { transition: all 0.3s ease; cursor: pointer; }
        .logo:hover { transform: scale(1.05); }
        
        /* ========== ENHANCED HOVER EFFECTS ========== */
        .nav-login-btn { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; }
        .nav-login-btn:hover { transform: translateY(-3px); background: rgba(201, 169, 98, 0.1) !important; border-color: #c9a962 !important; color: #c9a962 !important; }
        .nav-login-btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.2), transparent); transition: left 0.5s; }
        .nav-login-btn:hover::before { left: 100%; }
        
        .hero-badge { transition: all 0.4s ease; }
        .hero-badge:hover { transform: scale(1.05); box-shadow: 0 0 30px rgba(201, 169, 98, 0.4); }
        
        .trust-item { transition: all 0.3s ease; }
        .trust-item:hover { transform: translateX(5px); }
        .trust-item:hover .trust-icon { animation: iconBounce 0.5s ease; }
        
        .floating-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .floating-card:hover { transform: scale(1.08) !important; box-shadow: 0 20px 50px rgba(0,0,0,0.3) !important; z-index: 10; }
        .floating-card1 { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .floating-card1:hover { animation: bounce 0.5s ease; }
        .floating-card2 { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .floating-card2:hover { animation: bounce 0.5s ease 0.1s; }
        .floating-card3 { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .floating-card3:hover { animation: bounce 0.5s ease 0.2s; }
        
        .section-tag { transition: all 0.3s ease; }
        .section-tag:hover { animation: textGlow 1s ease-in-out infinite; transform: scale(1.05); }
        
        .section-title { transition: all 0.3s ease; position: relative; }
        .section-title:hover { transform: translateX(10px); }
        .section-title::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: linear-gradient(90deg, #c9a962, #e8d5a3); transition: width 0.3s ease; }
        .section-title:hover::after { width: 60%; }
        
        .section-subtitle { transition: all 0.3s ease; }
        .section-subtitle:hover { color: #c9a962 !important; }
        
        .hero-ring { transition: all 0.5s ease; }
        .hero-ring:hover { animation: spinPulse 4s linear infinite; border-color: rgba(201, 169, 98, 0.6) !important; }
        
        .hero-circle { transition: all 0.5s ease; }
        .hero-circle:hover { transform: translate(-50%, -50%) scale(1.1) !important; box-shadow: 0 0 60px rgba(201, 169, 98, 0.5); }
        
        .scroll-indicator { transition: all 0.3s ease; }
        .scroll-indicator:hover { transform: translateX(-50%) scale(1.1); }
        
        .stat-icon-wrapper { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
        .stat-icon-wrapper::before { content: ''; position: absolute; inset: -3px; border-radius: 16px; background: linear-gradient(135deg, #c9a962, #e8d5a3); opacity: 0; transition: opacity 0.3s; z-index: -1; }
        .stat-card:hover .stat-icon-wrapper::before { opacity: 0.5; animation: borderGlow 1.5s ease-in-out infinite; }
        
        .stat-value { transition: all 0.3s ease; }
        .stat-card:hover .stat-value { transform: scale(1.1); color: #c9a962 !important; }
        
        .showcase-card-icon { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
        .showcase-card-icon::after { content: ''; position: absolute; inset: -5px; border-radius: 20px; background: linear-gradient(135deg, #c9a962, #818cf8); opacity: 0; transition: opacity 0.3s; z-index: -1; }
        .showcase-card:hover .showcase-card-icon::after { opacity: 0.3; animation: borderGlow 1.5s ease-in-out infinite; }
        
        .step-num { transition: all 0.3s ease; display: inline-block; }
        .step-card:hover .step-num { animation: spinPulse 1s ease; }
        
        .feature-icon { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .feature-card:hover .feature-icon { animation: wobble 0.5s ease; }
        
        .feature-bar { transition: all 0.4s ease; width: 0 !important; }
        .feature-card:hover .feature-bar { width: 100% !important; }
        
        .testimonial-stars { transition: all 0.3s ease; }
        .testimonial-stars:hover { transform: scale(1.2); }
        .star-icon { transition: all 0.3s ease; }
        .star-icon:hover { transform: scale(1.3); animation: starTwinkle 0.5s ease; }
        
        .author-avatar { transition: all 0.4s ease; position: relative; }
        .author-avatar::before { content: ''; position: absolute; inset: -3px; border-radius: 50%; background: linear-gradient(135deg, #c9a962, #818cf8); opacity: 0; transition: opacity 0.3s; z-index: -1; }
        .testimonial-author:hover .author-avatar::before { opacity: 0.5; animation: borderGlow 1.5s ease-in-out infinite; }
        
        .map-iframe { transition: all 0.4s ease; }
        .map-iframe:hover { transform: scale(1.02); }
        
        .map-info-card { transition: all 0.4s ease; }
        .map-info-card:hover { transform: translateY(-5px); }
        
        .map-info-title { transition: all 0.3s ease; }
        .map-info-title:hover { color: #c9a962 !important; transform: translateX(5px); }
        
        .cta-section-tag { transition: all 0.3s ease; }
        .cta:hover .section-tag { animation: textGlow 1s ease-in-out infinite; }
        
        .cta-note { transition: all 0.3s ease; }
        .cta-note:hover { color: #c9a962 !important; }
        
        .footer-brand { transition: all 0.3s ease; }
        .footer-brand:hover { transform: translateY(-5px); }
        
        .footer-column { transition: all 0.3s ease; }
        .footer-column:hover { transform: translateX(5px); }
        
        .footer-text { transition: all 0.3s ease; position: relative; }
        .footer-text::before { content: ''; position: absolute; left: -10px; opacity: 0; transition: all 0.3s ease; }
        .footer-text:hover::before { left: -15px; opacity: 1; }
        
        .social-link { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; }
        .social-link::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.3), transparent); transition: left 0.5s; }
        .social-link:hover::before { left: 100%; }
        
        /* Ripple Effect Button */
        .ripple-btn { position: relative; overflow: hidden; }
        .ripple-btn .ripple { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.4); transform: scale(0); animation: ripple 0.6s linear; pointer-events: none; }
        
        /* Parallax Background Elements */
        .gradient-orb { transition: transform 0.1s ease-out; }
        
        /* Text Gradient Animation */
        .gradient-text { background-size: 200% auto; animation: gradientShift 3s linear infinite; }
        
        /* Image Hover Zoom */
        .image-zoom { transition: transform 0.5s ease; overflow: hidden; }
        .image-zoom:hover { transform: scale(1.1); }
        
        /* Button Fill Effect */
        .btn-fill { position: relative; z-index: 1; }
        .btn-fill::before { content: ''; position: absolute; inset: 0; background: #c9a962; transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease; z-index: -1; }
        .btn-fill:hover::before { transform: scaleX(1); }
        
        /* Magnetic Button Effect */
        .magnetic-btn { transition: transform 0.3s ease; }
        .magnetic-btn:hover { transform: scale(1.1); }
        
        /* ============================================ DESKTOP (> 1024px) ============================================ */
        @media (min-width: 1025px) {
          .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 16px 0; height: auto; background: transparent; backdrop-filter: none; }
          .nav-content { max-width: 1400px; margin: 0 auto; padding: 0 40px; }
          .hero { min-height: 100vh; padding: 140px 40px 80px; }
          .hero-visual { display: block !important; }
          .scroll-indicator { display: flex !important; }
        }
        
        /* ============================================ TABLET (768px - 1024px) ============================================ */
        @media (min-width: 768px) and (max-width: 1024px) {
          .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 12px 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(10px); height: auto; }
          .nav-content { padding: 0 20px; max-width: 100%; }
          .nav-buttons { gap: 8px; }
          .nav-logo { font-size: 18px; }
          .nav-register-btn { padding: 8px 16px; font-size: 12px; }
          .nav-login-btn { display: none; }
          
          .hero { min-height: auto; padding: 100px 20px 50px; flex-direction: column; text-align: center; }
          .hero-content { max-width: 100%; text-align: center; }
          .hero-title { font-size: 32px; }
          .hero-subtitle { font-size: 15px; margin-bottom: 24px; max-width: 100%; }
          .hero-buttons { flex-direction: row; justify-content: center; gap: 12px; width: 100%; margin-bottom: 24px; }
          .hero-primary-btn, .hero-secondary-btn { flex: 1; max-width: 200px; padding: 14px 20px; font-size: 13px; justify-content: center; }
          .hero-trust { justify-content: center; flex-wrap: wrap; gap: 16px; }
          .hero-visual { display: none !important; }
          .scroll-indicator { display: none !important; }
          
          .stats-section { padding: 36px 20px; gap: 16px; }
          .stat-card { min-width: 140px; padding: 16px 20px; }
          .stat-value { font-size: 22px; }
          
          .showcase-teaser { padding: 50px 20px; }
          .showcase-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .showcase-card { padding: 20px 14px; }
          
          .how-it-works { padding: 50px 20px; }
          .steps-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .step-card { padding: 20px; }
          
          .features { padding: 50px 20px; }
          .features-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .feature-card { padding: 20px; }
          
          .testimonials { padding: 50px 20px; }
          .testimonial-card { padding: 24px; }
          .map-section { padding: 50px 20px; }
          .map-container { flex-direction: column; }
          .map-wrapper { min-height: 280px; width: 100%; }
          .map-iframe { min-height: 280px; }
          
          .cta { padding: 80px 20px; }
          .cta-title { font-size: 28px; }
          
          .footer { padding: 50px 20px 30px; }
          .footer-content { flex-wrap: wrap; gap: 24px; }
        }
        
        /* ============================================ MOBILE (< 768px) ============================================ */
        @media (max-width: 767px) {
          .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 10px 0; background: rgba(0,0,0,0.95); backdrop-filter: blur(10px); height: auto; }
          .nav-content { padding: 0 12px; }
          .nav-buttons { gap: 6px; }
          .nav-logo { font-size: 16px; letter-spacing: 1px; }
          .nav-logo-sub { display: none; }
          .nav-register-btn { padding: 6px 12px; font-size: 11px; }
          .nav-login-btn { display: none; }
          .nav-theme-toggle { width: 32px; height: 32px; font-size: 14px; }
          
          .hero { min-height: auto; padding: 80px 12px 30px; flex-direction: column; }
          .hero-content { max-width: 100%; text-align: center; }
          .hero-badge { padding: 4px 10px; font-size: 9px; letter-spacing: 1px; }
          .hero-title { font-size: 22px; line-height: 1.2; margin-bottom: 12px; }
          .hero-title-line1, .hero-title-line2 { font-size: 22px; }
          .hero-subtitle { font-size: 13px; line-height: 1.4; margin-bottom: 16px; }
          .hero-buttons { flex-direction: column; gap: 8px; margin-bottom: 20px; }
          .hero-primary-btn, .hero-secondary-btn { width: 100%; justify-content: center; padding: 12px 16px; font-size: 13px; }
          .hero-trust { justify-content: center; flex-wrap: wrap; gap: 12px; font-size: 11px; }
          .hero-visual { display: none !important; }
          .scroll-indicator { display: none !important; }
          
          .stats-section { padding: 20px 12px; gap: 10px; flex-wrap: wrap; justify-content: center; }
          .stat-card { min-width: 90px; padding: 10px 14px; border-radius: 10px; }
          .stat-icon-wrapper { width: 28px; height: 28px; }
          .stat-icon { font-size: 12px; }
          .stat-value { font-size: 16px; }
          .stat-label { font-size: 8px; }
          
          .showcase-teaser { padding: 30px 12px; }
          .section-tag { font-size: 9px; margin-bottom: 10px; }
          .section-title { font-size: 18px; margin-bottom: 8px; }
          .showcase-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .showcase-card { padding: 12px 8px; border-radius: 10px; }
          .showcase-card-icon { width: 28px; height: 28px; font-size: 12px; margin-bottom: 6px; }
          .showcase-card-title { font-size: 10px; }
          .showcase-card-desc { display: none; }
          
          .how-it-works { padding: 30px 12px; }
          .section-subtitle { font-size: 13px; }
          .steps-grid { grid-template-columns: 1fr; gap: 10px; }
          .step-card { padding: 14px; border-radius: 12px; }
          .step-num { font-size: 10px; padding: 3px 8px; }
          .step-title { fontSize: 14px; margin-bottom: 4px; }
          .step-desc { font-size: 11px; }
          
          .features { padding: 30px 12px; }
          .features-grid { grid-template-columns: 1fr; gap: 10px; }
          .feature-card { padding: 14px; border-radius: 12px; }
          .feature-icon { width: 32px; height: 32px; }
          .feature-title { fontSize: 14px; margin-bottom: 6px; }
          .feature-desc { font-size: 11px; line-height: 1.4; }
          
          .testimonials { padding: 30px 12px; }
          .testimonial-wrapper { flex-direction: column; gap: 12px; }
          .testimonial-nav { display: none; }
          .testimonial-card { padding: 16px; border-radius: 14px; }
          .quote-icon { fontSize: 22px; marginBottom: 8px; }
          .testimonial-stars { margin-bottom: 14px; }
          .testimonial-text { font-size: 13px; line-height: 1.5; margin-bottom: 14px; }
          .testimonial-author { flex-direction: column; gap: 8px; }
          .author-avatar { width: 32px; height: 32px; font-size: 12px; }
          .author-name { font-size: 13px; }
          .author-role { font-size: 10px; }
          .testimonial-dots { margin-top: 14px; }
          
          .map-section { padding: 30px 12px; }
          .map-container { flex-direction: column; gap: 12px; }
          .map-wrapper { min-height: 200px; border-radius: 12px; width: 100%; }
          .map-iframe { min-height: 200px; }
          .map-info-card { padding: 14px; border-radius: 12px; }
          .map-info-title { font-size: 16px; margin-bottom: 10px; }
          .map-info-text { font-size: 12px; }
          .map-info-label { fontSize: 9px; margin-bottom: 6px; }
          
          .cta { padding: 50px 12px; }
          .cta-title { font-size: 20px; margin-bottom: 10px; }
          .cta-subtitle { font-size: 13px; margin-bottom: 16px; }
          .cta-button { width: 100%; justify-content: center; padding: 12px 20px; font-size: 13px; }
          .cta-note { font-size: 10px; }
          
          .footer { padding: 30px 12px 20px; }
          .footer-content { flex-direction: column; gap: 20px; }
          .footer-brand { max-width: 100%; }
          .footer-desc { font-size: 12px; margin-bottom: 14px; }
          .social-links { gap: 6px; flex-wrap: wrap; }
          .social-link { padding: 5px 10px; font-size: 10px; }
          .footer-links { gap: 16px; justify-content: space-between; }
          .footer-column { min-width: 45%; }
          .footer-column-title { fontSize: 10px; margin-bottom: 6px; }
          .footer-link, .footer-text { font-size: 12px; }
          .footer-bottom { padding-top: 16px; }
          .copyright { font-size: 10px; }
        }
      `}</style>
    </div>
  );
}
