
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api/api";
import { toast } from "react-toastify";
import { 
  FaLock, FaEye, FaEyeSlash, FaArrowLeft, 
  FaCheckCircle, FaTimesCircle, FaInfoCircle, FaShieldAlt 
} from "react-icons/fa";
 
export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [errors, setErrors] = useState({ password: "", confirmPassword: "", server: "" });
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });
  const [focusedField, setFocusedField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
 
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
 
  // Verify token validity on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const data = await apiFetch(`/auth/verify-reset-token/${token}`);
        if (!data.valid) {
          setTokenValid(false);
          toast.error("Invalid or expired reset link", {
            icon: "🔒",
            style: {
              borderRadius: "10px",
              background: "#ef4444",
              color: "#fff",
            },
          });
        }
      } catch (error) {
        setTokenValid(false);
        toast.error("Invalid or expired reset link");
      }
    };
 
    if (token) {
      verifyToken();
    }
  }, [token]);
 
  // Calculate password strength
  useEffect(() => {
    const password = form.password;
    let strength = 0;
    const criteria = {
      length6: password.length >= 6,
      length8: password.length >= 8,
      hasLetter: /[A-Za-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
      noSpaces: !/\s/.test(password)
    };
 
    if (criteria.length6) strength += 10;
    if (criteria.length8) strength += 15;
    if (criteria.hasLetter) strength += 15;
    if (criteria.hasNumber) strength += 15;
    if (criteria.hasUpper) strength += 15;
    if (criteria.hasSpecial) strength += 20;
    if (criteria.noSpaces) strength += 10;
 
    setPasswordStrength(strength);
  }, [form.password]);
 
  const getStrengthColor = () => {
    if (passwordStrength < 30) return "#ef4444";
    if (passwordStrength < 50) return "#f59e0b";
    if (passwordStrength < 70) return "#3b82f6";
    return "#10b981";
  };
 
  const getStrengthText = () => {
    if (passwordStrength < 30) return "Very Weak";
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 70) return "Medium";
    if (passwordStrength < 90) return "Strong";
    return "Very Strong";
  };
 
  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password.length > 50) return "Password must be less than 50 characters";
    if (!/[A-Za-z]/.test(password)) return "Include at least one letter";
    if (!/[0-9]/.test(password)) return "Include at least one number";
    if (/\s/.test(password)) return "Password cannot contain spaces";
    return "";
  };
 
  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== form.password) return "Passwords do not match";
    return "";
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
 
    // Real-time validation for touched fields
    if (touched[name]) {
      const error = name === 'password' 
        ? validatePassword(value)
        : validateConfirmPassword(value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };
 
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setFocusedField(null);
 
    const error = field === 'password' 
      ? validatePassword(form.password)
      : validateConfirmPassword(form.confirmPassword);
    setErrors(prev => ({ ...prev, [field]: error }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    setTouched({ password: true, confirmPassword: true });
 
    const passwordError = validatePassword(form.password);
    const confirmError = validateConfirmPassword(form.confirmPassword);
 
    if (passwordError || confirmError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmError,
        server: ""
      });
 
      if (passwordError) {
        toast.warning(passwordError);
      } else if (confirmError) {
        toast.warning(confirmError);
      }
      return;
    }
 
    setLoading(true);
 
    try {
      const data = await apiFetch(`/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: form.password }),
      });
 
      if (data.success) {
        setSuccess(true);
        toast.success("✨ Password reset successful!", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#fff",
          },
        });
 
        setTimeout(() => navigate("/login"), 3000);
      } else if (data.error) {
        switch (data.error) {
          case "INVALID_TOKEN":
          case "EXPIRED_TOKEN":
            setErrors((prev) => ({ ...prev, server: "Invalid or expired reset link" }));
            toast.error("Invalid or expired reset link");
            break;
          default:
            setErrors((prev) => ({ ...prev, server: "Failed to reset password" }));
            toast.error("Failed to reset password");
        }
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setErrors((prev) => ({ ...prev, server: "Server error. Please try again later." }));
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };
 
  // Password criteria checklist component
  const PasswordCriteria = () => (
    <div style={styles.passwordCriteria}>
      <div style={styles.criteriaTitle}>
        <FaInfoCircle /> Password Requirements:
      </div>
      <div style={styles.criteriaGrid}>
        <div style={styles.criteriaItem}>
          {form.password.length >= 6 ? <FaCheckCircle color="#10b981" /> : <FaTimesCircle color="#ef4444" />}
          <span>At least 6 characters</span>
        </div>
        <div style={styles.criteriaItem}>
          {/[A-Za-z]/.test(form.password) ? <FaCheckCircle color="#10b981" /> : <FaTimesCircle color="#ef4444" />}
          <span>At least one letter</span>
        </div>
        <div style={styles.criteriaItem}>
          {/[0-9]/.test(form.password) ? <FaCheckCircle color="#10b981" /> : <FaTimesCircle color="#ef4444" />}
          <span>At least one number</span>
        </div>
        <div style={styles.criteriaItem}>
          {!/\s/.test(form.password) ? <FaCheckCircle color="#10b981" /> : <FaTimesCircle color="#ef4444" />}
          <span>No spaces</span>
        </div>
        <div style={styles.criteriaItem}>
          {/[A-Z]/.test(form.password) ? <FaCheckCircle color="#10b981" /> : <FaTimesCircle color="#ef4444" />}
          <span>Uppercase letter (optional)</span>
        </div>
        <div style={styles.criteriaItem}>
          {/[^A-Za-z0-9]/.test(form.password) ? <FaCheckCircle color="#10b981" /> : <FaTimesCircle color="#ef4444" />}
          <span>Special character (optional)</span>
        </div>
      </div>
    </div>
  );
 
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
          Reset Password
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
        <span style={styles.loadingText}>Securing your account</span>
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
      maxWidth: "500px",
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
      marginBottom: "20px",
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
      padding: "14px 50px 14px 0",
      border: "none",
      outline: "none",
      fontSize: "1rem",
      background: "transparent",
      color: "#1f2937",
      width: "100%",
    },
    passwordToggle: {
      padding: "14px 18px",
      cursor: "pointer",
      color: "#9ca3af",
      transition: "all 0.3s ease",
      fontSize: "1rem",
      background: "transparent",
      border: "none",
    },
    errorText: {
      marginTop: "5px",
      fontSize: "0.8rem",
      color: "#ef4444",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      animation: "shake 0.5s ease",
    },
    passwordStrength: {
      marginTop: "8px",
      height: "4px",
      background: "#e5e7eb",
      borderRadius: "2px",
      overflow: "hidden",
    },
    strengthBar: {
      height: "100%",
      width: `${passwordStrength}%`,
      background: getStrengthColor(),
      transition: "all 0.3s ease",
      borderRadius: "2px",
    },
    strengthText: {
      fontSize: "0.75rem",
      marginTop: "4px",
      color: getStrengthColor(),
      fontWeight: "600",
      textAlign: "right",
    },
    passwordCriteria: {
      marginTop: "10px",
      padding: "15px",
      background: "#f9fafb",
      borderRadius: "10px",
      fontSize: "0.85rem",
    },
    criteriaTitle: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
      marginBottom: "10px",
      color: "#4b5563",
      fontWeight: "600",
    },
    criteriaGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "8px",
    },
    criteriaItem: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
      fontSize: "0.8rem",
      color: "#6b7280",
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
      marginTop: "20px",
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
      marginBottom: "20px",
    },
    redirectText: {
      color: "#6b7280",
      fontSize: "0.9rem",
      marginTop: "15px",
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
    // Invalid token container
    invalidContainer: {
      textAlign: "center",
      padding: "30px 20px",
    },
    invalidIcon: {
      fontSize: "4rem",
      marginBottom: "20px",
      animation: "bounce 2s infinite",
    },
    invalidTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#dc2626",
      marginBottom: "15px",
    },
    invalidText: {
      color: "#6b7280",
      fontSize: "1rem",
      marginBottom: "25px",
    },
  };
 
  if (!tokenValid) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.circle, ...styles.circle1 }} />
        <div style={{ ...styles.circle, ...styles.circle2 }} />
 
        <div style={styles.container}>
          <div style={styles.brand}>
            <div style={styles.brandIcon}>
              <span style={{ fontSize: "2.2rem" }}>🔒</span>
            </div>
            <h1 style={styles.brandTitle}>ShopEase</h1>
          </div>
 
          <div style={styles.card}>
            <div style={styles.cardGlow} />
 
            <div style={styles.backButton} onClick={() => navigate("/login")}>
              <FaArrowLeft style={{ marginRight: "8px" }} />
              Back to Login
            </div>
 
            <div style={styles.invalidContainer}>
              <div style={styles.invalidIcon}>🔒</div>
              <h3 style={styles.invalidTitle}>Invalid Reset Link</h3>
              <p style={styles.invalidText}>
                This password reset link is invalid or has expired. 
                Please request a new one.
              </p>
              <Link to="/forgot-password" style={styles.link}>
                Request New Reset Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
 
  if (success) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.circle, ...styles.circle1 }} />
        <div style={{ ...styles.circle, ...styles.circle2 }} />
 
        <div style={styles.container}>
          <div style={styles.brand}>
            <div style={styles.brandIcon}>
              <span style={{ fontSize: "2.2rem" }}>✅</span>
            </div>
            <h1 style={styles.brandTitle}>ShopEase</h1>
          </div>
 
          <div style={styles.card}>
            <div style={styles.cardGlow} />
 
            <div style={styles.successContainer}>
              <div style={styles.successIcon}>
                <FaCheckCircle />
              </div>
              <h3 style={styles.successTitle}>Password Reset Successfully!</h3>
              <p style={styles.successText}>
                Your password has been updated. You can now login with your new password.
              </p>
              <div style={styles.redirectText}>
                Redirecting to login page...
              </div>
              <div style={{ marginTop: "20px" }}>
                <span style={styles.spinner} />
              </div>
            </div>
 
            <div style={styles.footer}>
              <Link to="/login" style={styles.link}>
                Click here if you're not redirected
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div style={styles.page}>
      <div style={{ ...styles.circle, ...styles.circle1 }} />
      <div style={{ ...styles.circle, ...styles.circle2 }} />
 
      {pageLoading ? (
        <SkeletonLoader />
      ) : (
        <div style={styles.container} className="reset-password-container">
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
              onClick={() => navigate("/login")}
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
              Back to Login
            </div>
 
            <h2 style={styles.title}>Reset Password</h2>
            <p style={styles.subtitle}>
              Please enter your new password below
            </p>
 
            {errors.server && (
              <div style={{ ...styles.errorText, marginBottom: "20px", justifyContent: "center", padding: "10px", background: "#fee2e2", borderRadius: "10px" }}>
                <FaInfoCircle /> {errors.server}
              </div>
            )}
 
            {/* Security Info Box */}
            <div style={styles.infoBox}>
              <FaShieldAlt style={styles.infoIcon} />
              <div style={styles.infoText}>
                <strong>Secure Password Tips:</strong> Use a mix of letters, numbers, and special characters for a strong password.
              </div>
            </div>
 
            <form onSubmit={handleSubmit} noValidate>
              {/* New Password Field */}
              <div style={styles.formGroup}>
                <label style={{ ...styles.label, ...(focusedField === 'password' && styles.labelFocused) }}>
                  NEW PASSWORD
                </label>
                <div style={{
                  ...styles.inputWrapper,
                  ...(focusedField === 'password' && styles.inputWrapperFocused),
                  ...(errors.password && touched.password && styles.inputWrapperError)
                }}>
                  <span style={{ ...styles.inputIcon, ...(focusedField === 'password' && styles.inputIconFocused) }}>
                    <FaLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    style={styles.input}
                    placeholder="Enter new password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => handleBlur('password')}
                  />
                  <span
                    style={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
 
                {/* Password strength indicator */}
                {touched.password && form.password && (
                  <>
                    <div style={styles.passwordStrength}>
                      <div style={styles.strengthBar} />
                    </div>
                    <div style={{ ...styles.strengthText, color: getStrengthColor() }}>
                      Password Strength: {getStrengthText()} ({passwordStrength}%)
                    </div>
                  </>
                )}
 
                {errors.password && touched.password && (
                  <div style={styles.errorText}>
                    <FaInfoCircle /> {errors.password}
                  </div>
                )}
              </div>
 
              {/* Confirm Password Field */}
              <div style={styles.formGroup}>
                <label style={{ ...styles.label, ...(focusedField === 'confirmPassword' && styles.labelFocused) }}>
                  CONFIRM PASSWORD
                </label>
                <div style={{
                  ...styles.inputWrapper,
                  ...(focusedField === 'confirmPassword' && styles.inputWrapperFocused),
                  ...(errors.confirmPassword && touched.confirmPassword && styles.inputWrapperError)
                }}>
                  <span style={{ ...styles.inputIcon, ...(focusedField === 'confirmPassword' && styles.inputIconFocused) }}>
                    <FaLock />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    style={styles.input}
                    placeholder="Confirm new password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => handleBlur('confirmPassword')}
                  />
                  <span
                    style={styles.passwordToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <div style={styles.errorText}>
                    <FaInfoCircle /> {errors.confirmPassword}
                  </div>
                )}
              </div>
 
              {/* Password Criteria Checklist */}
              {(focusedField === 'password' || errors.password) && (
                <PasswordCriteria />
              )}
 
              <button
                type="submit"
                style={styles.button}
                disabled={loading}
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
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
 
              <div style={styles.footer}>
                <span style={styles.footerText}>Remember your password? </span>
                <Link to="/login" style={styles.link}>Sign In</Link>
              </div>
            </form>
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
 
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
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
 
 
 
 