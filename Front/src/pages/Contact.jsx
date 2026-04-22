import React, { useState, useContext, useEffect, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { apiFetch } from "../api/api";
import { toast } from "react-toastify";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaSun, FaMoon, FaUpload, FaTimes, FaFileAlt, FaMapMarkedAlt } from "react-icons/fa";
import Footer from "../components/Footer";

function Contact() {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: user?.username || "",
    email: user?.email || "",
    message: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 480);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email";
        return "";
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 10) return "Message must be at least 10 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (focusedField === name) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFocusedField(null);
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      toast.warning("Maximum 5 files allowed");
      return;
    }
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    const newFiles = selectedFiles.filter(file => {
      if (!validTypes.includes(file.type)) {
        toast.warning(`${file.name} is not a valid file type`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.warning(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });
    setFiles([...files, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 480);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const s = useMemo(() => getStyles(isMobile), [isMobile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };
    setErrors(newErrors);

    if (newErrors.name || newErrors.email || newErrors.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", formData.name.trim());
      form.append("email", formData.email.trim());
      form.append("message", formData.message.trim());
      files.forEach((file) => form.append("files", file));

      const data = await apiFetch("/contact", { method: "POST", body: form });

      if (data.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: user?.username || "", email: user?.email || "", message: "" });
        setFiles([]);
        setErrors({});
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
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

  return (
    <div style={{ ...s.wrapper, backgroundColor: bgColor }}>
      <div style={s.orb1} />
      <div style={s.orb2} />

      <div style={s.container}>
        <div style={{ ...s.header, borderBottom: `1px solid ${borderColor}` }}>
          <h1 style={{ ...s.title, color: textColor }}>Contact Us</h1>
          <p style={{ ...s.subtitle, color: textSecondary }}>We'd love to hear from you</p>
        </div>

        <div style={s.content}>
          <div style={s.infoGrid}>
            <div style={{ ...s.infoCard, backgroundColor: cardBg, borderColor }}>
              <div style={{ ...s.infoIcon, background: `linear-gradient(135deg, ${accentColor}, ${accentLight})` }}>
                <FaEnvelope style={{ color: "white", fontSize: "18px" }} />
              </div>
              <div>
                <h3 style={{ ...s.infoTitle, color: textColor }}>Email</h3>
                <p style={{ ...s.infoText, color: textSecondary }}>support@ShopEase.com</p>
              </div>
            </div>

            <div style={{ ...s.infoCard, backgroundColor: cardBg, borderColor }}>
              <div style={{ ...s.infoIcon, background: `linear-gradient(135deg, ${accentColor}, ${accentLight})` }}>
                <FaPhone style={{ color: "white", fontSize: "18px" }} />
              </div>
              <div>
                <h3 style={{ ...s.infoTitle, color: textColor }}>Phone</h3>
                <p style={{ ...s.infoText, color: textSecondary }}>+1 (555) 123-4567</p>
              </div>
            </div>

            <div style={{ ...s.infoCard, backgroundColor: cardBg, borderColor }}>
              <div style={{ ...s.infoIcon, background: `linear-gradient(135deg, ${accentColor}, ${accentLight})` }}>
                <FaMapMarkerAlt style={{ color: "white", fontSize: "18px" }} />
              </div>
              <div>
                <h3 style={{ ...s.infoTitle, color: textColor }}>Location</h3>
                <p style={{ ...s.infoText, color: textSecondary }}>123 ShopEase Street, NYC</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.inputGroup}>
              <label style={{ ...s.label, color: textSecondary }}>Name</label>
              <div style={{
                ...s.inputWrapper,
                backgroundColor: inputBg,
                borderColor: errors.name ? "#ef4444" : focusedField === 'name' ? accentColor : borderColor,
              }}>
                <input
                  type="text"
                  name="name"
                  style={{ ...s.input, color: textColor }}
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={handleBlur}
                />
              </div>
              {errors.name && <span style={s.error}>{errors.name}</span>}
            </div>

            <div style={s.inputGroup}>
              <label style={{ ...s.label, color: textSecondary }}>Email</label>
              <div style={{
                ...s.inputWrapper,
                backgroundColor: inputBg,
                borderColor: errors.email ? "#ef4444" : focusedField === 'email' ? accentColor : borderColor,
              }}>
                <input
                  type="email"
                  name="email"
                  style={{ ...s.input, color: textColor }}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={handleBlur}
                />
              </div>
              {errors.email && <span style={s.error}>{errors.email}</span>}
            </div>

            <div style={s.inputGroup}>
              <label style={{ ...s.label, color: textSecondary }}>Message</label>
              <div style={{
                ...s.textareaWrapper,
                backgroundColor: inputBg,
                borderColor: errors.message ? "#ef4444" : focusedField === 'message' ? accentColor : borderColor,
              }}>
                <textarea
                  name="message"
                  style={{ ...s.textarea, color: textColor }}
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={handleBlur}
                  rows="5"
                />
              </div>
              {errors.message && <span style={s.error}>{errors.message}</span>}
            </div>

            <div style={s.inputGroup}>
              <label style={{ ...s.label, color: textSecondary }}>Attachments (Optional)</label>
              <div style={{ ...s.uploadBox, backgroundColor: inputBg, borderColor }}>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFilesChange}
                  style={{ display: "none" }}
                  id="fileInput"
                />
                <label htmlFor="fileInput" style={s.uploadLabel}>
                  <FaUpload style={{ color: accentColor, fontSize: "24px" }} />
                  <span style={{ color: textSecondary }}>Click to upload files</span>
                  <span style={{ ...s.uploadHint, color: textSecondary }}>Max 5 files, 5MB each</span>
                </label>
              </div>

              {files.length > 0 && (
                <div style={s.filesGrid}>
                  {files.map((file, index) => (
                    <div key={index} style={{ ...s.fileItem, backgroundColor: cardBg, borderColor }}>
                      <FaFileAlt style={{ color: accentColor }} />
                      <span style={{ ...s.fileName, color: textColor }}>{file.name}</span>
                      <button type="button" onClick={() => handleRemoveFile(index)} style={s.removeBtn}>
                        <FaTimes style={{ fontSize: "12px" }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{ ...s.submitBtn, background: `linear-gradient(135deg, ${accentColor}, ${accentLight})` }}
              disabled={loading}
            >
              <FaPaperPlane /> {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      <div style={s.mapSection}>
        <div style={s.mapContainer}>
          <div style={s.mapHeader}>
            <FaMapMarkedAlt style={{ color: accentColor, fontSize: "24px" }} />
            <h3 style={{ ...s.mapTitle, color: textColor }}>Find Us Here</h3>
          </div>
          <div style={s.mapWrapper}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986432970718!3d40.697149413097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin"
              style={s.mapIframe}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ShopEase Location"
            />
          </div>
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

const getStyles = (isMobile) => ({
  wrapper: {
    minHeight: "100vh",
    padding: isMobile ? "60px 12px 40px" : "60px 20px 40px",
    position: "relative",
    overflow: "hidden",
  },
  orb1: {
    position: "fixed",
    top: "-20%",
    right: "-10%",
    width: isMobile ? "250px" : "500px",
    height: isMobile ? "250px" : "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(201, 169, 98, 0.12) 0%, transparent 70%)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  orb2: {
    position: "fixed",
    bottom: "-20%",
    left: "-10%",
    width: isMobile ? "200px" : "400px",
    height: isMobile ? "200px" : "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  container: {
    maxWidth: isMobile ? "100%" : "700px",
    margin: "0 auto",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: isMobile ? "16px" : "24px",
    overflow: "hidden",
    animation: "fadeIn 0.5s ease",
    position: "relative",
    zIndex: 1,
  },
  header: {
    padding: isMobile ? "24px 20px 20px" : "40px 40px 30px",
    textAlign: "center",
  },
  title: {
    fontSize: isMobile ? "24px" : "28px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: isMobile ? "14px" : "15px",
  },
  content: {
    padding: isMobile ? "0 16px 24px" : "0 40px 40px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(180px, 1fr))",
    gap: isMobile ? "12px" : "16px",
    marginBottom: isMobile ? "24px" : "32px",
  },
  infoCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: isMobile ? "14px" : "20px",
    border: "1px solid",
    borderRadius: "12px",
  },
  infoIcon: {
    width: isMobile ? "36px" : "44px",
    height: isMobile ? "36px" : "44px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoTitle: {
    fontSize: isMobile ? "13px" : "14px",
    fontWeight: "600",
    marginBottom: "2px",
  },
  infoText: {
    fontSize: isMobile ? "12px" : "13px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: isMobile ? "16px" : "20px",
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
  input: {
    flex: 1,
    padding: isMobile ? "12px 0" : "14px 0",
    border: "none",
    outline: "none",
    fontSize: "15px",
    background: "transparent",
    fontFamily: "inherit",
  },
  textareaWrapper: {
    border: "1px solid",
    borderRadius: "12px",
    padding: "12px 14px",
    transition: "all 0.3s ease",
  },
  textarea: {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: "15px",
    background: "transparent",
    resize: "vertical",
    minHeight: isMobile ? "100px" : "120px",
    fontFamily: "inherit",
  },
  error: {
    display: "block",
    marginTop: "6px",
    fontSize: "12px",
    color: "#ef4444",
  },
  uploadBox: {
    border: "2px dashed",
    borderRadius: "12px",
    padding: isMobile ? "16px" : "24px",
    textAlign: "center",
    cursor: "pointer",
  },
  uploadLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
  },
  uploadHint: {
    fontSize: "11px",
  },
  filesGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "12px",
  },
  fileItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    border: "1px solid",
    borderRadius: "10px",
    fontSize: "13px",
  },
  fileName: {
    maxWidth: isMobile ? "100px" : "120px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  removeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#ef4444",
    display: "flex",
    alignItems: "center",
    padding: 0,
  },
  submitBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: isMobile ? "14px" : "16px",
    border: "none",
    borderRadius: "12px",
    fontSize: isMobile ? "15px" : "16px",
    fontWeight: "600",
    color: "#050507",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "8px",
  },
  mapSection: {
    maxWidth: isMobile ? "100%" : "1200px",
    margin: isMobile ? "24px auto 0" : "40px auto 0",
    padding: "0",
    position: "relative",
    zIndex: 1,
  },
  mapContainer: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: isMobile ? "16px" : "24px",
    overflow: "hidden",
    padding: isMobile ? "16px" : "30px",
  },
  mapWrapper: {
    borderRadius: "12px",
    overflow: "hidden",
    height: isMobile ? "250px" : "400px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  mapHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
  },
  mapTitle: {
    fontSize: isMobile ? "16px" : "20px",
    fontWeight: "700",
    margin: 0,
  },
  mapIframe: {
    width: "100%",
    height: "100%",
    border: "none",
  },
});

export default Contact;
