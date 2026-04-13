import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPaperPlane, FaGift, FaStar, FaCrown, FaCopy, FaCheck, FaEnvelope } from "react-icons/fa";
import { subscribeNewsletter } from "../api/api";
import { useTheme } from "../context/ThemeContext";

export default function Newsletter() {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastCoupon, setLastCoupon] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Coupon code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    
    try {
      const response = await subscribeNewsletter(email);
      
      setLastCoupon(response.data);
      
      toast.success(
        <div>
          Discount coupon generated!<br/>
          <strong style={{ fontSize: "1.2rem", color: "#c9a962" }}>{response.data.couponCode}</strong><br/>
          {response.data.discountPercentage}% off on your next purchase!<br/>
          Valid until: {new Date(response.data.expiryDate).toLocaleDateString()}
        </div>,
        {
          icon: "🎁",
          style: {
            borderRadius: "16px",
            background: "linear-gradient(135deg, #1e1e28, #2a2a35)",
            border: "1px solid rgba(201, 169, 98, 0.3)",
            color: "#fff",
          },
          autoClose: 8000,
        }
      );
      
      setEmail("");
    } catch (error) {
      if (error.response?.data?.message === "Please enter your registered email address") {
        toast.error("Please enter your registered email address (the one you used to login)");
      } else if (error.response?.data?.message?.includes("already claimed")) {
        const nextDate = error.response?.data?.nextAvailableDate;
        toast.error(
          `You have already claimed a discount. Please try again after ${nextDate ? new Date(nextDate).toLocaleDateString() : '30 days'}`
        );
      } else {
        toast.error(error.response?.data?.message || "Failed to generate discount coupon");
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      background: "linear-gradient(135deg, #1e1e28 0%, #2a2a35 50%, #1e1e28 100%)",
      padding: isMobile ? "3rem 1.5rem" : "4rem 2rem",
      textAlign: "center",
      color: "#fff",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 10px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
      borderTop: "1px solid rgba(201, 169, 98, 0.2)",
      borderBottom: "1px solid rgba(201, 169, 98, 0.2)",
      margin: "2rem 0",
      borderRadius: "24px",
    },
    goldOrb1: {
      position: "absolute",
      top: "-80px",
      right: "-80px",
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(201, 169, 98, 0.15) 0%, transparent 70%)",
      animation: "pulse 4s infinite ease-in-out",
      pointerEvents: "none",
    },
    goldOrb2: {
      position: "absolute",
      bottom: "-100px",
      left: "-100px",
      width: "350px",
      height: "350px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(201, 169, 98, 0.1) 0%, transparent 70%)",
      animation: "pulse 4s infinite ease-in-out 2s",
      pointerEvents: "none",
    },
    sparkle: {
      position: "absolute",
      width: "4px",
      height: "4px",
      background: "#c9a962",
      borderRadius: "50%",
      animation: "twinkle 2s infinite",
    },
    content: {
      maxWidth: "700px",
      margin: "0 auto",
      position: "relative",
      zIndex: 2,
    },
    crownIcon: {
      fontSize: isMobile ? "2rem" : "2.5rem",
      marginBottom: "0.75rem",
      filter: "drop-shadow(0 4px 20px rgba(201, 169, 98, 0.5))",
    },
    badgeContainer: {
      display: "flex",
      justifyContent: "center",
      gap: isMobile ? "8px" : "12px",
      marginBottom: "1.5rem",
      flexWrap: "wrap",
    },
    badge: {
      background: "rgba(201, 169, 98, 0.1)",
      backdropFilter: "blur(10px)",
      padding: isMobile ? "8px 16px" : "10px 20px",
      borderRadius: "50px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: isMobile ? "0.85rem" : "0.95rem",
      border: "1px solid rgba(201, 169, 98, 0.25)",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
    },
    title: {
      fontSize: isMobile ? "1.6rem" : "2.2rem",
      fontWeight: 800,
      marginBottom: "0.75rem",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 50%, #c9a962 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: "-0.5px",
      textShadow: "none",
    },
    subtitle: {
      fontSize: isMobile ? "0.95rem" : "1.1rem",
      marginBottom: "2rem",
      opacity: 0.9,
      lineHeight: 1.6,
      maxWidth: "520px",
      margin: "0 auto 2rem",
      color: "rgba(255,255,255,0.85)",
    },
    form: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: "1rem",
      maxWidth: "520px",
      margin: "0 auto",
      position: "relative",
    },
    inputWrapper: {
      flex: 1,
      position: "relative",
    },
    input: {
      width: "100%",
      padding: isMobile ? "1rem 1.5rem" : "1rem 1.5rem",
      border: "2px solid rgba(201, 169, 98, 0.2)",
      borderRadius: "60px",
      fontSize: "1rem",
      outline: "none",
      background: "rgba(255,255,255,0.95)",
      boxShadow: isFocused 
        ? "0 8px 30px rgba(201, 169, 98, 0.25), 0 0 0 3px rgba(201, 169, 98, 0.15)"
        : "0 8px 25px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      color: "#1e293b",
      cursor: loading ? "not-allowed" : "text",
    },
    button: {
      padding: isMobile ? "1rem 1.5rem" : "1rem 1.8rem",
      border: "none",
      borderRadius: "60px",
      background: isHovered && !loading 
        ? "linear-gradient(135deg, #e8d5a3 0%, #c9a962 100%)"
        : "linear-gradient(135deg, #c9a962 0%, #b8944f 100%)",
      color: "#000",
      fontWeight: 700,
      fontSize: isMobile ? "1rem" : "1.05rem",
      cursor: loading ? "not-allowed" : "pointer",
      transition: "all 0.3s ease",
      boxShadow: isHovered && !loading
        ? "0 12px 35px rgba(201, 169, 98, 0.45)"
        : "0 8px 25px rgba(201, 169, 98, 0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      letterSpacing: "0.3px",
      width: isMobile ? "100%" : "auto",
      transform: isHovered && !loading ? "translateY(-3px)" : "translateY(0)",
      opacity: loading ? 0.7 : 1,
    },
    buttonIcon: {
      transition: "transform 0.3s ease",
      transform: isHovered && !loading ? "translateX(3px)" : "translateX(0)",
    },
    benefits: {
      display: "flex",
      justifyContent: "center",
      gap: isMobile ? "15px" : "25px",
      marginTop: "1.5rem",
      flexWrap: "wrap",
    },
    benefit: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: isMobile ? "0.9rem" : "1rem",
      color: "rgba(255,255,255,0.9)",
    },
    benefitIcon: {
      color: "#c9a962",
      fontSize: "1rem",
    },
    discountTag: {
      position: "absolute",
      top: "-12px",
      right: isMobile ? "10px" : "20px",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      color: "#000",
      padding: "10px 22px",
      borderRadius: "30px",
      fontWeight: 800,
      fontSize: isMobile ? "0.85rem" : "1rem",
      boxShadow: "0 6px 25px rgba(201, 169, 98, 0.4)",
      transform: "rotate(5deg)",
      zIndex: 3,
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    couponDisplay: {
      marginTop: "1.5rem",
      padding: "1rem",
      background: "rgba(201, 169, 98, 0.08)",
      backdropFilter: "blur(10px)",
      borderRadius: "16px",
      border: "1px solid rgba(201, 169, 98, 0.25)",
      maxWidth: "380px",
      margin: "1.25rem auto 0",
    },
    couponLabel: {
      fontSize: "0.9rem",
      color: "rgba(255,255,255,0.7)",
      marginBottom: "0.75rem",
    },
    couponCodeBox: {
      background: "linear-gradient(135deg, rgba(201, 169, 98, 0.15) 0%, rgba(201, 169, 98, 0.05) 100%)",
      padding: "1rem 1.5rem",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: "1px solid rgba(201, 169, 98, 0.2)",
    },
    couponCodeText: {
      fontSize: "1.3rem",
      fontWeight: 800,
      letterSpacing: "2px",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    copyBtn: {
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      padding: "0.5rem 1rem",
      borderRadius: "25px",
      border: "none",
      color: "#000",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
      fontSize: "0.85rem",
      fontWeight: 700,
      transition: "all 0.3s ease",
      whiteSpace: "nowrap",
    },
    couponExpiry: {
      fontSize: "0.8rem",
      color: "rgba(255,255,255,0.6)",
      marginTop: "0.75rem",
    },
    rating: {
      marginTop: "1.25rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      color: "rgba(255,255,255,0.7)",
      fontSize: "0.85rem",
    },
    stars: {
      display: "flex",
      gap: "3px",
    },
    star: {
      color: "#c9a962",
      fontSize: "1rem",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.goldOrb1} />
      <div style={styles.goldOrb2} />
      
      <div style={{ ...styles.sparkle, top: "20%", left: "15%", animationDelay: "0s" }} />
      <div style={{ ...styles.sparkle, top: "30%", right: "20%", animationDelay: "0.5s" }} />
      <div style={{ ...styles.sparkle, bottom: "25%", left: "25%", animationDelay: "1s" }} />
      <div style={{ ...styles.sparkle, top: "60%", right: "15%", animationDelay: "1.5s" }} />

      <div style={styles.discountTag}>
        <FaGift /> 10% OFF
      </div>

      <div style={styles.content}>
        <FaCrown style={styles.crownIcon} />

        <div style={styles.badgeContainer}>
          <div style={styles.badge}>
            <FaCrown style={{ color: "#c9a962" }} /> Premium
          </div>
          <div style={styles.badge}>
            <FaStar style={{ color: "#c9a962" }} /> Exclusive
          </div>
          <div style={styles.badge}>
            <FaGift style={{ color: "#c9a962" }} /> Rewards
          </div>
        </div>

        <h2 style={styles.title}>
          Never Miss a Deal
        </h2>
        
        <p style={styles.subtitle}>
          Join 50,000+ subscribers and unlock 
          <strong style={{ color: "#c9a962", margin: "0 5px", fontWeight: 700 }}>10% OFF</strong> 
          plus weekly exclusive offers!
        </p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputWrapper}>
            <input
              type="email"
              placeholder="your.email@example.com"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              required
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            style={styles.button}
            onMouseEnter={() => !loading && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={loading}
          >
            <span>{loading ? "Generating..." : "Subscribe"}</span>
            <FaPaperPlane style={styles.buttonIcon} />
          </button>
        </form>

        {lastCoupon && (
          <div style={styles.couponDisplay}>
            <div style={styles.couponLabel}>Your exclusive discount code:</div>
            <div 
              style={styles.couponCodeBox}
              onClick={() => copyToClipboard(lastCoupon.couponCode)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.borderColor = "rgba(201, 169, 98, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.borderColor = "rgba(201, 169, 98, 0.2)";
              }}
            >
              <span style={styles.couponCodeText}>
                {lastCoupon.couponCode}
              </span>
              <button 
                style={styles.copyBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(lastCoupon.couponCode);
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                {copied ? <><FaCheck /> Copied!</> : <><FaCopy /> Copy</>}
              </button>
            </div>
            <div style={styles.couponExpiry}>
              Valid until: {new Date(lastCoupon.expiryDate).toLocaleDateString()}
            </div>
          </div>
        )}

        <div style={styles.benefits}>
          <div style={styles.benefit}>
            <FaCheck style={styles.benefitIcon} /> No spam
          </div>
          <div style={styles.benefit}>
            <FaCheck style={styles.benefitIcon} /> Unsubscribe anytime
          </div>
          <div style={styles.benefit}>
            <FaCheck style={styles.benefitIcon} /> Weekly deals
          </div>
        </div>

        <div style={styles.rating}>
          <div style={styles.stars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <FaStar key={i} style={styles.star} />
            ))}
          </div>
          <span>4.9/5 from 2,500+ reviews</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        input::placeholder {
          color: #94a3b8;
        }

        input:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}
