
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API, { getInitialsAvatar } from "../api/api";
import { 
  FaEye, FaEyeSlash, FaSave, FaTimes,
  FaUser, FaLock, FaEnvelope, FaCalendarAlt, FaShieldAlt 
} from "react-icons/fa";
 
export default function ProfileDropdown() {
  const { user, logoutUser, updateUsername } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
 
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
 
  // Form states
  const [formData, setFormData] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
 
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
 
  const dropdownRef = useRef();
 
  // Current user role style
  const currentRoleStyle = {
    borderColor: isDarkMode ? "#c9a962" : "#6366f1",
    badgeColor: isDarkMode ? "#c9a962" : "#6366f1",
    dropdownBg: isDarkMode ? "#1e1e28" : "#ffffff",
  };
 
  // Check mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
 
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || "",
      }));
    }
  }, [user]);
 
  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        handleCloseDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
// Password strength calculator
  useEffect(() => {
    const password = formData.newPassword;
    let strength = 0;
 
    if (password) {
      if (password.length >= 6) strength += 15;
      if (password.length >= 8) strength += 15;
      if (/[A-Z]/.test(password)) strength += 20;
      if (/[a-z]/.test(password)) strength += 15;
      if (/[0-9]/.test(password)) strength += 15;
      if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    }
 
    setPasswordStrength(strength);
  }, [formData.newPassword]);
 
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
 
  // Validation functions
  const validateForm = () => {
    const newErrors = {};
 
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username cannot be empty";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (formData.username.trim().length > 20) {
      newErrors.username = "Username must be less than 20 characters";
    }
 
    // Password validation (only if changing password)
    if (isChangingPassword) {
      if (!formData.oldPassword) {
        newErrors.oldPassword = "Old password is required";
      }
 
      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters";
      }
 
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
 
    // Mark as touched
    setTouched(prev => ({ ...prev, [name]: true }));
 
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
 
