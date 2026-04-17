
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import { toast } from "react-toastify";
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaKey } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", server: "" });
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email";
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
        toast.success("Password reset link sent!");
      } else if (data.error) {
        switch (data.error) {
          case "EMAIL_NOT_FOUND":
            setErrors((prev) => ({ ...prev, email: "No account found with this email" }));
            toast.error("Email not found");
            break;
          default:
            setErrors((prev) => ({ ...prev, server: "Failed to send reset link" }));
            toast.error("Failed to send reset link");
        }
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, server: "Server error. Please try again." }));
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const bgColor = isDarkMode ? "#050507" : "#f8fafc";
  const textColor = isDarkMode ? "#ffffff" : "#0f172a";
  const textSecondary = isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const inputBg = isDarkMode ? "rgba(255,255,255,0.05)" : "#ffffff";
  const accentColor = isDarkMode ? "#c9a962" : "#6366f1";
  const accentLight = isDarkMode ? "#e8d5a3" : "#818cf8";
  const errorColor = "#ef4444";
  const successColor = "#10b981";

  return (
    <div style={{ ...containerStyles.wrapper, backgroundColor: bgColor }}>
      <div style={containerStyles.orb1} />
      <div style={containerStyles.orb2} />

      <button onClick={() => navigate("/")} style={{ ...containerStyles.backBtn, borderColor: borderColor, color: textColor }}>
        <FaArrowLeft /> Back
      </button>

      <div style={{ ...containerStyles.card, backgroundColor: cardBg, borderColor: borderColor }}>
        <div style={containerStyles.logo}>
          <div style={{ ...containerStyles.logoIcon, background: `linear-gradient(135deg, ${accentColor}, ${accentLight})` }}>
            <FaKey style={{ color: isDarkMode ? "#050507" : "white", fontSize: "18px" }} />
          </div>
          <span style={{ ...containerStyles.logoText, color: textColor }}>ShopEase</span>
        </div>

        <h1 style={{ ...containerStyles.title, color: textColor }}>Forgot Password</h1>
        <p style={{ ...containerStyles.subtitle, color: textSecondary }}>
          {success ? "Check your email for reset link" : "Enter your email to receive reset link"}
        </p>

        {errors.server && (
          <div style={{ ...containerStyles.errorBanner, borderColor: errorColor }}>{errors.server}</div>
        )}

        {success ? (
          <div style={{ ...containerStyles.successBanner, borderColor: successColor }}>
            <FaCheckCircle style={{ color: successColor, fontSize: "20px" }} />
            <span>Check your email for reset link</span>
          </div>
        ) : (
          <form style={containerStyles.form} onSubmit={handleSubmit}>
            <div style={containerStyles.inputGroup}>
              <label style={{ ...containerStyles.label, color: textSecondary }}>Email</label>
              <div style={{
                ...containerStyles.inputWrapper,
                backgroundColor: inputBg,
                borderColor: touched && errors.email ? errorColor : focused ? accentColor : borderColor,
              }}>
                <FaEnvelope style={{ ...containerStyles.inputIcon, color: focused ? accentColor : textSecondary }} />
                <input
                  type="email"
                  style={{ ...containerStyles.input, color: textColor }}
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={handleChange}
                  onFocus={() => setFocused(true)}
                  onBlur={handleBlur}
                />
              </div>
              {touched && errors.email && (
                <span style={{ ...containerStyles.error, color: errorColor }}>{errors.email}</span>
              )}
            </div>

            <button
              type="submit"
              style={{ ...containerStyles.submitBtn, background: `linear-gradient(135deg, ${accentColor}, ${accentLight})` }}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p style={{ ...containerStyles.footerText, color: textSecondary }}>
              Remember your password? <Link to="/login" style={{ ...containerStyles.link, color: accentColor }}>Sign in</Link>
            </p>
          </form>
        )}
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

const containerStyles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: "20px",
  },
  orb1: {
    position: "fixed",
    top: "-20%",
    right: "-10%",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(201, 169, 98, 0.12) 0%, transparent 70%)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  orb2: {
    position: "fixed",
    bottom: "-20%",
    left: "-10%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  backBtn: {
    position: "fixed",
    top: "20px",
    left: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    background: "transparent",
    border: "1px solid",
    borderRadius: "50px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    zIndex: 10,
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "40px",
    border: "1px solid",
    borderRadius: "24px",
    textAlign: "center",
    animation: "fadeIn 0.5s ease",
    position: "relative",
    zIndex: 1,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "24px",
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "3px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    marginBottom: "28px",
  },
  errorBanner: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid",
    fontSize: "13px",
    marginBottom: "20px",
    color: "#ef4444",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  successBanner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "16px",
    borderRadius: "10px",
    border: "1px solid",
    fontSize: "14px",
    color: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputGroup: {
    textAlign: "left",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid",
    borderRadius: "12px",
    padding: "0 14px",
    transition: "all 0.3s ease",
  },
  inputIcon: {
    fontSize: "16px",
    marginRight: "10px",
  },
  input: {
    flex: 1,
    padding: "14px 0",
    border: "none",
    outline: "none",
    fontSize: "15px",
    background: "transparent",
    fontFamily: "inherit",
  },
  error: {
    display: "block",
    marginTop: "6px",
    fontSize: "12px",
  },
  submitBtn: {
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#050507",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "8px",
  },
  footerText: {
    fontSize: "14px",
  },
  link: {
    fontWeight: "600",
    textDecoration: "none",
  },
};
