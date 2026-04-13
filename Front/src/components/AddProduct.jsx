
import { useState, useEffect } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FaPlus, FaTimes, FaImage, FaCheck } from "react-icons/fa";

const CATEGORIES = [
  "general",
  "electronics",
  "clothing",
  "home",
  "kitchen",
  "sports",
  "beauty",
  "books",
  "toys",
  "other"
];

export default function ProductHeader({ onAdded }) {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!user || user.role !== "admin") return null;

  const [showModal, setShowModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "general",
    stock: "",
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);
  const [hoveredField, setHoveredField] = useState(null);

  useEffect(() => {
    setTimeout(() => setAnimateHeader(true), 50);
  }, []);

  const accentColor = "#c9a962";
  const accentLight = "#e8d5a3";

  const openModal = () => {
    setShowModal(true);
    setTimeout(() => setAnimateModal(true), 10);
  };

  const closeModal = () => {
    setAnimateModal(false);
    setTimeout(() => {
      setShowModal(false);
      setForm({
        name: "",
        price: "",
        description: "",
        category: "general",
        stock: "",
        images: []
      });
    }, 200);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || form.images.length === 0)
      return toast.error("Name, price, and at least one image are required!");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("price", Number(form.price));
      formData.append("description", form.description || "");
      formData.append("category", form.category || "general");
      
      if (form.stock) {
        formData.append("stock", Number(form.stock));
      }

      form.images.forEach((img) => {
        formData.append("productImages", img);
      });

      await API.post("/products/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added successfully!");
      if (onAdded) onAdded();
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (form.images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed!");
      return;
    }
    setForm({ ...form, images: [...form.images, ...files] });
  };

  const styles = {
    header: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isMobile ? "stretch" : "center",
      margin: isMobile ? "0.5rem 0" : "1rem 0",
      padding: isMobile ? "0 0.5rem" : "0 1rem",
      gap: isMobile ? "1rem" : "0",
    },
    title: {
      fontSize: isMobile ? "1.5rem" : "1.8rem",
      fontWeight: 800,
      opacity: animateHeader ? 1 : 0,
      transform: animateHeader ? "translateX(0)" : "translateX(-50px)",
      transition: "all 0.6s ease-out",
      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentLight} 50%, ${accentColor} 100%)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      cursor: "default",
      textAlign: isMobile ? "center" : "left",
    },
    addButton: {
      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentLight} 100%)`,
      color: "#0f172a",
      padding: isMobile ? "0.9rem 1.2rem" : "0.6rem 1.2rem",
      border: "none",
      borderRadius: "14px",
      fontWeight: 700,
      cursor: "pointer",
      transition: "all 0.3s ease",
      width: isMobile ? "100%" : "auto",
      boxShadow: `0 4px 20px ${accentColor}40`,
      fontSize: "0.95rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    modalOverlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: isMobile ? "1rem" : "0",
    },
    modalForm: {
      backgroundColor: isDarkMode ? "rgba(20, 20, 28, 0.98)" : "#ffffff",
      padding: isMobile ? "1.5rem" : "2rem",
      borderRadius: "24px",
      width: "100%",
      maxWidth: isMobile ? "400px" : "520px",
      maxHeight: isMobile ? "90vh" : "85vh",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "1.25rem",
      boxShadow: isDarkMode 
        ? "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(201, 169, 98, 0.1)" 
        : "0 25px 60px rgba(0,0,0,0.15)",
      position: "relative",
      transform: animateModal ? "scale(1) translateY(0)" : "scale(0.9) translateY(20px)",
      opacity: animateModal ? 1 : 0,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "rgba(0,0,0,0.08)"}`,
    },
    closeButton: {
      position: "absolute",
      top: "1rem",
      right: "1rem",
      background: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      border: "none",
      fontSize: "1.2rem",
      cursor: "pointer",
      width: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "12px",
      color: isDarkMode ? "rgba(255,255,255,0.7)" : "#64748b",
      transition: "all 0.2s ease",
    },
    modalTitle: {
      textAlign: "center",
      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentLight} 100%)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: 800,
      fontSize: isMobile ? "1.4rem" : "1.6rem",
      marginBottom: "0.5rem",
      paddingTop: "0.5rem",
    },
    modalSubtitle: {
      textAlign: "center",
      color: isDarkMode ? "rgba(255,255,255,0.5)" : "#64748b",
      fontSize: "0.9rem",
      marginBottom: "0.5rem",
    },
    inputContainer: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
    },
    inputLabel: {
      position: "absolute",
      top: "-0.6rem",
      left: "1rem",
      fontSize: "0.75rem",
      background: isDarkMode ? "rgba(20, 20, 28, 0.98)" : "#ffffff",
      padding: "0 0.4rem",
      fontWeight: 700,
      color: hoveredField ? accentColor : (isDarkMode ? "rgba(255,255,255,0.5)" : "#64748b"),
      transition: "all 0.2s ease",
      zIndex: 1,
    },
    input: (isFocused) => ({
      padding: isMobile ? "1rem" : "0.95rem",
      fontSize: isMobile ? "1rem" : "0.95rem",
      borderRadius: "14px",
      border: `2px solid ${isFocused ? accentColor : (isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0")}`,
      outline: "none",
      width: "100%",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#ffffff",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
      transition: "all 0.3s ease",
      boxShadow: isFocused ? `${accentColor}20` : "none",
    }),
    select: (isFocused) => ({
      padding: isMobile ? "1rem" : "0.95rem",
      fontSize: isMobile ? "1rem" : "0.95rem",
      borderRadius: "14px",
      border: `2px solid ${isFocused ? accentColor : (isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0")}`,
      outline: "none",
      width: "100%",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#ffffff",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
      cursor: "pointer",
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23${isDarkMode ? "e8d5a3" : "64748b"}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 16px center",
      backgroundSize: "20px",
      boxShadow: isFocused ? `${accentColor}20` : "none",
      transition: "all 0.3s ease",
    }),
    textarea: (isFocused) => ({
      padding: isMobile ? "1rem" : "0.95rem",
      fontSize: isMobile ? "1rem" : "0.95rem",
      borderRadius: "14px",
      border: `2px solid ${isFocused ? accentColor : (isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0")}`,
      outline: "none",
      width: "100%",
      minHeight: "120px",
      resize: "vertical",
      fontFamily: "inherit",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#ffffff",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
      boxShadow: isFocused ? `${accentColor}20` : "none",
      transition: "all 0.3s ease",
    }),
    fileInput: {
      padding: isMobile ? "1rem" : "0.95rem",
      fontSize: isMobile ? "0.95rem" : "0.9rem",
      borderRadius: "14px",
      border: `2px dashed ${isDarkMode ? "rgba(201, 169, 98, 0.3)" : "#cbd5e1"}`,
      width: "100%",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.5)" : "#f8fafc",
      color: isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    submitButton: {
      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentLight} 100%)`,
      color: "#0f172a",
      padding: isMobile ? "1.1rem" : "1rem 1.5rem",
      borderRadius: "14px",
      fontWeight: 700,
      border: "none",
      cursor: loading ? "not-allowed" : "pointer",
      transition: "all 0.3s ease",
      fontSize: isMobile ? "1.05rem" : "1rem",
      marginTop: "0.5rem",
      boxShadow: `0 4px 20px ${accentColor}40`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
    },
    imagePreviewContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
      gap: "0.75rem",
      marginTop: "0.75rem",
    },
    imagePreview: {
      position: "relative",
      width: "100%",
      aspectRatio: "1",
      borderRadius: "12px",
      overflow: "hidden",
      border: `2px solid ${accentColor}40`,
      boxShadow: `0 4px 15px ${accentColor}20`,
    },
    imagePreviewImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    imageRemoveBtn: {
      position: "absolute",
      top: "4px",
      right: "4px",
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      backgroundColor: "#ef4444",
      color: "#fff",
      border: "none",
      fontSize: "14px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
      transition: "all 0.2s ease",
    },
    rowGroup: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: "1rem",
    },
    imageCount: {
      fontSize: "0.85rem",
      color: accentColor,
      marginTop: "0.5rem",
      fontWeight: 600,
    },
    required: {
      color: "#ef4444",
    },
  };

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>
          PRODUCTS
        </h1>

        {user?.role === "admin" && (
          <button 
            onClick={openModal} 
            style={styles.addButton}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                e.currentTarget.style.boxShadow = `0 12px 35px ${accentColor}50`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = `0 4px 20px ${accentColor}40`;
              }
            }}
          >
            <FaPlus /> Add Product
          </button>
        )}
      </div>

      {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <form
            onSubmit={submit}
            style={styles.modalForm}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              style={styles.closeButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
                e.currentTarget.style.color = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
                e.currentTarget.style.color = isDarkMode ? "rgba(255,255,255,0.7)" : "#64748b";
              }}
            >
              <FaTimes />
            </button>

            <h2 style={styles.modalTitle}>Add New Product</h2>
            <p style={styles.modalSubtitle}>Fill in the details to add a new product</p>

            <div style={styles.inputContainer}>
              <label style={styles.inputLabel}>Product Name <span style={styles.required}>*</span></label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={styles.input(hoveredField === 'name')}
                required
                placeholder="Enter product name"
                onFocus={() => setHoveredField('name')}
                onBlur={() => setHoveredField(null)}
              />
            </div>

            <div style={styles.rowGroup}>
              <div style={styles.inputContainer}>
                <label style={styles.inputLabel}>Price <span style={styles.required}>*</span></label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  style={styles.input(hoveredField === 'price')}
                  required
                  min="0"
                  placeholder="₹ 0"
                  onFocus={() => setHoveredField('price')}
                  onBlur={() => setHoveredField(null)}
                />
              </div>

              <div style={styles.inputContainer}>
                <label style={styles.inputLabel}>Stock Quantity</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  style={styles.input(hoveredField === 'stock')}
                  min="0"
                  placeholder="0"
                  onFocus={() => setHoveredField('stock')}
                  onBlur={() => setHoveredField(null)}
                />
              </div>
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.inputLabel}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={styles.select(hoveredField === 'category')}
                onFocus={() => setHoveredField('category')}
                onBlur={() => setHoveredField(null)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} style={{ background: isDarkMode ? "#141420" : "#ffffff", color: isDarkMode ? "#e8d5a3" : "#0f172a" }}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.inputLabel}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={styles.textarea(hoveredField === 'description')}
                placeholder="Enter product description..."
                maxLength={500}
                onFocus={() => setHoveredField('description')}
                onBlur={() => setHoveredField(null)}
              />
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.inputLabel}>
                Product Images <span style={styles.required}>*</span> (Max 5)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={styles.fileInput}
              />
              <span style={styles.imageCount}>
                {form.images.length}/5 images selected
              </span>
              {form.images.length > 0 && (
                <div style={styles.imagePreviewContainer}>
                  {form.images.map((img, index) => (
                    <div key={index} style={styles.imagePreview}>
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${index + 1}`}
                        style={styles.imagePreviewImg}
                      />
                      <button
                        type="button"
                        style={styles.imageRemoveBtn}
                        onClick={() => removeImage(index)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                      >
                        <FaTimes style={{ fontSize: "10px" }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading && !isMobile) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 30px ${accentColor}50`;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && !isMobile) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 4px 20px ${accentColor}40`;
                }
              }}
            >
              {loading ? (
                "Adding..."
              ) : (
                <>
                  <FaCheck /> Add Product
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