const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // ========== MAIN HANDLE SAVE FUNCTION ==========
  const handleSave = async () => {
    // Validate form first
    if (!validateForm()) {
      const firstError = Object.values(errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }
 
    try {
      setLoading(true);
 
      const formDataToSend = new FormData();
 
// Always send username
      formDataToSend.append("username", formData.username.trim());

      // ✅ CRITICAL FIX: Only send password fields if changing password
      if (isChangingPassword) {
        formDataToSend.append("oldPassword", formData.oldPassword);
        formDataToSend.append("newPassword", formData.newPassword);
      }

      // Debug log
      console.log("📤 Sending update request:", {
        username: formData.username,
        isChangingPassword: isChangingPassword,
        hasOldPassword: isChangingPassword ? !!formData.oldPassword : false,
        hasNewPassword: isChangingPassword ? !!formData.newPassword : false,
      });
 
      // API call
      const res = await API.put("/user/update-profile", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
 
      console.log("✅ Update response:", res.data);
  
      // Check response structure
      if (res.data?.status === "success" && res.data?.user) {
        // Update context
        updateUsername(res.data.user.username);

        toast.success("Profile updated successfully!");

        // Reset form
        handleCancelEdit();
      } else {
        throw new Error(res.data?.message || "Update failed");
      }
    } catch (err) {
      console.error("❌ Update error:", err);
 
      // Handle specific error messages
      const errorMsg = err.response?.data?.message || err.message;
 
      if (errorMsg.includes("Old password is incorrect")) {
        setErrors(prev => ({ ...prev, oldPassword: "Incorrect password" }));
        toast.error("Incorrect old password");
      } else if (errorMsg.includes("Old password is required")) {
        setErrors(prev => ({ ...prev, oldPassword: "Old password required" }));
        toast.error("Please enter your old password");
      } else {
        toast.error(errorMsg || "Update failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
 
  const handleCancelEdit = () => {
    setFormData({
      username: user?.username || "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsChangingPassword(false);
    setErrors({});
    setTouched({});
    setShowPassword({
      old: false,
      new: false,
      confirm: false,
    });
    setEditMode(false);
  };
 
  const handleCloseDropdown = () => {
    setOpen(false);
    handleCancelEdit();
  };
 
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
 
  if (!user) return null;
 
  // Styles
  const styles = {
    container: {
      position: "relative",
      display: "inline-block",
    },
    profileImage: {
      width: isMobile ? 40 : 44,
      height: isMobile ? 40 : 44,
      borderRadius: "50%",
      objectFit: "cover",
      cursor: "pointer",
      border: `2px solid ${currentRoleStyle.borderColor}`,
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    dropdown: {
      position: "fixed",
      top: isMobile ? "450%" : 60,
      left: isMobile ? "50%" : "auto",
      right: isMobile ? "auto" : 0,
      transform: isMobile ? "translate(-50%, -50%)" : "none",
      bottom: "auto",
      width: isMobile ? "90%" : 380,
      maxWidth: isMobile ? "400px" : "380px",
      borderRadius: 16,
      background: currentRoleStyle.dropdownBg,
      boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
      padding: isMobile ? 20 : 24,
      zIndex: 999,
      maxHeight: isMobile ? "85vh" : "auto",
      overflowY: "auto",
    },
    profileHeader: {
      textAlign: "center",
      marginBottom: 16,
    },
    avatar: {
      width: isMobile ? 90 : 100,
      height: isMobile ? 90 : 100,
      borderRadius: "50%",
      margin: "0 auto",
      border: `3px solid ${currentRoleStyle.borderColor}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    },
    username: {
      fontWeight: "bold",
      marginTop: 12,
      marginBottom: 4,
      fontSize: isMobile ? 18 : 20,
      color: isDarkMode ? "#e8d5a3" : "#212529",
    },
    role: {
      textTransform: "uppercase",
      fontSize: isMobile ? 11 : 12,
      color: currentRoleStyle.badgeColor,
      marginBottom: 4,
      fontWeight: 600,
      letterSpacing: 1,
    },
    email: {
      fontSize: isMobile ? 12 : 13,
      color: isDarkMode ? "rgba(255,255,255,0.6)" : "#6c757d",
      marginBottom: 4,
      wordBreak: "break-all",
    },
    joined: {
      fontSize: isMobile ? 10 : 11,
      color: isDarkMode ? "rgba(255,255,255,0.6)" : "#6c757d",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },
    divider: {
      margin: "16px 0",
      border: "none",
      borderTop: `1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "#e9ecef"}`,
    },
    formGroup: {
      marginBottom: 16,
    },
    label: {
      display: "block",
      marginBottom: 6,
      fontSize: 12,
      fontWeight: 600,
      color: isDarkMode ? "#e8d5a3" : "#495057",
      letterSpacing: 0.5,
    },
    inputWrapper: {
      display: "flex",
      alignItems: "center",
      border: `1px solid ${
        errors[Object.keys(errors).find(key => key.includes('assword'))] 
          ? "#dc3545" 
          : isDarkMode ? "rgba(201, 169, 98, 0.3)" : "#ced4da"
      }`,
      borderRadius: 8,
      transition: "all 0.2s",
      background: isDarkMode ? "rgba(255,255,255,0.05)" : "#fff",
    },
    input: {
      flex: 1,
      padding: isMobile ? "12px" : "10px 12px",
      border: "none",
      outline: "none",
      fontSize: 14,
      background: "transparent",
      width: "100%",
      color: isDarkMode ? "#fff" : "#212529",
    },
    passwordToggle: {
      padding: "0 12px",
      cursor: "pointer",
      color: isDarkMode ? "#c9a962" : "#6c757d",
      border: "none",
      background: "transparent",
      fontSize: 16,
    },
    errorText: {
      color: "#dc3545",
      fontSize: 11,
      marginTop: 4,
      marginLeft: 4,
    },
    fileInput: {
      display: "none",
    },
    fileInputLabel: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: isMobile ? "12px" : "10px",
      border: `1px dashed ${isDarkMode ? "#c9a962" : "#6366f1"}`,
      borderRadius: 8,
      cursor: "pointer",
      color: "#c9a962",
      fontSize: 13,
      marginBottom: 16,
      transition: "all 0.2s",
    },
    passwordStrength: {
      marginTop: 6,
      height: 4,
      background: isDarkMode ? "rgba(255,255,255,0.1)" : "#e9ecef",
      borderRadius: 2,
      overflow: "hidden",
    },
    strengthBar: {
      height: "100%",
      width: `${passwordStrength}%`,
      background: getStrengthColor(),
      transition: "width 0.3s",
    },
    strengthText: {
      fontSize: 10,
      marginTop: 4,
      color: getStrengthColor(),
      textAlign: "right",
      fontWeight: 600,
    },
    changePasswordLink: {
      textAlign: "center",
      margin: "12px 0",
      color: "#c9a962",
      cursor: "pointer",
      fontSize: 13,
      textDecoration: "underline",
      fontWeight: 500,
    },
    buttonContainer: {
      display: "flex",
      gap: 10,
      marginTop: 20,
    },
    button: {
      flex: 1,
      padding: isMobile ? "12px" : "10px",
      borderRadius: 8,
      border: "none",
      cursor: loading ? "not-allowed" : "pointer",
      fontWeight: 600,
      fontSize: isMobile ? 14 : 13,
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      opacity: loading ? 0.7 : 1,
    },
    primaryButton: {
      background: "linear-gradient(135deg, #c9a962, #e8d5a3)",
      color: "#000",
    },
    secondaryButton: {
      background: isDarkMode ? "rgba(255,255,255,0.1)" : "#6c757d",
      color: isDarkMode ? "#fff" : "#fff",
    },
    dangerButton: {
      backgroundColor: "#dc3545",
      color: "#fff",
    },
    infoButton: {
      background: "linear-gradient(135deg, #c9a962, #e8d5a3)",
      color: "#000",
    },
    successButton: {
      background: "linear-gradient(135deg, #c9a962, #e8d5a3)",
      color: "#000",
    },
  };
 
  return (
    <div style={styles.container} ref={dropdownRef}>
      <img
        onClick={() => setOpen(!open)}
        src={getInitialsAvatar(user?.username || "User", "6366f1")}
        alt="Profile"
        style={styles.profileImage}
        onMouseEnter={(e) => !isMobile && (e.currentTarget.style.transform = "scale(1.05)", e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)")}
        onMouseLeave={(e) => !isMobile && (e.currentTarget.style.transform = "scale(1)", e.currentTarget.style.boxShadow = "none")}
      />

      {open && (
        <div style={styles.dropdown}>
          <div style={styles.profileHeader}>
            <div style={styles.avatar}>
              <span style={{ fontSize: "2rem", fontWeight: "bold", color: "#fff" }}>
                {(user?.username || "U").charAt(0).toUpperCase()}
              </span>
            </div>
 
            {!editMode && (
              <>
                <h6 style={styles.username}>{user.username}</h6>
                <h6 style={styles.role}>
                  <FaShieldAlt style={{ marginRight: 4, fontSize: 10 }} />
                  {user.role.toUpperCase()}
                </h6>
                <small style={styles.email}>
                  <FaEnvelope style={{ marginRight: 4, fontSize: 10 }} />
                  {user.email}
                </small>
                <div style={styles.joined}>
                  <FaCalendarAlt style={{ marginRight: 4, fontSize: 9 }} />
                  Joined: {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "N/A"}
                </div>
              </>
            )}
          </div>
 
          <hr style={styles.divider} />
 
          {editMode ? (
            <>
              {/* Hidden file input */}
{/* Username field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <FaUser style={{ marginRight: 4, fontSize: 11 }} />
                  USERNAME
                </label>
                <div style={styles.inputWrapper}>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('username')}
                    style={styles.input}
                    placeholder="Enter username"
                    disabled={loading}
                  />
                </div>
                {errors.username && touched.username && (
                  <div style={styles.errorText}>{errors.username}</div>
                )}
              </div>
 
              {/* Change Password Toggle */}
              {!isChangingPassword ? (
                <div 
                  style={styles.changePasswordLink}
                  onClick={() => setIsChangingPassword(true)}
                >
                  + Change Password
                </div>
              ) : (
                <>
                  {/* Old Password field */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <FaLock style={{ marginRight: 4, fontSize: 11 }} />
                      OLD PASSWORD
                    </label>
                    <div style={styles.inputWrapper}>
                      <input
                        type={showPassword.old ? "text" : "password"}
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('oldPassword')}
                        style={styles.input}
                        placeholder="Enter old password"
                        disabled={loading}
                      />
                      <span
                        style={styles.passwordToggle}
                        onClick={() => togglePasswordVisibility('old')}
                      >
                        {showPassword.old ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    {errors.oldPassword && touched.oldPassword && (
                      <div style={styles.errorText}>{errors.oldPassword}</div>
                    )}
                  </div>
 
                  {/* New Password field */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <FaLock style={{ marginRight: 4, fontSize: 11 }} />
                      NEW PASSWORD
                    </label>
                    <div style={styles.inputWrapper}>
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('newPassword')}
                        style={styles.input}
                        placeholder="Enter new password"
                        disabled={loading}
                      />
                      <span
                        style={styles.passwordToggle}
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
 
                    {/* Password strength indicator */}
                    {formData.newPassword && (
                      <>
                        <div style={styles.passwordStrength}>
                          <div style={styles.strengthBar} />
                        </div>
                        <div style={styles.strengthText}>
                          {getStrengthText()} ({passwordStrength}%)
                        </div>
                      </>
                    )}
 
                    {errors.newPassword && touched.newPassword && (
                      <div style={styles.errorText}>{errors.newPassword}</div>
                    )}
                  </div>
 
                  {/* Confirm Password field */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <FaLock style={{ marginRight: 4, fontSize: 11 }} />
                      CONFIRM PASSWORD
                    </label>
                    <div style={styles.inputWrapper}>
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('confirmPassword')}
                        style={styles.input}
                        placeholder="Confirm new password"
                        disabled={loading}
                      />
                      <span
                        style={styles.passwordToggle}
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    {errors.confirmPassword && touched.confirmPassword && (
                      <div style={styles.errorText}>{errors.confirmPassword}</div>
                    )}
                  </div>
 
                  {/* Cancel password change link */}
                  <div 
                    style={{...styles.changePasswordLink, color: "#6c757d"}}
                    onClick={() => {
                      setIsChangingPassword(false);
                      setFormData(prev => ({
                        ...prev,
                        oldPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      }));
                      setErrors(prev => {
                        const newErrors = {...prev};
                        delete newErrors.oldPassword;
                        delete newErrors.newPassword;
                        delete newErrors.confirmPassword;
                        return newErrors;
                      });
                    }}
                  >
                    - Cancel Password Change
                  </div>
                </>
              )}
 
              {/* Action buttons */}
              <div style={styles.buttonContainer}>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  style={{ ...styles.button, ...styles.primaryButton }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={loading}
                  style={{ ...styles.button, ...styles.secondaryButton }}
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditMode(true)}
                style={{ 
                  ...styles.button, 
                  ...styles.primaryButton,
                  width: "100%",
                  marginBottom: 8
                }}
              >
                Edit Profile
              </button>
 
              {user.role === "user" && (
                <button
                  onClick={() => {
                    navigate("/profile/addresses");
                    setOpen(false);
                  }}
                  style={{ 
                    ...styles.button, 
                    ...styles.infoButton,
                    width: "100%",
                    marginBottom: 8
                  }}
                >
                  Manage Addresses
                </button>
              )}

              {user.role === "vendor" && (
                <button
                  onClick={() => {
                    navigate("/delivery/dashboard");
                    setOpen(false);
                  }}
                  style={{ 
                    ...styles.button, 
                    ...styles.successButton,
                    width: "100%",
                    marginBottom: 8
                  }}
                >
                  Delivery Dashboard
                </button>
              )}

              {/* Always show logout button for all roles */}
              <button
                onClick={async () => {
                  await logoutUser();
                  setOpen(false);
                  navigate("/login");
                }}
                style={{ 
                  ...styles.button, 
                  ...styles.dangerButton,
                  width: "100%",
                  marginTop: 8
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
 
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinner-border {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
          margin-right: 8px;
        }
        input:focus {
          outline: none;
        }
        input:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
 
 
 