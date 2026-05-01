import React, { useState, useContext, useEffect, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { apiFetch } from "../api/api";
import { toast } from "react-toastify";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaUpload, FaTimes, FaFileAlt, FaMapMarkedAlt, FaChevronDown, FaQuestionCircle, FaClock, FaHeadset } from "react-icons/fa";
import Footer from "../components/Footer";

function Contact() {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: user?.username || "",
    email: user?.email || "",
    message: "",
    category: "inquiry",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaNums, setCaptchaNums] = useState({ a: 0, b: 0 });
  const [faqOpen, setFaqOpen] = useState(null);

  useEffect(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptchaNums({ a, b });
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Min 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
        return "";
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 10) return "Min 10 characters";
        return "";
      case "captcha":
        if (parseInt(value) !== captchaNums.a + captchaNums.b) return "Incorrect answer";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (focusedField === name) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFocusedField(null);
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
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
        toast.warning(`${file.name} is not supported`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.warning(`${file.name} exceeds 5MB`);
        return false;
      }
      return true;
    });
    setFiles([...files, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
      captcha: validateField("captcha", captchaAnswer),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      toast.error("Please fix the errors above");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", formData.name.trim());
      form.append("email", formData.email.trim());
      form.append("message", formData.message.trim());
      form.append("category", formData.category);
      form.append("priority", formData.category === "complaint" || formData.category === "bug_report" ? "urgent" : "normal");
      files.forEach((file) => form.append("files", file));
      const data = await apiFetch("/contact", { method: "POST", body: form });
      if (data.message || data.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: user?.username || "", email: user?.email || "", message: "", category: "inquiry" });
        setFiles([]);
        setErrors({});
        setCaptchaAnswer("");
        setCaptchaNums({ a: Math.floor(Math.random() * 10) + 1, b: Math.floor(Math.random() * 10) + 1 });
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const c = useMemo(() => colors(isDarkMode), [isDarkMode]);
  const st = useMemo(() => styles(isMobile, c), [isMobile, c]);

  return (
    <div style={st.page}>
      <div style={st.orb1} />
      <div style={st.orb2} />

      <div style={st.inner}>
        <div style={st.hero}>
          <h1 style={st.heroTitle}>Get in Touch</h1>
          <p style={st.heroSub}>Have a question or feedback? We'd love to hear from you.</p>
        </div>

        <div style={st.grid}>
          <div style={st.sidebar}>
            <div style={st.infoCard}>
              <div style={st.infoIcon}><FaEnvelope /></div>
              <div>
                <h3 style={st.infoLabel}>Email</h3>
                <p style={st.infoValue}>support@shopease.com</p>
              </div>
            </div>
            <div style={st.infoCard}>
              <div style={st.infoIcon}><FaPhone /></div>
              <div>
                <h3 style={st.infoLabel}>Phone</h3>
                <p style={st.infoValue}>+1 (555) 123-4567</p>
              </div>
            </div>
            <div style={st.infoCard}>
              <div style={st.infoIcon}><FaMapMarkerAlt /></div>
              <div>
                <h3 style={st.infoLabel}>Address</h3>
                <p style={st.infoValue}>123 ShopEase St, NYC</p>
              </div>
            </div>
            <div style={st.infoCard}>
              <div style={st.infoIcon}><FaClock /></div>
              <div>
                <h3 style={st.infoLabel}>Working Hours</h3>
                <p style={st.infoValue}>Mon - Fri: 9AM - 6PM</p>
              </div>
            </div>
            <div style={st.helpCard}>
              <FaHeadset style={st.helpIcon} />
              <p style={st.helpText}>Need immediate help? Check our <strong>FAQ section</strong> below for quick answers.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={st.form}>
            <div style={st.row}>
              <div style={st.field}>
                <label style={st.label}>Category</label>
                <select name="category" style={st.select} value={formData.category} onChange={handleChange}>
                  <option value="inquiry">💬 General Inquiry</option>
                  <option value="complaint">⚠️ Complaint</option>
                  <option value="feedback">👍 Feedback</option>
                  <option value="bug_report">🐛 Bug Report</option>
                </select>
              </div>
              <div style={st.field}>
                <label style={st.label}>Name</label>
                <input type="text" name="name" style={st.input(errors.name ? "red" : focusedField === 'name' ? c.accent : c.border)} placeholder="Your name" value={formData.name} onChange={handleChange} onFocus={() => setFocusedField('name')} onBlur={handleBlur} />
                {errors.name && <span style={st.err}>{errors.name}</span>}
              </div>
            </div>

            <div style={st.field}>
              <label style={st.label}>Email</label>
              <input type="email" name="email" style={st.input(errors.email ? "red" : focusedField === 'email' ? c.accent : c.border)} placeholder="your@email.com" value={formData.email} onChange={handleChange} onFocus={() => setFocusedField('email')} onBlur={handleBlur} />
              {errors.email && <span style={st.err}>{errors.email}</span>}
            </div>

            <div style={st.field}>
              <label style={st.label}>Message</label>
              <textarea name="message" style={st.textarea(errors.message ? "red" : focusedField === 'message' ? c.accent : c.border)} placeholder="Write your message..." value={formData.message} onChange={handleChange} onFocus={() => setFocusedField('message')} onBlur={handleBlur} rows="5" />
              {errors.message && <span style={st.err}>{errors.message}</span>}
            </div>

            <div style={st.field}>
              <label style={st.label}>Attachments (Optional)</label>
              <div style={st.uploadBox}>
                <input type="file" multiple accept="image/*,.pdf" onChange={handleFilesChange} style={{ display: "none" }} id="fileInput" />
                <label htmlFor="fileInput" style={st.uploadLabel}>
                  <FaUpload style={{ color: c.accent, fontSize: "22px" }} />
                  <span style={{ color: c.textSec }}>Drop files here or click to upload</span>
                  <span style={st.uploadHint}>Max 5 files, 5MB each</span>
                </label>
              </div>
              {files.length > 0 && (
                <div style={st.filesGrid}>
                  {files.map((file, i) => (
                    <div key={i} style={st.fileChip}>
                      <FaFileAlt style={{ color: c.accent, flexShrink: 0 }} />
                      <span style={st.fileName}>{file.name}</span>
                      <button type="button" onClick={() => handleRemoveFile(i)} style={st.fileX}><FaTimes /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={st.field}>
              <label style={st.label}>🔒 Verification: {captchaNums.a} + {captchaNums.b} = ?</label>
              <input type="number" style={st.input(errors.captcha ? "red" : focusedField === 'captcha' ? c.accent : c.border)} placeholder="Enter sum" value={captchaAnswer} onChange={(e) => setCaptchaAnswer(e.target.value)} onFocus={() => setFocusedField('captcha')} onBlur={() => setErrors(p => ({ ...p, captcha: validateField("captcha", captchaAnswer) }))} />
              {errors.captcha && <span style={st.err}>{errors.captcha}</span>}
            </div>

            <button type="submit" style={st.submitBtn} disabled={loading}>
              <FaPaperPlane /> {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div style={st.mapCard}>
          <div style={st.mapHeader}><FaMapMarkedAlt style={{ color: c.accent }} /><h3 style={{ ...st.mapTitle, color: c.text }}>Find Us</h3></div>
          <div style={st.mapWrap}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29772.61589028416!2d72.85710755!3d21.12942445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0504b8ffaf081%3A0xf13809cbd265ef9a!2sBhestan%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1777610236306!5m2!1sen!2sin" style={st.iframe} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>

        <FAQSection isDark={isDarkMode} accent={c.accent} openIdx={faqOpen} setOpenIdx={setFaqOpen} isMobile={isMobile} />
      </div>

      <Footer />
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Inter',system-ui,sans-serif; }
        select, input, textarea { font-family:inherit; }
        select option { background:${isDarkMode ? '#1a1a2e' : '#fff'}; color:${isDarkMode ? '#e8d5a3' : '#0f172a'}; padding:8px; }
        select { background:${isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff'}; color:${isDarkMode ? '#e8d5a3' : '#0f172a'}; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}

const FAQSection = ({ isDark, accent, openIdx, setOpenIdx, isMobile }) => {
  const faqs = [
    { q: "How do I track my order?", a: "Go to your profile → Order History → Click any order to see status and tracking details." },
    { q: "What is the return policy?", a: "Return within 7 days of delivery if unused and in original packaging. Contact us via this form to start a return." },
    { q: "How do I cancel my order?", a: "Cancel within 1 hour of placing. Go to Order History → Select order → Cancel. After 1 hour, contact support." },
    { q: "What payment methods do you accept?", a: "We accept UPI via QR code. Scan at checkout with any UPI app (GPay, PhonePe, Paytm)." },
    { q: "How long does delivery take?", a: "Standard delivery: 3-5 business days. You'll receive a delivery OTP to verify receipt." },
    { q: "How do I reset my password?", a: "Click 'Forgot Password' on login. Enter your email for a reset link valid for 10 minutes." },
  ];
  const bg = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const text = isDark ? "#e8d5a3" : "#0f172a";
  const textSec = isDark ? "rgba(255,255,255,0.5)" : "#64748b";

  return (
    <div style={{ maxWidth: isMobile ? "100%" : "900px", margin: "40px auto 0", padding: isMobile ? "0 12px" : "0" }}>
      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: isMobile ? "16px" : "20px", padding: isMobile ? "20px" : "28px" }}>
        <h2 style={{ color: text, fontSize: isMobile ? "18px" : "22px", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <FaQuestionCircle style={{ color: accent }} /> Frequently Asked Questions
        </h2>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${border}`, paddingBottom: "8px", marginBottom: "8px" }}>
            <button onClick={() => setOpenIdx(openIdx === i ? null : i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px 0", background: "none", border: "none", cursor: "pointer", color: text, fontSize: isMobile ? "13px" : "14px", fontWeight: "600", fontFamily: "inherit", textAlign: "left" }}>
              {faq.q}
              <FaChevronDown style={{ color: accent, transition: "transform .3s", transform: openIdx === i ? "rotate(180deg)" : "rotate(0)", flexShrink: 0, marginLeft: "10px" }} />
            </button>
            {openIdx === i && <p style={{ color: textSec, fontSize: isMobile ? "12px" : "13px", lineHeight: "1.6", margin: "0 0 6px", padding: "0 0 8px" }}>{faq.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

const colors = (dark) => ({
  bg: dark ? "#050507" : "#f0f2f5",
  card: dark ? "rgba(255,255,255,0.04)" : "#ffffff",
  cardBorder: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
  text: dark ? "#f0f0f0" : "#0f172a",
  textSec: dark ? "rgba(255,255,255,0.5)" : "#64748b",
  inputBg: dark ? "rgba(255,255,255,0.04)" : "#f8f9fb",
  accent: dark ? "#c9a962" : "#6366f1",
  accentLight: dark ? "#e8d5a3" : "#818cf8",
  border: dark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
  submitText: dark ? "#050507" : "#fff",
});

const styles = (m, c) => ({
  page: { minHeight: "100vh", background: c.bg, position: "relative", overflow: "hidden", paddingTop: m ? "60px" : "70px", paddingBottom: "40px" },
  orb1: { position: "fixed", top: "-15%", right: "-8%", width: m ? "200px" : "400px", height: m ? "200px" : "400px", borderRadius: "50%", background: "radial-gradient(circle,rgba(201,169,98,.1) 0%,transparent 70%)", filter: "blur(80px)", pointerEvents: "none" },
  orb2: { position: "fixed", bottom: "-15%", left: "-8%", width: m ? "160px" : "300px", height: m ? "160px" : "300px", borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,.08) 0%,transparent 70%)", filter: "blur(60px)", pointerEvents: "none" },
  inner: { maxWidth: m ? "100%" : "960px", margin: "0 auto", padding: m ? "0 12px" : "0 24px", position: "relative", zIndex: 1, animation: "fadeIn .5s ease" },
  hero: { textAlign: "center", marginBottom: m ? "24px" : "32px" },
  heroTitle: { fontSize: m ? "24px" : "32px", fontWeight: "800", color: c.text, marginBottom: "8px", letterSpacing: "-0.5px" },
  heroSub: { fontSize: m ? "14px" : "16px", color: c.textSec },
  grid: { display: "grid", gridTemplateColumns: m ? "1fr" : "320px 1fr", gap: m ? "20px" : "24px", marginBottom: m ? "24px" : "32px" },
  sidebar: { display: "flex", flexDirection: "column", gap: "12px" },
  infoCard: { display: "flex", alignItems: "center", gap: "12px", padding: m ? "14px" : "16px", background: c.card, border: `1px solid ${c.cardBorder}`, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,.04)" },
  infoIcon: { width: "40px", height: "40px", borderRadius: "10px", background: `linear-gradient(135deg,${c.accent},${c.accentLight})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "16px", flexShrink: 0 },
  infoLabel: { fontSize: "12px", fontWeight: "600", color: c.text, marginBottom: "2px" },
  infoValue: { fontSize: "13px", color: c.textSec },
  helpCard: { padding: m ? "14px" : "16px", background: `linear-gradient(135deg,${c.accent}15,${c.accentLight}10)`, border: `1px solid ${c.accent}30`, borderRadius: "12px", display: "flex", gap: "12px", alignItems: "flex-start" },
  helpIcon: { color: c.accent, fontSize: "20px", marginTop: "2px", flexShrink: 0 },
  helpText: { fontSize: "13px", color: c.textSec, lineHeight: "1.5", margin: 0 },
  form: { background: c.card, border: `1px solid ${c.cardBorder}`, borderRadius: "16px", padding: m ? "20px" : "28px", boxShadow: "0 4px 20px rgba(0,0,0,.04)", display: "flex", flexDirection: "column", gap: "16px" },
  row: { display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: "12px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: "600", color: c.textSec, textTransform: "uppercase", letterSpacing: "0.5px" },
  input: (borderColor) => ({ padding: m ? "11px 14px" : "12px 14px", borderRadius: "10px", border: `1.5px solid ${borderColor}`, background: c.inputBg, color: c.text, fontSize: "14px", outline: "none", transition: "border-color .2s", width: "100%", boxSizing: "border-box" }),
  select: { padding: m ? "11px 14px" : "12px 14px", borderRadius: "10px", border: `1.5px solid ${c.border}`, background: c.inputBg, color: c.text, fontSize: "14px", outline: "none", cursor: "pointer", width: "100%", boxSizing: "border-box" },
  textarea: (borderColor) => ({ padding: m ? "11px 14px" : "12px 14px", borderRadius: "10px", border: `1.5px solid ${borderColor}`, background: c.inputBg, color: c.text, fontSize: "14px", outline: "none", transition: "border-color .2s", width: "100%", resize: "vertical", minHeight: m ? "100px" : "120px", fontFamily: "inherit", boxSizing: "border-box" }),
  err: { fontSize: "11px", color: "#ef4444", marginTop: "2px" },
  uploadBox: { border: `2px dashed ${c.cardBorder}`, borderRadius: "12px", padding: m ? "18px" : "24px", textAlign: "center", cursor: "pointer", background: c.inputBg },
  uploadLabel: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer" },
  uploadHint: { fontSize: "11px", color: c.textSec },
  filesGrid: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" },
  fileChip: { display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", background: c.inputBg, border: `1px solid ${c.cardBorder}`, borderRadius: "8px", fontSize: "12px", color: c.text },
  fileName: { maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  fileX: { background: "none", border: "none", cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center", padding: 0, fontSize: "10px" },
  submitBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: m ? "13px" : "14px", background: `linear-gradient(135deg,${c.accent},${c.accentLight})`, border: "none", borderRadius: "10px", fontSize: m ? "14px" : "15px", fontWeight: "700", color: c.submitText, cursor: "pointer", transition: "opacity .2s", marginTop: "4px", letterSpacing: "0.3px" },
  mapCard: { background: c.card, border: `1px solid ${c.cardBorder}`, borderRadius: "16px", padding: m ? "16px" : "24px", boxShadow: "0 2px 10px rgba(0,0,0,.03)", marginBottom: m ? "20px" : "28px" },
  mapHeader: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" },
  mapTitle: { fontSize: m ? "16px" : "18px", fontWeight: "700", margin: 0 },
  mapWrap: { borderRadius: "12px", overflow: "hidden", height: m ? "200px" : "320px", border: `1px solid ${c.cardBorder}` },
  iframe: { width: "100%", height: "100%", border: "none" },
});

export default Contact;
