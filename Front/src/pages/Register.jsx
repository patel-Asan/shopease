import { useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/api";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaSun, FaMoon, FaShoppingBag, FaCheck, FaTimes, FaCamera } from "react-icons/fa";

export default function Register() {
  const { loginUser } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ username: "", email: "", password: "", profileImage: null });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({ username: "", email: "", password: "", server: "" });
  const [touched, setTouched] = useState({ username: false, email: false, password: false });
  const [strength, setStrength] = useState({ score: 0, length: false, number: false, upper: false });

  const validateUsername = (username) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "At least 3 characters required";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Only letters, numbers, underscores";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "At least 6 characters required";
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const score = (password.length >= 8 ? 1 : 0) + (hasNumber ? 1 : 0) + (hasUpper ? 1 : 0);
    setStrength({ score, length: password.length >= 8, number: hasNumber, upper: hasUpper });
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched[name]) {
      const error = name === 'username' ? validateUsername(value) : name === 'email' ? validateEmail(value) : validatePassword(value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setFocusedField(null);
    const value = form[field];
    const error = field === 'username' ? validateUsername(value) : field === 'email' ? validateEmail(value) : validatePassword(value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setForm(prev => ({ ...prev, profileImage: file }));
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      toast.success("Image selected!");
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ username: true, email: true, password: true });
    const usernameError = validateUsername(form.username);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    setErrors({ username: usernameError, email: emailError, password: passwordError, server: "" });

    if (usernameError || emailError || passwordError) {
      toast.error("Please fix the errors");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("role", "user");
      if (form.profileImage) {
        formData.append("profileImage", form.profileImage);
      }

      const data = await apiFetch("/auth/register", { method: "POST", body: formData });

      if (data.accessToken) {
        localStorage.setItem("authToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        loginUser(data);
        toast.success("Account created successfully!");
        setTimeout(() => navigate("/"), 500);
      } else if (data.error) {
        if (data.error === "EMAIL_EXISTS") setErrors(prev => ({ ...prev, email: "Email already registered" }));
        else if (data.error === "USERNAME_EXISTS") setErrors(prev => ({ ...prev, username: "Username taken" }));
        else setErrors(prev => ({ ...prev, server: data.message || "Registration failed" }));
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, server: "Server error. Please try again." }));
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
  const strengthColors = ["#ef4444", "#f59e0b", "#10b981", "#22c55e"];

  return (
    <div style={{ ...s.wrapper, backgroundColor: bgColor }}>
      <div style={s.orb1} />
      <div style={s.orb2} />
      
      <button onClick={() => navigate("/")} style={{ ...s.backBtn, borderColor, color: textColor }}>
        <FaArrowLeft /> Back
      </button>

      <div style={{ ...s.card, backgroundColor: cardBg, borderColor }}>
        <div style={s.logo}>
          <div style={{ ...s.logoIcon, background: `linear-gradient(135deg, ${accentColor}, ${accentLight})` }}>
            <FaShoppingBag style={{ color: isDarkMode ? "#050507" : "white", fontSize: "18px" }} />
          </div>
          <span style={{ ...s.logoText, color: textColor }}>ShopEase</span>
        </div>

        <h1 style={{ ...s.title, color: textColor }}>Create Account</h1>
        <p style={{ ...s.subtitle, color: textSecondary }}>Join us today</p>

        {errors.server && <div style={{ ...s.errorBanner, borderColor: errorColor }}>{errors.server}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.avatarSection}>
            <div 
              style={{ ...s.avatar, border: `2px dashed ${accentColor}`, backgroundColor: inputBg }}
              onClick={handleAvatarClick}
            >
              {previewImage ? (
                <img src={previewImage} alt="Preview" style={s.avatarImg} />
              ) : (
                <div style={s.avatarPlaceholder}>
                  <FaCamera style={{ fontSize: "24px", color: accentColor }} />
                </div>
              )}
            </div>
            <p style={{ ...s.avatarHint, color: textSecondary }}>Click to add photo</p>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: "none" }} 
            />
          </div>

          <div style={s.inputGroup}>
            <label style={{ ...s.label, color: textSecondary }}>Username</label>
            <div style={{ 
              ...s.inputWrapper, 
              backgroundColor: inputBg, 
              borderColor: touched.username && errors.username ? errorColor : focusedField === 'username' ? accentColor : borderColor,
            }}>
              <FaUser style={{ ...s.inputIcon, color: focusedField === 'username' ? accentColor : textSecondary }} />
              <input
                type="text"
                name="username"
                style={{ ...s.input, color: textColor }}
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                onFocus={() => setFocusedField('username')}
                onBlur={() => handleBlur('username')}
              />
            </div>
            {touched.username && errors.username && <span style={{ ...s.error, color: errorColor }}>{errors.username}</span>}
          </div>

          <div style={s.inputGroup}>
            <label style={{ ...s.label, color: textSecondary }}>Email</label>
            <div style={{ 
              ...s.inputWrapper, 
              backgroundColor: inputBg, 
              borderColor: touched.email && errors.email ? errorColor : focusedField === 'email' ? accentColor : borderColor,
            }}>
              <FaEnvelope style={{ ...s.inputIcon, color: focusedField === 'email' ? accentColor : textSecondary }} />
              <input
                type="email"
                name="email"
                style={{ ...s.input, color: textColor }}
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => handleBlur('email')}
              />
            </div>
            {touched.email && errors.email && <span style={{ ...s.error, color: errorColor }}>{errors.email}</span>}
          </div>

          <div style={s.inputGroup}>
            <label style={{ ...s.label, color: textSecondary }}>Password</label>
            <div style={{ 
              ...s.inputWrapper, 
              backgroundColor: inputBg, 
              borderColor: touched.password && errors.password ? errorColor : focusedField === 'password' ? accentColor : borderColor,
            }}>
              <FaLock style={{ ...s.inputIcon, color: focusedField === 'password' ? accentColor : textSecondary }} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                style={{ ...s.input, color: textColor }}
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => handleBlur('password')}
              />
              <button type="button" style={s.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash style={{ color: textSecondary }} /> : <FaEye style={{ color: textSecondary }} />}
              </button>
            </div>
            {touched.password && errors.password && <span style={{ ...s.error, color: errorColor }}>{errors.password}</span>}
            
            {form.password && (
              <div style={s.strengthBox}>
                <div style={s.strengthBar}>
                  <div style={{ ...s.strengthFill, width: `${strength.score * 33}%`, backgroundColor: strengthColors[strength.score - 1] || "#ef4444" }} />
                </div>
                <div style={s.strengthChecks}>
                  <span style={{ color: strength.length ? "#10b981" : textSecondary }}>
                    {strength.length ? <FaCheck /> : <FaTimes />} 8+ chars
                  </span>
                  <span style={{ color: strength.number ? "#10b981" : textSecondary }}>
                    {strength.number ? <FaCheck /> : <FaTimes />} Number
                  </span>
                  <span style={{ color: strength.upper ? "#10b981" : textSecondary }}>
                    {strength.upper ? <FaCheck /> : <FaTimes />} Uppercase
                  </span>
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit"
            style={{ ...s.submitBtn, background: `linear-gradient(135deg, ${accentColor}, ${accentLight})` }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p style={{ ...s.footerText, color: textSecondary }}>
            Already have an account? <Link to="/login" style={{ ...s.link, color: accentColor }}>Sign in</Link>
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

const s = {
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
    maxWidth: "420px",
    padding: "36px",
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
    marginBottom: "20px",
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
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "6px",
  },
  subtitle: {
    fontSize: "14px",
    marginBottom: "24px",
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
    gap: "16px",
  },
  avatarSection: {
    marginBottom: "12px",
  },
  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    margin: "0 auto",
    overflow: "hidden",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  avatarHint: {
    fontSize: "12px",
    marginTop: "8px",
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
  strengthBox: {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "10px",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  strengthBar: {
    height: "4px",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "2px",
    marginBottom: "8px",
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: "2px",
    transition: "all 0.3s ease",
  },
  strengthChecks: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
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
