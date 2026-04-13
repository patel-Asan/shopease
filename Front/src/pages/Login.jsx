import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { apiFetch } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowLeft, FaSun, FaMoon, FaShoppingBag } from "react-icons/fa";

export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({ email: "", password: "", server: "" });
  const [touched, setTouched] = useState({ email: false, password: false });

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched[name]) {
      const error = name === 'email' ? validateEmail(value) : validatePassword(value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setFocusedField(null);
    const value = form[field];
    const error = field === 'email' ? validateEmail(value) : validatePassword(value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleLogin = async () => {
    setTouched({ email: true, password: true });
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    setErrors({ email: emailError, password: passwordError, server: "" });

    if (emailError || passwordError) {
      toast.error("Please fix the errors");
      return;
    }

    setLoading(true);
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (data.accessToken) {
        localStorage.setItem("authToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        loginUser(data);
        toast.success("Welcome back!");
        setTimeout(() => {
          if (data.user.role === "admin") navigate("/admin");
          else if (data.user.role === "delivery") navigate("/delivery");
          else navigate("/");
        }, 500);
      } else if (data.error) {
        if (data.error === "EMAIL_NOT_FOUND") setErrors(prev => ({ ...prev, email: "Email not found" }));
        else if (data.error === "INCORRECT_PASSWORD") setErrors(prev => ({ ...prev, password: "Incorrect password" }));
        else setErrors(prev => ({ ...prev, server: data.message || "Login failed" }));
      }
    } catch (error) {
      if (error.error === "EMAIL_NOT_FOUND") setErrors(prev => ({ ...prev, email: "Email not found" }));
      else if (error.error === "INCORRECT_PASSWORD") setErrors(prev => ({ ...prev, password: "Incorrect password" }));
      else setErrors(prev => ({ ...prev, server: error.message || "Server error. Please try again." }));
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
            <FaShoppingBag style={{ color: isDarkMode ? "#050507" : "white", fontSize: "18px" }} />
          </div>
          <span style={{ ...containerStyles.logoText, color: textColor }}>ShopEase</span>
        </div>

        <h1 style={{ ...containerStyles.title, color: textColor }}>Welcome Back</h1>
        <p style={{ ...containerStyles.subtitle, color: textSecondary }}>Sign in to continue</p>

        {errors.server && <div style={{ ...containerStyles.errorBanner, borderColor: errorColor }}>{errors.server}</div>}

        <div style={containerStyles.form}>
          <div style={containerStyles.inputGroup}>
            <label style={{ ...containerStyles.label, color: textSecondary }}>Email</label>
            <div style={{ 
              ...containerStyles.inputWrapper, 
              backgroundColor: inputBg, 
              borderColor: touched.email && errors.email ? errorColor : focusedField === 'email' ? accentColor : borderColor,
            }}>
              <FaEnvelope style={{ ...containerStyles.inputIcon, color: focusedField === 'email' ? accentColor : textSecondary }} />
              <input
                type="email"
                name="email"
                style={{ ...containerStyles.input, color: textColor }}
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => handleBlur('email')}
              />
            </div>
            {touched.email && errors.email && <span style={{ ...containerStyles.error, color: errorColor }}>{errors.email}</span>}
          </div>

          <div style={containerStyles.inputGroup}>
            <label style={{ ...containerStyles.label, color: textSecondary }}>Password</label>
            <div style={{ 
              ...containerStyles.inputWrapper, 
              backgroundColor: inputBg, 
              borderColor: touched.password && errors.password ? errorColor : focusedField === 'password' ? accentColor : borderColor,
            }}>
              <FaLock style={{ ...containerStyles.inputIcon, color: focusedField === 'password' ? accentColor : textSecondary }} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                style={{ ...containerStyles.input, color: textColor }}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => handleBlur('password')}
              />
              <button type="button" style={containerStyles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash style={{ color: textSecondary }} /> : <FaEye style={{ color: textSecondary }} />}
              </button>
            </div>
            {touched.password && errors.password && <span style={{ ...containerStyles.error, color: errorColor }}>{errors.password}</span>}
          </div>

          <Link to="/forgot-password" style={{ ...containerStyles.forgotLink, color: accentColor }}>Forgot password?</Link>

          <button 
            style={{ ...containerStyles.submitBtn, background: `linear-gradient(135deg, ${accentColor}, ${accentLight})` }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p style={{ ...containerStyles.footerText, color: textSecondary }}>
            Don't have an account? <Link to="/register" style={{ ...containerStyles.link, color: accentColor }}>Create one</Link>
          </p>
        </div>
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
  themeBtn: {
    position: "fixed",
    top: "20px",
    right: "20px",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
  eyeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
  },
  error: {
    display: "block",
    marginTop: "6px",
    fontSize: "12px",
  },
  forgotLink: {
    textAlign: "right",
    fontSize: "13px",
    fontWeight: "500",
    textDecoration: "none",
    marginTop: "-8px",
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
