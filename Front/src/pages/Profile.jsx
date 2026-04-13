
import React, { useState, useEffect, useContext } from "react";
import { apiFetch } from "../api/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Swal from "sweetalert2"; 
 
export default function Addresses() {
  const { isDarkMode } = useTheme();
  const [addresses, setAddresses] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { user } = useContext(AuthContext);
 
  const [form, setForm] = useState({
    label: "",
    name: user?.username || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
 
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
 
  useEffect(() => {
    if (user) {
      setForm(prev => ({ ...prev, name: user.username || "" }));
    }
  }, [user]);
 
  const loadAddresses = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/user");
      setAddresses(res.data.addresses || []);
    } catch (err) {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    loadAddresses();
  }, []);
 
  const validateForm = () => {
    const newErrors = {};
 
    if (!form.label) newErrors.label = "Please select an address type";
    if (!form.name.trim()) newErrors.name = "Please enter your name";
    if (!form.phone) {
      newErrors.phone = "Please enter your phone number";
    } else {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(form.phone)) {
        newErrors.phone = "Phone number must be exactly 10 digits";
      }
    }
    if (!form.street.trim()) newErrors.street = "Please enter street address";
    if (!form.city.trim()) newErrors.city = "Please enter city";
    if (!form.state.trim()) newErrors.state = "Please enter state";
    if (!form.country.trim()) newErrors.country = "Please enter country";
    if (!form.postalCode.trim()) {
      newErrors.postalCode = "Please enter postal code";
    } else {
      const postalRegex = /^\d{5,6}$/;
      if (!postalRegex.test(form.postalCode)) {
        newErrors.postalCode = "Postal code must be 5-6 digits";
      }
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
 
  const handleAdd = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
 
    setFormLoading(true);
    try {
      await apiFetch("/user/address/add", { method: "POST", body: form });
      toast.success("Address added successfully");
      setForm({
        label: "",
        name: user?.username || "",
        phone: "",
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      });
      setErrors({});
      loadAddresses();
    } catch (err) {
      toast.error(err.message || "Failed to add address");
    } finally {
      setFormLoading(false);
    }
  };
 
  const handleDelete = async (id) => {
    // Replace window.confirm with SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });
 
    if (!result.isConfirmed) return;
 
    try {
      await apiFetch(`/user/address/delete/${id}`, { method: "DELETE" });
      toast.success("Address deleted successfully");
      setAddresses(addresses.filter((addr) => addr._id !== id));
    } catch (err) {
      toast.error(err.message || "Failed to delete address");
    }
  };
 
  const styles = {
    container: {
      maxWidth: "800px",
      margin: isMobile ? "1rem auto" : "2rem auto",
      padding: isMobile ? "0 1rem" : "0 1.5rem",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    title: {
      textAlign: "center",
      marginBottom: isMobile ? "1.5rem" : "2rem",
      fontSize: isMobile ? "1.8rem" : "2.2rem",
      fontWeight: "600",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: "-0.02em",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "3rem",
      color: isDarkMode ? "rgba(255,255,255,0.6)" : "#666",
    },
    addressCard: {
      background: isDarkMode ? "rgba(30, 30, 40, 0.9)" : "#fff",
      padding: isMobile ? "1.2rem" : "1.5rem",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      marginBottom: "1rem",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isMobile ? "stretch" : "center",
      gap: isMobile ? "1.2rem" : "1.5rem",
      transition: "all 0.3s ease",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.15)" : "#f0f0f0"}`,
      position: "relative",
      overflow: "hidden",
    },
    addressCardHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 12px 30px rgba(201, 169, 98, 0.15)",
      borderColor: "#c9a962",
    },
    addressContent: {
      flex: 1,
    },
    addressLabel: {
      display: "inline-block",
      fontSize: "0.85rem",
      fontWeight: "600",
      color: "#c9a962",
      backgroundColor: "rgba(201, 169, 98, 0.15)",
      padding: "0.3rem 0.8rem",
      borderRadius: "20px",
      marginBottom: "0.8rem",
      letterSpacing: "0.3px",
    },
    addressName: {
      fontSize: "1rem",
      fontWeight: "600",
      color: isDarkMode ? "#e8d5a3" : "#1a1a1a",
      marginBottom: "0.3rem",
    },
    addressPhone: {
      fontSize: "0.9rem",
      color: isDarkMode ? "rgba(255,255,255,0.6)" : "#666",
      marginBottom: "0.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.3rem",
    },
    addressDetails: {
      fontSize: isMobile ? "0.9rem" : "0.95rem",
      color: isDarkMode ? "rgba(255,255,255,0.8)" : "#444",
      lineHeight: "1.6",
      backgroundColor: isDarkMode ? "rgba(201, 169, 98, 0.05)" : "#fafafa",
      padding: "0.8rem",
      borderRadius: "8px",
      marginTop: "0.5rem",
    },
    deleteBtn: {
      backgroundColor: isDarkMode ? "rgba(239, 68, 68, 0.1)" : "#fff",
      color: "#dc3545",
      border: "1.5px solid #dc3545",
      padding: isMobile ? "0.8rem 1.2rem" : "0.5rem 1rem",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: isMobile ? "0.95rem" : "0.9rem",
      fontWeight: "500",
      width: isMobile ? "100%" : "auto",
      alignSelf: isMobile ? "stretch" : "center",
    },
    deleteBtnHover: {
      backgroundColor: "#dc3545",
      color: "#fff",
    },
    formTitle: {
      marginTop: "2.5rem",
      marginBottom: "1.5rem",
      fontSize: isMobile ? "1.4rem" : "1.6rem",
      fontWeight: "600",
      color: isDarkMode ? "#e8d5a3" : "#1a1a1a",
      borderBottom: `2px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#f0f0f0"}`,
      paddingBottom: "0.8rem",
    },
    formGroup: {
      marginBottom: "1.2rem",
    },
    label: {
      fontWeight: "500",
      marginBottom: "0.5rem",
      display: "block",
      fontSize: isMobile ? "0.95rem" : "0.9rem",
      color: isDarkMode ? "#e8d5a3" : "#4a4a4a",
    },
    input: {
      width: "100%",
      padding: isMobile ? "0.9rem" : "0.75rem",
      borderRadius: "12px",
      border: `1.5px solid ${errors[Object.keys(errors).find(key => key === Object.keys(form).find(f => f === key))] ? '#dc3545' : isDarkMode ? "rgba(201, 169, 98, 0.3)" : '#e0e0e0'}`,
      fontSize: isMobile ? "1rem" : "0.95rem",
      transition: "all 0.2s ease",
      outline: "none",
      backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "#fff",
      color: isDarkMode ? "#fff" : "#212529",
    },
    inputFocus: {
      borderColor: "#c9a962",
      boxShadow: "0 0 0 3px rgba(201, 169, 98, 0.15)",
    },
    select: {
      width: "100%",
      padding: isMobile ? "0.9rem" : "0.75rem",
      borderRadius: "12px",
      border: `1.5px solid ${errors.label ? '#dc3545' : isDarkMode ? "rgba(201, 169, 98, 0.3)" : '#e0e0e0'}`,
      fontSize: isMobile ? "1rem" : "0.95rem",
      transition: "all 0.2s ease",
      outline: "none",
      backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "#fff",
      color: isDarkMode ? "#fff" : "#212529",
      cursor: "pointer",
    },
    errorText: {
      color: "#dc3545",
      fontSize: "0.85rem",
      marginTop: "0.4rem",
      display: "block",
      fontWeight: "500",
    },
    addButton: {
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      color: "#000",
      border: "none",
      padding: isMobile ? "1rem" : "0.8rem 2rem",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: isMobile ? "1rem" : "1rem",
      width: isMobile ? "100%" : "auto",
      marginTop: "1.5rem",
      transition: "all 0.2s ease",
      position: "relative",
      opacity: formLoading ? 0.7 : 1,
    },
    addButtonHover: {
      background: "linear-gradient(135deg, #e8d5a3 0%, #c9a962 100%)",
      transform: "translateY(-1px)",
      boxShadow: "0 8px 20px rgba(201, 169, 98, 0.3)",
    },
    emptyMessage: {
      textAlign: "center",
      color: isDarkMode ? "rgba(255,255,255,0.6)" : "#666",
      padding: "3rem",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.9)" : "#fafafa",
      borderRadius: "16px",
      border: `2px dashed ${isDarkMode ? "rgba(201, 169, 98, 0.3)" : "#e0e0e0"}`,
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: "1rem",
    },
    phonePrefix: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    countryCode: {
      backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "#f0f0f0",
      padding: isMobile ? "0.9rem" : "0.75rem",
      borderRadius: "12px",
      color: isDarkMode ? "#c9a962" : "#666",
      fontWeight: "500",
      border: `1.5px solid ${isDarkMode ? "rgba(201, 169, 98, 0.3)" : "#e0e0e0"}`,
    },
  };
 
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📦 Your Addresses</h2>
 
      {/* Address Cards */}
      {loading ? (
        <div style={styles.loadingContainer}>Loading your addresses...</div>
      ) : addresses.length === 0 ? (
        <p style={styles.emptyMessage}>
          No addresses added yet. Add your first address below!
        </p>
      ) : (
        addresses.map((addr) => (
          <div
            key={addr._id}
            style={styles.addressCard}
            onMouseEnter={(e) => {
              if (!isMobile) {
                Object.assign(e.currentTarget.style, styles.addressCardHover);
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.borderColor = "";
              }
            }}
          >
            <div style={styles.addressContent}>
              <span style={styles.addressLabel}>{addr.label}</span>
              <div style={styles.addressName}>{addr.name}</div>
              <div style={styles.addressPhone}>
                <span>📞</span> {addr.phone}
              </div>
              <div style={styles.addressDetails}>
                {addr.street}, {addr.city}, {addr.state}, {addr.country} - {addr.postalCode}
              </div>
            </div>
            <button
              style={styles.deleteBtn}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  Object.assign(e.currentTarget.style, styles.deleteBtnHover);
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.color = "#dc3545";
                }
              }}
              onClick={() => handleDelete(addr._id)}
            >
              🗑️ Delete
            </button>
          </div>
        ))
      )}
 
      <h3 style={styles.formTitle}>➕ Add New Address</h3>
 
      {/* Label Dropdown */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Address Type *</label>
        <select
          name="label"
          value={form.label}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">Select address type</option>
          <option value="Home">🏠 Home</option>
          <option value="Office">💼 Office</option>
          <option value="Other">📍 Other</option>
        </select>
        {errors.label && <span style={styles.errorText}>{errors.label}</span>}
      </div>
 
      {/* Form Fields */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Full Name *</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = "#0d6efd"}
          onBlur={(e) => e.target.style.borderColor = errors.name ? "#dc3545" : "#e0e0e0"}
        />
        {errors.name && <span style={styles.errorText}>{errors.name}</span>}
      </div>
 
      <div style={styles.formGroup}>
        <label style={styles.label}>Phone Number *</label>
        <div style={styles.phonePrefix}>
          <span style={styles.countryCode}>+91</span>
          <input
            type="tel"
            name="phone"
            placeholder="10 digit mobile number"
            value={form.phone}
            onChange={handleChange}
            style={{...styles.input, flex: 1}}
            maxLength="10"
            onFocus={(e) => e.target.style.borderColor = "#0d6efd"}
            onBlur={(e) => e.target.style.borderColor = errors.phone ? "#dc3545" : "#e0e0e0"}
          />
        </div>
        {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
      </div>
 
      <div style={styles.formGroup}>
        <label style={styles.label}>Street Address *</label>
        <input
          type="text"
          name="street"
          placeholder="House number, building, street, area"
          value={form.street}
          onChange={handleChange}
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = "#0d6efd"}
          onBlur={(e) => e.target.style.borderColor = errors.street ? "#dc3545" : "#e0e0e0"}
        />
        {errors.street && <span style={styles.errorText}>{errors.street}</span>}
      </div>
 
      <div style={styles.gridContainer}>
        <div style={styles.formGroup}>
          <label style={styles.label}>City *</label>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = "#0d6efd"}
            onBlur={(e) => e.target.style.borderColor = errors.city ? "#dc3545" : "#e0e0e0"}
          />
          {errors.city && <span style={styles.errorText}>{errors.city}</span>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>State *</label>
          <input
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = "#0d6efd"}
            onBlur={(e) => e.target.style.borderColor = errors.state ? "#dc3545" : "#e0e0e0"}
          />
          {errors.state && <span style={styles.errorText}>{errors.state}</span>}
        </div>
      </div>
 
      <div style={styles.gridContainer}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Country *</label>
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = "#0d6efd"}
            onBlur={(e) => e.target.style.borderColor = errors.country ? "#dc3545" : "#e0e0e0"}
          />
          {errors.country && <span style={styles.errorText}>{errors.country}</span>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Postal Code *</label>
          <input
            type="text"
            name="postalCode"
            placeholder="Postal code"
            value={form.postalCode}
            onChange={handleChange}
            style={styles.input}
            maxLength="6"
            onFocus={(e) => e.target.style.borderColor = "#0d6efd"}
            onBlur={(e) => e.target.style.borderColor = errors.postalCode ? "#dc3545" : "#e0e0e0"}
          />
          {errors.postalCode && <span style={styles.errorText}>{errors.postalCode}</span>}
        </div>
      </div>
 
      <button
        style={styles.addButton}
        onMouseEnter={(e) => {
          if (!isMobile && !formLoading) {
            Object.assign(e.currentTarget.style, styles.addButtonHover);
          }
        }}
        onMouseLeave={(e) => {
          if (!isMobile) {
            e.currentTarget.style.backgroundColor = "#0d6efd";
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "";
          }
        }}
        onClick={handleAdd}
        disabled={formLoading}
      >
        {formLoading ? "Adding..." : "Add Address"}
      </button>
    </div>
  );
}
 
 