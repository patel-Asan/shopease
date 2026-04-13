
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import { toast } from "react-toastify";
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
 
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [errors, setErrors] = useState({ email: "", server: "" });
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
 
  // Simulate page loading
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setPageLoading(false), 300);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
 
    return () => clearInterval(interval);
  }, []);
 
  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (email.length > 50) return "Email must be less than 50 characters";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address";
    if (email.includes('..')) return "Email cannot contain consecutive dots";
    if (email.startsWith('.')) return "Email cannot start with a dot";
    return "";
  };
 
  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched) {
      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    }
  };
 
  const handleBlur = () => {
    setTouched(true);
    setFocused(false);
    setErrors(prev => ({ ...prev, email: validateEmail(email) }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    setTouched(true);
    const emailError = validateEmail(email);
 
    if (emailError) {
      setErrors({ email: emailError, server: "" });
      toast.warning(emailError);
      return;
    }
 
    setLoading(true);
    setErrors({ email: "", server: "" });
 
    try {
      const data = await apiFetch("/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
 
      if (data.success) {
        setSuccess(true);
        toast.success("✨ Password reset link sent successfully!");
      } else if (data.error) {
        switch (data.error) {
          case "EMAIL_NOT_FOUND":
            setErrors((prev) => ({ ...prev, email: "No account found with this email" }));
            toast.error("Email not found in our system");
            break;
          default:
            setErrors((prev) => ({ ...prev, server: "Failed to send reset link. Please try again." }));
            toast.error("Failed to send reset link");
        }
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setErrors((prev) => ({ ...prev, server: "Server error. Please try again later." }));
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
 
  // Particle background component
  const ParticleBackground = () => (
    <div style={styles.particles}>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={{
            ...styles.particle,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
          }}
        />
      ))}
    </div>
  );
 
  // Skeleton Loader
  const SkeletonLoader = () => (
    <div style={styles.loaderContainer}>
      <ParticleBackground />
 
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${loadingProgress}%` }} />
        </div>
        <span style={styles.progressText}>{loadingProgress}%</span>
      </div>
 
      <div style={styles.loaderBrand}>
        <div style={styles.loaderIcon}>
          <span style={styles.loaderIconText}>🔐</span>
          <div style={styles.loaderRipple} />
        </div>
        <h2 style={styles.loaderTitle}>
          Forgot Password
          <span style={styles.loaderDot}>.</span>
        </h2>
      </div>
 
      <div style={styles.loaderCards}>
        {[1, 2].map((item) => (
          <div key={item} style={styles.loaderCard}>
            <div style={styles.loaderCardShine} />
          </div>
        ))}
      </div>
 
      <div style={styles.loadingMessage}>
        <span style={styles.loadingText}>Preparing reset form</span>
        <span style={styles.loadingDots}>
          <span>.</span><span>.</span><span>.</span>
        </span>
      </div>
    </div>
  );
 
  // FIXED: Replaced all shorthand border properties with individual properties
  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    },
    particles: {
      position: "absolute",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      zIndex: 0,
    },
    particle: {
      position: "absolute",
      background: "rgba(255, 255, 255, 0.3)",
      borderRadius: "50%",
      animation: "float 4s infinite ease-in-out",
    },
    circle: {
      position: "absolute",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.1)",
      animation: "pulse 4s infinite",
    },
    circle1: {
      width: "400px",
      height: "400px",
      top: "-100px",
      right: "-100px",
    },
    circle2: {
      width: "300px",
      height: "300px",
      bottom: "-50px",
      left: "-50px",
    },
    container: {
      width: "100%",
      maxWidth: "450px",
      padding: "20px",
      zIndex: 2,
      animation: pageLoading ? "none" : "slideUp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
    brand: {
      textAlign: "center",
      marginBottom: "30px",
    },
    brandIcon: {
      width: "80px",
      height: "80px",
      margin: "0 auto 15px",
      background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
      borderRadius: "25px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
      animation: "float 3s infinite ease-in-out",
    },
    brandTitle: {
      fontSize: "2.2rem",
      fontWeight: "800",
      color: "white",
      margin: "0 0 10px",
      textShadow: "0 2px 10px rgba(0,0,0,0.2)",
    },
    brandSparkle: {
      display: "inline-block",
      animation: "spin 4s linear infinite",
    },
    brandSubtitle: {
      color: "rgba(255,255,255,0.95)",
      fontSize: "1rem",
      margin: 0,
    },
    card: {
      background: "rgba(255,255,255,0.98)",
      backdropFilter: "blur(10px)",
      borderRadius: "30px",
      padding: "35px",
      boxShadow: "0 30px 70px rgba(0,0,0,0.3)",
      position: "relative",
      overflow: "hidden",
    },
    cardGlow: {
      position: "absolute",
      top: "-50%",
      left: "-50%",
      width: "200%",
      height: "200%",
      background: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.4), transparent 70%)",
      animation: "rotate 20s linear infinite",
      pointerEvents: "none",
    },
    backButton: {
      display: "inline-flex",
      alignItems: "center",
      marginBottom: "25px",
      cursor: "pointer",
      color: "#6366f1",
      fontWeight: "500",
      fontSize: "0.95rem",
      transition: "all 0.3s ease",
      padding: "8px 15px",
      borderRadius: "12px",
      background: "#f3f4f6",
      width: "fit-content",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: "15px",
      color: "#1f2937",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    subtitle: {
      textAlign: "center",
      color: "#6b7280",
      fontSize: "0.95rem",
      marginBottom: "30px",
      lineHeight: "1.6",
      padding: "0 10px",
    },
    formGroup: {
      marginBottom: "25px",
      position: "relative",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontSize: "0.85rem",
      fontWeight: "600",
      color: "#4b5563",
      letterSpacing: "0.5px",
      transition: "color 0.3s ease",
    },
    labelFocused: {
      color: "#6366f1",
    },
    inputWrapper: {
      display: "flex",
      alignItems: "center",
      // FIXED: Replaced shorthand border with individual properties
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
      borderRadius: "15px",
      transition: "all 0.3s ease",
      background: "white",
    },
    inputWrapperFocused: {
      borderColor: "#6366f1",
      boxShadow: "0 0 0 4px rgba(99,102,241,0.1)",
      transform: "scale(1.02)",
    },
    inputWrapperError: {
      borderColor: "#ef4444",
      animation: "shake 0.5s ease",
    },
    inputIcon: {
      padding: "14px 18px",
      color: "#9ca3af",
      fontSize: "1rem",
      transition: "color 0.3s ease",
    },
    inputIconFocused: {
      color: "#6366f1",
    },
    input: {
      flex: 1,
      padding: "14px 18px 14px 0",
      border: "none", // This is fine as it's not conflicting with borderColor
      outline: "none",
      fontSize: "1rem",
      background: "transparent",
      color: "#1f2937",
      width: "100%",
    },
    errorText: {
      marginTop: "8px",
      fontSize: "0.8rem",
      color: "#ef4444",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      animation: "shake 0.5s ease",
    },
    infoBox: {
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      padding: "15px",
      background: "#f0f9ff",
      borderRadius: "12px",
      marginBottom: "25px",
      // FIXED: Replaced shorthand border with individual properties
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#bae6fd",
    },
    infoIcon: {
      color: "#0369a1",
      fontSize: "1.2rem",
      marginTop: "2px",
    },
    infoText: {
      color: "#0369a1",
      fontSize: "0.9rem",
      lineHeight: "1.5",
    },
    button: {
      width: "100%",
      padding: "16px",
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      color: "white",
      border: "none",
      borderRadius: "15px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginBottom: "20px",
      position: "relative",
      overflow: "hidden",
    },
    successContainer: {
      textAlign: "center",
      padding: "30px 20px",
      background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      borderRadius: "20px",
      marginBottom: "20px",
      animation: "scaleIn 0.5s ease",
    },
    successIcon: {
      width: "80px",
      height: "80px",
      margin: "0 auto 20px",
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "2.5rem",
      color: "white",
      animation: "pulse 2s infinite",
    },
    successTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#065f46",
      marginBottom: "15px",
    },
    successText: {
      color: "#047857",
      fontSize: "1rem",
      lineHeight: "1.6",
      marginBottom: "25px",
    },
    successEmail: {
      background: "white",
      padding: "12px 20px",
      borderRadius: "12px",
      fontWeight: "600",
      color: "#059669",
      marginBottom: "20px",
      // FIXED: Replaced shorthand border with individual properties
      borderWidth: "2px",
      borderStyle: "dashed",
      borderColor: "#10b981",
    },
    footer: {
      textAlign: "center",
    },
    footerText: {
      color: "#6b7280",
      fontSize: "0.95rem",
    },
    link: {
      color: "#6366f1",
      textDecoration: "none",
      fontWeight: "600",
      transition: "all 0.3s ease",
    },
    spinner: {
      width: "20px",
      height: "20px",
      // FIXED: Replaced shorthand border with individual properties
      borderWidth: "3px",
      borderStyle: "solid",
      borderColor: "rgba(255,255,255,0.3)",
      borderTopColor: "white",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      display: "inline-block",
      marginRight: "10px",
    },
    // Loader styles
    loaderContainer: {
      width: "100%",
      maxWidth: "500px",
      padding: "40px",
      textAlign: "center",
      position: "relative",
      zIndex: 2,
    },
    progressContainer: {
      marginBottom: "40px",
    },
    progressBar: {
      width: "100%",
      height: "4px",
      background: "rgba(255,255,255,0.2)",
      borderRadius: "2px",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(90deg, #fff, #a5b4fc)",
      borderRadius: "2px",
      transition: "width 0.3s ease",
    },
    progressText: {
      display: "block",
      marginTop: "10px",
      color: "white",
      fontSize: "1.2rem",
      fontWeight: "600",
    },
    loaderBrand: {
      marginBottom: "50px",
    },
    loaderIcon: {
      width: "100px",
      height: "100px",
      margin: "0 auto 20px",
      background: "white",
      borderRadius: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      animation: "pulse 2s infinite",
    },
    loaderIconText: {
      fontSize: "3rem",
      position: "relative",
      zIndex: 2,
    },
    loaderRipple: {
      position: "absolute",
      width: "100%",
      height: "100%",
      borderRadius: "30px",
      background: "rgba(255,255,255,0.4)",
      animation: "ripple 2s infinite",
    },
    loaderTitle: {
      fontSize: "2rem",
      color: "white",
      margin: 0,
      fontWeight: "800",
    },
    loaderDot: {
      color: "#a5b4fc",
      animation: "pulse 1s infinite",
    },
    loaderCards: {
      display: "flex",
      gap: "15px",
      justifyContent: "center",
      marginBottom: "30px",
    },
    loaderCard: {
      width: "100px",
      height: "100px",
      background: "rgba(255,255,255,0.1)",
      borderRadius: "20px",
      position: "relative",
      overflow: "hidden",
      animation: "float 3s infinite ease-in-out",
    },
    loaderCardShine: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
      animation: "shine 1.5s infinite",
    },
    loadingMessage: {
      marginTop: "30px",
    },
    loadingText: {
      color: "white",
      fontSize: "1.1rem",
      opacity: 0.9,
    },
    loadingDots: {
      display: "inline-block",
      marginLeft: "5px",
    },
  };
 
  return (
    <div style={styles.page}>
      <div style={{ ...styles.circle, ...styles.circle1 }} />
      <div style={{ ...styles.circle, ...styles.circle2 }} />
 
      {pageLoading ? (
        <SkeletonLoader />
      ) : (
        <div style={styles.container} className="forgot-password-container">
          <div style={styles.brand}>
            <div style={styles.brandIcon}>
              <span style={{ fontSize: "2.2rem" }}>🔐</span>
            </div>
            <h1 style={styles.brandTitle}>
              ShopEase <span style={styles.brandSparkle}>🛡️</span>
            </h1>
            <p style={styles.brandSubtitle}>Reset your password securely</p>
          </div>
 
          <div style={styles.card}>
            <div style={styles.cardGlow} />
 
            <div 
              style={styles.backButton}
              onClick={() => navigate(-1)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e5e7eb";
                e.currentTarget.style.transform = "translateX(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <FaArrowLeft style={{ marginRight: "8px" }} />
              Back
            </div>
 
            <h2 style={styles.title}>Forgot Password?</h2>
            <p style={styles.subtitle}>
              No worries! Just enter your email and we'll send you a link to reset your password
            </p>
 
            {errors.server && (
              <div style={{ ...styles.errorText, marginBottom: "20px", justifyContent: "center", padding: "10px", background: "#fee2e2", borderRadius: "10px" }}>
                <FaInfoCircle /> {errors.server}
              </div>
            )}
 
            {success ? (
              <div style={styles.successContainer}>
                <div style={styles.successIcon}>
                  <FaCheckCircle />
                </div>
                <h3 style={styles.successTitle}>Check Your Email! 📧</h3>
                <p style={styles.successText}>
                  We've sent a password reset link to:
                </p>
                <div style={styles.successEmail}>
                  {email}
                </div>
                <p style={{ ...styles.successText, fontSize: "0.9rem" }}>
                  The link will expire in 1 hour. If you don't see it, check your spam folder.
                </p>
                <Link to="/login" style={styles.link}>
                  Return to Login
                </Link>
              </div>
            ) : (
              <>
                {/* Info Box */}
                <div style={styles.infoBox}>
                  <FaInfoCircle style={styles.infoIcon} />
                  <div style={styles.infoText}>
                    <strong>Secure Reset Process:</strong> We'll send a one-time link to your email that expires in 1 hour.
                  </div>
                </div>
 
                {/* FIXED: Removed form element and using div with button onClick */}
                <div noValidate>
                  <div style={styles.formGroup}>
                    <label style={{ ...styles.label, ...(focused && styles.labelFocused) }}>
                      EMAIL ADDRESS
                    </label>
                    <div style={{
                      ...styles.inputWrapper,
                      ...(focused && styles.inputWrapperFocused),
                      ...(errors.email && touched && styles.inputWrapperError)
                    }}>
                      <span style={{ ...styles.inputIcon, ...(focused && styles.inputIconFocused) }}>
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        style={styles.input}
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={handleChange}
                        onFocus={() => setFocused(true)}
                        onBlur={handleBlur}
                        required
                      />
                    </div>
                    {errors.email && touched && (
                      <div style={styles.errorText}>
                        <FaInfoCircle /> {errors.email}
                      </div>
                    )}
                  </div>
 
                  <button
                    type="button" // FIXED: Changed from "submit" to "button"
                    style={styles.button}
                    disabled={loading}
                    onClick={handleSubmit} // FIXED: Added onClick handler
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = "0 15px 35px -5px rgba(99,102,241,0.6)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {loading ? (
                      <>
                        <span style={styles.spinner} />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
 
                  <div style={styles.footer}>
                    <span style={styles.footerText}>Remember your password? </span>
                    <Link to="/login" style={styles.link}>Sign In</Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
 
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
 
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-50px);
          }
        }
 
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
 
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
 
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
 
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(20); opacity: 0; }
        }
 
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
 
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
 
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
 
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
 
        @media (max-width: 768px) {
          .brand-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
 
 
 
 