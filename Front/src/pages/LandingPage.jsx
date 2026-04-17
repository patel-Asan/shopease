import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { 
  FaShoppingBag, FaShieldAlt, FaTruck, FaHeadset, 
  FaArrowRight, FaStar, FaCheck, FaAward,
  FaChevronDown, FaPlay, FaQuoteLeft, FaGem, FaCrown,
  FaSun, FaMoon, FaFire, FaRocket,
  FaLeaf as FaLeafAlt, FaBox, FaLock, FaPercent, FaGift,
  FaChevronLeft, FaChevronRight, FaUsers, FaStore
} from "react-icons/fa";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [currentShowcase, setCurrentShowcase] = useState(0);
  const [countersAnimated, setCountersAnimated] = useState(false);
  const statsRef = useRef(null);

  const fullText = "Elevate Your Shopping Experience";

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    setTimeout(() => setIsLoaded(true), 100);
    return () => {
      window.removeEventListener('resize', checkMobile);
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
    themeToggle: { width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: cardBg, border: `1px solid ${borderColor}`, color: accentColor, transition: "all 0.3s ease" },
    themeIcon: { fontSize: "16px" },
    navLoginBtn: { padding: "10px 24px", background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "50px", fontSize: "14px", fontWeight: "500", cursor: "pointer", color: textColor, transition: "all 0.3s ease" },
    navRegisterBtn: { padding: "10px 24px", background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColorLight} 100%)`, border: "none", borderRadius: "50px", fontSize: "14px", fontWeight: "600", cursor: "pointer", color: isDarkMode ? "#050507" : "white", transition: "all 0.3s ease" },
    hero: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "140px 40px 80px", maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 2 },
    heroContent: { maxWidth: "580px", opacity: isLoaded ? 1 : 0, transform: isLoaded ? 'translateY(0)' : 'translateY(40px)', transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)" },
    heroBadge: { display: "inline-flex", alignItems: "center", gap: "10px", padding: "8px 16px", border: "1px solid", borderRadius: "50px", marginBottom: "24px", backgroundColor: `${accentColor}15`, borderColor: `${accentColor}40` },
    badgeDot: { width: "6px", height: "6px", borderRadius: "50%", backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}`, animation: "pulse 2s infinite" },
    heroTitle: { marginBottom: "24px" },
    heroTitleLine1: { display: "block", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: "400", lineHeight: "1.2", marginBottom: "8px", color: textSecondary },
    heroTitleLine2: { display: "block", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: "700", lineHeight: "1.2", background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColorLight} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    cursor: { display: "inline-block", width: "3px", height: "1em", marginLeft: "4px", backgroundColor: accentColor, animation: "pulse 1s infinite", verticalAlign: "text-bottom" },
    heroSubtitle: { fontSize: "17px", lineHeight: "1.8", marginBottom: "32px", maxWidth: "480px", color: textSecondary },
    heroButtons: { display: "flex", gap: "16px", marginBottom: "40px" },
    heroPrimaryBtn: { display: "flex", alignItems: "center", gap: "10px", padding: "16px 32px", background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColorLight} 100%)`, border: "none", borderRadius: "60px", fontSize: "15px", fontWeight: "600", cursor: "pointer", color: isDarkMode ? "#050507" : "white", boxShadow: `0 10px 40px ${accentColor}40`, transition: "all 0.3s ease" },
    btnIcon: { fontSize: "14px" },
    heroSecondaryBtn: { display: "flex", alignItems: "center", gap: "10px", padding: "16px 32px", background: "transparent", border: "1px solid", borderRadius: "60px", fontSize: "15px", fontWeight: "500", cursor: "pointer", color: textColor, borderColor: borderColor, transition: "all 0.3s ease" },
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
    statCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "24px 40px", border: "1px solid", borderColor: borderColor, borderRadius: "20px", minWidth: "180px", transition: "all 0.3s ease" },
    statIconWrapper: { width: "48px", height: "48px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}05 100%)` },
    statIcon: { fontSize: "20px", color: accentColor },
    statValue: { fontSize: "28px", fontWeight: "700", color: textColor },
    statLabel: { fontSize: "12px", fontWeight: "500", letterSpacing: "1px", textTransform: "uppercase", color: textSecondary },
    showcaseTeaser: { padding: "80px 40px", backgroundColor: cardBg, maxWidth: "1400px", margin: "0 auto" },
    showcaseHeader: { textAlign: "center", marginBottom: "50px" },
    sectionTag: { display: "inline-block", fontSize: "11px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "16px", color: accentColor },
    sectionTitle: { fontSize: "clamp(28px, 4vw, 40px)", fontWeight: "700", marginBottom: "12px", color: textColor },
    sectionSubtitle: { fontSize: "16px", maxWidth: "500px", margin: "0 auto", color: textSecondary },
    showcaseGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" },
    showcaseCard: { padding: "30px 24px", border: "1px solid", borderRadius: "20px", textAlign: "center", cursor: "pointer", transition: "all 0.3s ease", backgroundColor: cardBg, borderColor: borderColor },
    showcaseCardIcon: { width: "56px", height: "56px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "24px", color: "white", background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColorLight} 100%)` },
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
    featureCard: { padding: "36px", border: "1px solid", borderColor: borderColor, borderRadius: "24px", position: "relative", overflow: "hidden", transition: "all 0.3s ease", background: cardBg },
    featureIcon: { width: "56px", height: "56px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", background: "transparent" },
    featureTitle: { fontSize: "18px", fontWeight: "600", marginBottom: "10px", color: textColor },
    featureDesc: { fontSize: "14px", lineHeight: "1.7", color: textSecondary },
    featureBar: { position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", opacity: 0.5 },
    testimonials: { padding: "100px 40px", maxWidth: "1000px", margin: "0 auto" },
    testimonialWrapper: { display: "flex", alignItems: "center", gap: "24px", marginTop: "60px" },
    testimonialNav: { width: "48px", height: "48px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s ease", background: cardBg, border: `1px solid ${borderColor}`, color: textColor, flexShrink: 0 },
    testimonialContainer: { flex: 1, textAlign: "center" },
    quoteIcon: { fontSize: "48px", opacity: 0.3, marginBottom: "20px", color: accentColor },
    testimonialCard: { border: "1px solid", borderColor: borderColor, borderRadius: "28px", padding: "48px", background: cardBg },
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
    mapInfoCard: { padding: "32px", background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "24px" },
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
    ctaButton: { display: "inline-flex", alignItems: "center", gap: "10px", padding: "18px 40px", background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColorLight} 100%)`, border: "none", borderRadius: "60px", fontSize: "16px", fontWeight: "600", cursor: "pointer", color: isDarkMode ? "#050507" : "white", boxShadow: "0 10px 40px rgba(0,0,0,0.2)", transition: "all 0.3s ease" },
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

      <nav style={s.navbar}>
        <div style={s.navContent}>
          <div style={s.logo}>
            <div style={s.logoIcon}>
              <FaShoppingBag style={s.logoIconInner} />
            </div>
            <span style={s.logoText}>ShopEase</span>
            <span style={s.logoSubtext}>COLLECTIVE</span>
          </div>


          <div style={s.navButtons}>
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
            <button style={s.navLoginBtn} onClick={() => navigate("/login")}>Sign In</button>
            <button style={s.navRegisterBtn} onClick={() => navigate("/register")}>Join Now</button>
          </div>
        </div>
      </nav>

      <section style={s.hero}>
        <div style={s.heroContent}>
          <div style={s.heroBadge}>
            <span style={s.badgeDot} />
            <span style={{color: accentColor, fontSize: "12px", fontWeight: "600", letterSpacing: "2px"}}>NEW COLLECTION 2024</span>
          </div>
          
          <h1 style={s.heroTitle}>
            <span style={s.heroTitleLine1}>Elevate Your</span>
            <span style={s.heroTitleLine2}>{typedText}<span style={s.cursor} /></span>
          </h1>
          
          <p style={s.heroSubtitle}>
            Discover a world of premium products curated for those who appreciate the finer things. 
            Experience luxury shopping redefined.
          </p>

          <div style={s.heroButtons}>
            <button style={s.heroPrimaryBtn} onClick={() => navigate("/register")}>
              <span>Get Started</span>
              <FaArrowRight style={s.btnIcon} />
            </button>
            <button style={s.heroSecondaryBtn} onClick={() => navigate("/login")}>
              <FaPlay style={s.playIcon} />
              <span>Explore Demo</span>
            </button>
          </div>

          <div style={s.heroTrust}>
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

        <div style={s.heroVisual}>
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

        <div style={s.scrollIndicator}>
          <span style={{fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase"}}>Scroll</span>
          <FaChevronDown style={s.scrollIcon} />
        </div>
      </section>

      <section ref={statsRef} style={s.statsSection}>
        {[
          { value: "2000000", label: "Happy Customers", icon: <FaUsers /> },
          { value: "99", label: "Uptime %", icon: <FaRocket /> },
          { value: "50000", label: "Products", icon: <FaStore /> },
          { value: "4.9", label: "Rating", icon: <FaStar /> },
        ].map((stat, i) => (
          <div key={i} style={s.statCard}>
            <div style={s.statIconWrapper}><span style={s.statIcon}>{stat.icon}</span></div>
            <span style={s.statValue}><AnimatedCounter value={stat.value} duration={2000} /></span>
            <span style={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </section>

      <section style={s.showcaseTeaser}>
        <div style={s.showcaseHeader}>
          <span style={s.sectionTag}>QUICK ACCESS</span>
          <h2 style={s.sectionTitle}>What Awaits You</h2>
        </div>
        <div style={s.showcaseGrid}>
          {showcases.map((item, i) => (
            <div key={i} style={{...s.showcaseCard, backgroundColor: i === currentShowcase ? `${accentColor}15` : cardBg, borderColor: i === currentShowcase ? `${accentColor}40` : borderColor}}>
              <div style={s.showcaseCardIcon}>{item.icon}</div>
              <h3 style={s.showcaseCardTitle}>{item.title}</h3>
              <p style={s.showcaseCardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={s.howItWorks}>
        <div style={s.sectionHeader}>
          <span style={s.sectionTag}>HOW IT WORKS</span>
          <h2 style={s.sectionTitle}>Simple Steps, Big Results</h2>
          <p style={s.sectionSubtitle}>Get started in minutes with our streamlined process</p>
        </div>
        <div style={s.stepsGrid}>
          {steps.map((step, i) => (
            <div key={i} style={s.stepCard}>
              <span style={s.stepNum}>{step.num}</span>
              <h3 style={s.stepTitle}>{step.title}</h3>
              <p style={s.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={s.features}>
        <div style={s.sectionHeader}>
          <span style={s.sectionTag}>WHY CHOOSE US</span>
          <h2 style={s.sectionTitle}>Experience the Difference</h2>
          <p style={s.sectionSubtitle}>Premium features designed for an exceptional shopping journey</p>
        </div>
        <div style={s.featuresGrid}>
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

      <section style={s.testimonials}>
        <div style={s.sectionHeader}>
          <span style={s.sectionTag}>TESTIMONIALS</span>
          <h2 style={s.sectionTitle}>Trusted by Thousands</h2>
          <p style={s.sectionSubtitle}>See what our customers have to say</p>
        </div>
        <div style={s.testimonialWrapper}>
          <button style={s.testimonialNav} onClick={() => setCurrentTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}>
            <FaChevronLeft />
          </button>
          <div style={s.testimonialContainer}>
            <FaQuoteLeft style={s.quoteIcon} />
            <div style={s.testimonialCard}>
              <div style={s.testimonialStars}>
                {[...Array(5)].map((_, i) => <FaStar key={i} style={s.starIcon} />)}
              </div>
              <p style={s.testimonialText}>"{testimonials[currentTestimonial].text}"</p>
              <div style={s.testimonialAuthor}>
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

      <section style={s.mapSection}>
        <div style={s.sectionHeader}>
          <span style={s.sectionTag}>FIND US</span>
          <h2 style={s.sectionTitle}>Visit Our Store</h2>
          <p style={s.sectionSubtitle}>Come see us in person at our flagship location</p>
        </div>
        <div style={s.mapContainer}>
          <div style={s.mapWrapper}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878459418!3d40.74076794379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sGoogle!5e0!3m2!1sen!2sus!4v1635959283754!5m2!1sen!2sus"
              style={s.mapIframe}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Store Location"
            />
          </div>
          <div style={s.mapInfo}>
            <div style={s.mapInfoCard}>
              <h3 style={s.mapInfoTitle}>Flagship Store</h3>
              <p style={s.mapInfoText}>123 ShopEase Avenue, Manhattan</p>
              <p style={s.mapInfoText}>New York, NY 10001</p>
              <div style={s.mapInfoHours}>
                <span style={s.mapInfoLabel}>Opening Hours:</span>
                <span style={s.mapInfoText}>Mon - Sat: 10AM - 9PM</span>
                <span style={s.mapInfoText}>Sunday: 11AM - 6PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={s.cta}>
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

      <footer style={s.footer}>
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
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes scrollBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
        @keyframes rotate { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @media (max-width: 768px) {
          .nav-center { display: none !important; }
          .hero { flex-direction: column !important; text-align: center !important; padding: 120px 20px 60px !important; }
          .hero-buttons { justify-content: center !important; flex-wrap: wrap; }
          .hero-trust { justify-content: center !important; flex-wrap: wrap; gap: 20px !important; }
          .hero-visual { margin-top: 60px !important; transform: none !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .testimonial-wrapper { flex-direction: column !important; gap: 20px !important; }
          .map-container { flex-direction: column !important; }
          .map-wrapper { min-height: 300px !important; }
          .map-iframe { min-height: 300px !important; }
        }
      `}</style>
    </div>
  );
}
