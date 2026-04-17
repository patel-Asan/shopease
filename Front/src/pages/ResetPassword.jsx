
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api/api";
import { toast } from "react-toastify";
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle, FaKey } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const { isDarkMode } = useTheme();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ password: "", confirmPassword: "", server: "" });
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });
  const [focusedField, setFocusedField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const data = await apiFetch(`/auth/verify-reset-token/${token}`);
        if (!data.valid) {
          setTokenValid(false);
          toast.error("Invalid or expired reset link");
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

  useEffect(() => {
    const password = form.password;
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    setPasswordStrength(Math.min(strength, 100));
  }, [form.password]);

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "#ef4444";
    if (passwordStrength < 70) return "#f59e0b";
    return "#10b981";
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Medium";
    return "Strong";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
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

    if (touched[name]) {
      const error = name === 'password' ? validatePassword(value) : validateConfirmPassword(value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setFocusedField(null);

    const error = field === 'password' ? validatePassword(form.password) : validateConfirmPassword(form.confirmPassword);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });

    const passwordError = validatePassword(form.password);
    const confirmError = validateConfirmPassword(form.confirmPassword);

    if (passwordError || confirmError) {
      setErrors({ password: passwordError, confirmPassword: confirmError, server: "" });
      if (passwordError) toast.warning(passwordError);
      else if (confirmError) toast.warning(confirmError);
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
        toast.success("Password reset successful!");
        setTimeout(() => navigate("/login"), 2000);
      } else if (data.error) {
        if (data.error === "INVALID_TOKEN") {
          setErrors((prev) => ({ ...prev, server: "Invalid or expired reset link" }));
          toast.error("Invalid or expired reset link");
        } else {
          setErrors((prev) => ({ ...prev, server: "Failed to reset password" }));
          toast.error("Failed to reset password");
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

  if (!tokenValid) {
    return (
      <div style={{ ...containerStyles.wrapper, backgroundColor: bgColor }}>
        <div style={containerStyles.orb1} />
        <div style={containerStyles.orb2} />

        <button onClick={() => navigate("/")} style={{ ...containerStyles.backBtn, borderColor: borderColor, color: textColor }}>
          <FaArrowLeft /> Back
        </button>

        <div style={{ ...containerStyles.card, backgroundColor: cardBg, borderColor: borderColor }}>
          <div style={containerStyles.logo}>
            <div style={{ ...containerStyles.logoIcon, background: `linear-gradient(135deg, ${errorColor}, #f87171)` }}>
              <FaLock style={{ color: "white", fontSize: "18px" }} />
            </div>
            <span style={{ ...containerStyles.logoText, color: textColor }}>ShopEase</span>
          </div>

          <h1 style={{ ...containerStyles.title, color: textColor }}>Link Expired</h1>
          <p style={{ ...containerStyles.subtitle, color: textSecondary }}>
            This password reset link has expired or is invalid
          </p>

          <Link to="/forgot-password" style={{ ...containerStyles.submitBtn, background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`, textDecoration: "none", display: "block" }}>
            Request New Link
          </Link>

          <p style={{ ...containerStyles.footerText, color: textSecondary, marginTop: "20px" }}>
            Remember password? <Link to="/login" style={{ ...containerStyles.link, color: accentColor }}>Sign in</Link>
          </p>
        </div>

        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ ...containerStyles.wrapper, backgroundColor: bgColor }}>
        <div style={containerStyles.orb1} />
        <div style={containerStyles.orb2} />

        <div style={{ ...containerStyles.card, backgroundColor: cardBg, borderColor: borderColor }}>
          <div style={{ ...containerStyles.successIcon }}>
            <FaCheckCircle style={{ fontSize: "60px", color: successColor }} />
          </div>

          <h1 style={{ ...containerStyles.title, color: textColor }}>Password Reset!</h1>
          <p style={{ ...containerStyles.subtitle, color: textSecondary }}>
            Your password has been reset successfully
          </p>

          <p style={{ color: textSecondary, marginTop: "20px" }}>Redirecting to login...</p>
        </div>

        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    );
  }

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

        <h1 style={{ ...containerStyles.title, color: textColor }}>Reset Password</h1>
        <p style={{ ...containerStyles.subtitle, color: textSecondary }}>Enter your new password</p>

        {errors.server && (
          <div style={{ ...containerStyles.errorBanner, borderColor: errorColor }}>{errors.server}</div>
        )}

        <form style={containerStyles.form} onSubmit={handleSubmit}>
          <div style={containerStyles.inputGroup}>
            <label style={{ ...containerStyles.label, color: textSecondary }}>New Password</label>
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
                placeholder="Enter new password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => handleBlur('password')}
              />
              <button type="button" style={containerStyles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash style={{ color: textSecondary }} /> : <FaEye style={{ color: textSecondary }} />}
              </button>
            </div>
            {form.password && (
              <div style={containerStyles.strengthBar}>
                <div style={{ ...containerStyles.strengthFill, width: `${passwordStrength}%`, backgroundColor: getStrengthColor() }} />
              </div>
            )}
            {touched.password && errors.password && (
              <span style={{ ...containerStyles.error, color: errorColor }}>{errors.password}</span>
            )}
          </div>

          <div style={containerStyles.inputGroup}>
            <label style={{ ...containerStyles.label, color: textSecondary }}>Confirm Password</label>
            <div style={{
              ...containerStyles.inputWrapper,
              backgroundColor: inputBg,
              borderColor: touched.confirmPassword && errors.confirmPassword ? errorColor : focusedField === 'confirmPassword' ? accentColor : borderColor,
            }}>
              <FaLock style={{ ...containerStyles.inputIcon, color: focusedField === 'confirmPassword' ? accentColor : textSecondary }} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                style={{ ...containerStyles.input, color: textColor }}
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => handleBlur('confirmPassword')}
              />
              <button type="button" style={containerStyles.eyeBtn} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash style={{ color: textSecondary }} /> : <FaEye style={{ color: textSecondary }} />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <span style={{ ...containerStyles.error, color: errorColor }}>{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            style={{ ...containerStyles.submitBtn, background: `linear-gradient(135deg, ${accentColor}, ${accentLight})` }}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <p style={{ ...containerStyles.footerText, color: textSecondary }}>
            Remember password? <Link to="/login" style={{ ...containerStyles.link, color: accentColor }}>Sign in</Link>
          </p>
        </form>
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
  successIcon: {
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
  eyeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
  },
  strengthBar: {
    height: "4px",
    borderRadius: "2px",
    backgroundColor: "rgba(255,255,255,0.1)",
    marginTop: "8px",
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    transition: "all 0.3s ease",
    borderRadius: "2px",
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
