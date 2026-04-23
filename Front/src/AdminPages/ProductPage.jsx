
// src/AdminPages/ProductPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { Container, Spinner, Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaSearch, FaEdit, FaTrash, FaImage, FaPlus, FaBox } from "react-icons/fa";
import API, { getImageUrl, getInitialsAvatar } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import AddProduct from "../components/AddProduct";

const ExpandableDescription = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <p
      onClick={() => setExpanded(!expanded)}
      style={{
        fontSize: isMobile ? "0.8rem" : "0.85rem",
        color: "var(--text-secondary)",
        cursor: "pointer",
        display: "-webkit-box",
        WebkitLineClamp: expanded ? "unset" : 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        marginBottom: "6px",
        lineHeight: "1.5",
      }}
    >
      {text || "No description"}
    </p>
  );
};

const ProductPage = () => {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = isMobile ? 6 : 12;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await API.get("/products");
      setProducts(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setLoadingAdmin(true);

    try {
      const res = await API.delete(`/products/delete/${id}`);
      toast.success(res.data.message || "Product deleted successfully!");
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting product");
    } finally {
      setLoadingAdmin(false);
    }
  };

  const handleOpenUpdate = (product) => {
    setSelectedProduct(product);
    setUpdateForm({
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      image: null,
    });
    setPreview(
      product.img
        ? getImageUrl(product.img)
        : null
    );
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      setLoadingAdmin(true);
      const formData = new FormData();
      formData.append("name", updateForm.name);
      formData.append("price", updateForm.price);
      formData.append("description", updateForm.description);
      if (updateForm.image)
        formData.append("productImage", updateForm.image);

      await API.put(`/products/update/${selectedProduct._id}`, formData);
      toast.success("Product updated!");
      setShowModal(false);
      loadProducts();
    } catch {
      toast.error("Error updating product");
    } finally {
      setLoadingAdmin(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const getGridColumns = () => {
    if (isMobile) return "repeat(auto-fill, minmax(150px, 1fr))";
    return "repeat(auto-fill, minmax(220px, 280px))";
  };

    const accentColor = "#c9a962";
  const accentLight = "#e8d5a3";

  const styles = {
    container: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: isMobile ? "1rem" : "1.5rem",
      minHeight: "100vh",
    },
    header: {
      marginBottom: "1.5rem",
    },
    headerTop: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      marginBottom: "1rem",
    },
    iconContainer: {
      width: isMobile ? "45px" : "50px",
      height: isMobile ? "45px" : "50px",
      borderRadius: "14px",
      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentLight} 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: isMobile ? "1.2rem" : "1.3rem",
      color: "#0f172a",
      boxShadow: `0 8px 25px ${accentColor}40`,
    },
    title: {
      color: isDarkMode ? "#ffffff" : "#0f172a",
      fontSize: isMobile ? "1.3rem" : "1.6rem",
      fontWeight: 700,
      margin: 0,
    },
    searchContainer: {
      position: "relative",
      marginBottom: "1rem",
    },
    searchIcon: {
      position: "absolute",
      left: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      color: accentColor,
      fontSize: "1rem",
    },
    searchInput: {
      width: "100%",
      padding: isMobile ? "14px 14px 14px 44px" : "16px 16px 16px 46px",
      border: `2px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`,
      borderRadius: "14px",
      fontSize: "1rem",
      background: isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#ffffff",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
      transition: "all 0.3s ease",
    },
    productsGrid: {
      display: "grid",
      gridTemplateColumns: getGridColumns(),
      justifyContent: "center",
      gap: isMobile ? "1rem" : "1.5rem",
      marginTop: "1rem",
    },
    card: {
      borderRadius: "20px",
      padding: isMobile ? "1rem" : "1.25rem",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.15)" : "rgba(0,0,0,0.05)"}`,
      boxShadow: isDarkMode ? "0 10px 40px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.06)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex",
      flexDirection: "column",
      backgroundColor: isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#ffffff",
      height: "100%",
      position: "relative",
      overflow: "hidden",
    },
    imageContainer: {
      width: "100%",
      aspectRatio: "1 / 1",
      overflow: "hidden",
      borderRadius: "14px",
      marginBottom: "1rem",
      background: isDarkMode ? "rgba(201, 169, 98, 0.1)" : "#f8fafc",
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.4s ease",
    },
    productName: {
      fontWeight: 700,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      marginBottom: "8px",
      fontSize: isMobile ? "1rem" : "1.1rem",
      color: isDarkMode ? "#e8d5a3" : "#0f172a",
    },
    price: {
      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentLight} 100%)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: 800,
      marginBottom: "8px",
      fontSize: isMobile ? "1.1rem" : "1.2rem",
    },
    buttonContainer: {
      display: "flex",
      gap: "8px",
      marginTop: "auto",
      paddingTop: "0.75rem",
    },
    updateButton: {
      flex: 1,
      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentLight} 100%)`,
      border: "none",
      color: "#0f172a",
      padding: isMobile ? "12px" : "12px 14px",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: isMobile ? "0.9rem" : "0.95rem",
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      transition: "all 0.3s ease",
      boxShadow: `0 4px 15px ${accentColor}30`,
    },
    deleteButton: {
      flex: 1,
      background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
      border: "none",
      color: "#fff",
      padding: isMobile ? "12px" : "12px 14px",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: isMobile ? "0.9rem" : "0.95rem",
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: isMobile ? "6px" : "10px",
      marginTop: "2rem",
      flexWrap: "wrap",
    },
    pageButton: (active) => ({
      padding: isMobile ? "10px 16px" : "12px 20px",
      border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`,
      borderRadius: "12px",
      background: active 
        ? `linear-gradient(135deg, ${accentColor} 0%, ${accentLight} 100%)` 
        : (isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#ffffff"),
      color: active ? "#0f172a" : (isDarkMode ? "#e8d5a3" : "#0f172a"),
      cursor: "pointer",
      fontWeight: 600,
      fontSize: isMobile ? "0.9rem" : "0.95rem",
      transition: "all 0.3s ease",
      boxShadow: active ? `0 4px 15px ${accentColor}30` : "none",
    }),
    loadingContainer: {
      textAlign: "center",
      padding: "4rem",
    },
    spinner: {
      width: "50px",
      height: "50px",
      border: `4px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`,
      borderTop: `4px solid ${accentColor}`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto 1rem",
    },
    emptyState: {
      textAlign: "center",
      padding: "4rem 2rem",
      color: isDarkMode ? "rgba(255,255,255,0.5)" : "#64748b",
    },
  };

  return (
    <Container fluid style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.iconContainer}>
            <FaBox style={{ color: "#fff" }} />
          </div>
          <h1 style={styles.title}>Products</h1>
        </div>
        <AddProduct onAdded={loadProducts} />
        <div style={styles.searchContainer}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => {
              e.target.style.borderColor = accentColor;
              e.target.style.boxShadow = `0 0 0 4px ${accentColor}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {loadingProducts ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={{ color: isDarkMode ? "rgba(255,255,255,0.5)" : "#64748b" }}>Loading products...</p>
        </div>
      ) : !filteredProducts.length ? (
        <div style={styles.emptyState}>
          <FaBox style={{ fontSize: "4rem", marginBottom: "1rem", opacity: 0.5, color: accentColor }} />
          <h3 style={{ color: isDarkMode ? "#e8d5a3" : "#0f172a", marginBottom: "0.5rem" }}>
            {searchTerm ? "No products found" : "No products yet"}
          </h3>
          <p>{searchTerm ? "Try a different search term" : "Add your first product to get started"}</p>
        </div>
      ) : (
        <>
          <div style={styles.productsGrid}>
            {currentProducts.map((p) => (
              <div
                key={p._id}
                style={styles.card}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                    e.currentTarget.style.boxShadow = isDarkMode 
                      ? `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${accentColor}15` 
                      : `0 20px 50px rgba(0,0,0,0.12), 0 0 30px ${accentColor}10`;
                    const img = e.currentTarget.querySelector("img");
                    if (img) img.style.transform = "scale(1.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = isDarkMode 
                      ? "0 10px 40px rgba(0,0,0,0.3)" 
                      : "0 4px 20px rgba(0,0,0,0.06)";
                    const img = e.currentTarget.querySelector("img");
                    if (img) img.style.transform = "scale(1)";
                  }
                }}
              >
                <div style={styles.imageContainer}>
                  <img
                    src={
                      p.img
                        ? getImageUrl(p.img)
                        : getInitialsAvatar(p.name, "c9a962")
                    }
                    alt={p.name}
                    style={styles.image}
                    onError={(e) => {
                      e.target.src = getInitialsAvatar(p.name, "c9a962");
                    }}
                  />
                </div>

                <h5 style={styles.productName} title={p.name}>
                  {p.name}
                </h5>

                <ExpandableDescription text={p.description} />

                <p style={styles.price}>
                  ₹{Number(p.price).toLocaleString()}
                </p>

                {user?.role === "admin" && (
                  <div style={styles.buttonContainer}>
                    <button
                      style={styles.updateButton}
                      onClick={() => handleOpenUpdate(p)}
                      onMouseEnter={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
                          e.currentTarget.style.boxShadow = `0 8px 25px ${accentColor}40`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.transform = "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow = `0 4px 15px ${accentColor}30`;
                        }
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(p._id)}
                      onMouseEnter={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
                          e.currentTarget.style.boxShadow = "0 8px 25px rgba(239, 68, 68, 0.4)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.transform = "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)";
                        }
                      }}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                style={styles.pageButton(false)}
              >
                Previous
              </button>
              <span style={{ color: "var(--text-secondary)", padding: "0 0.5rem" }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={styles.pageButton(false)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="dark-modal">
        <Modal.Header 
          closeButton 
          closeVariant="white"
          style={{ 
            background: isDarkMode ? "rgba(20, 20, 28, 0.98)" : "#ffffff",
            borderBottom: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`,
            borderRadius: "20px 20px 0 0",
          }}
        >
          <Modal.Title style={{ 
            color: accentColor,
            fontWeight: 700,
            fontSize: "1.3rem",
          }}>
            Update Product
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body style={{ 
            background: isDarkMode ? "rgba(20, 20, 28, 0.98)" : "#ffffff",
          }}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: isDarkMode ? "#e8d5a3" : "#64748b", fontWeight: 600 }}>
                Product Name
              </Form.Label>
              <Form.Control
                placeholder="Enter product name"
                value={updateForm.name}
                onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                required
                style={{ 
                  background: isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#f8fafc", 
                  border: `2px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`, 
                  color: isDarkMode ? "#e8d5a3" : "#0f172a",
                  borderRadius: "12px",
                  padding: "0.85rem",
                  fontSize: "1rem",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: isDarkMode ? "#e8d5a3" : "#64748b", fontWeight: 600 }}>
                Price (₹)
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={updateForm.price}
                onChange={(e) => setUpdateForm({ ...updateForm, price: e.target.value })}
                required
                style={{ 
                  background: isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#f8fafc", 
                  border: `2px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`, 
                  color: isDarkMode ? "#e8d5a3" : "#0f172a",
                  borderRadius: "12px",
                  padding: "0.85rem",
                  fontSize: "1rem",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: isDarkMode ? "#e8d5a3" : "#64748b", fontWeight: 600 }}>
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter product description..."
                value={updateForm.description}
                onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                style={{ 
                  background: isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#f8fafc", 
                  border: `2px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`, 
                  color: isDarkMode ? "#e8d5a3" : "#0f172a",
                  borderRadius: "12px",
                  padding: "0.85rem",
                  fontSize: "1rem",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: isDarkMode ? "#e8d5a3" : "#64748b", fontWeight: 600 }}>
                Product Image
              </Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setUpdateForm({ ...updateForm, image: file });
                  setPreview(file ? URL.createObjectURL(file) : null);
                }}
                style={{ 
                  background: isDarkMode ? "rgba(30, 30, 40, 0.8)" : "#f8fafc", 
                  border: `2px dashed ${isDarkMode ? "rgba(201, 169, 98, 0.3)" : "#cbd5e1"}`, 
                  color: isDarkMode ? "#e8d5a3" : "#64748b",
                  borderRadius: "12px",
                  padding: "0.85rem",
                  fontSize: "1rem",
                }}
              />
            </Form.Group>
            {preview && (
              <div style={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "center",
              }}>
                <div style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: `2px solid ${accentColor}40`,
                  boxShadow: `0 4px 20px ${accentColor}20`,
                }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer style={{ 
            background: isDarkMode ? "rgba(20, 20, 28, 0.98)" : "#ffffff", 
            borderTop: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "#e2e8f0"}`,
            borderRadius: "0 0 20px 20px",
          }}>
            <button 
              onClick={() => setShowModal(false)} 
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                background: isDarkMode ? "rgba(255,255,255,0.1)" : "#f1f5f9",
                border: "none",
                color: isDarkMode ? "#e8d5a3" : "#64748b",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.15)" : "#e2e8f0"}
              onMouseLeave={(e) => e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.1)" : "#f1f5f9"}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loadingAdmin} 
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentLight} 100%)`,
                border: "none",
                color: "#0f172a",
                fontWeight: 700,
                cursor: loadingAdmin ? "not-allowed" : "pointer",
                opacity: loadingAdmin ? 0.7 : 1,
                transition: "all 0.3s ease",
                boxShadow: `0 4px 15px ${accentColor}30`,
              }}
              onMouseEnter={(e) => {
                if (!loadingAdmin && !isMobile) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 25px ${accentColor}40`;
                }
              }}
              onMouseLeave={(e) => {
                if (!loadingAdmin && !isMobile) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 4px 15px ${accentColor}30`;
                }
              }}
            >
              {loadingAdmin ? "Updating..." : "Update Product"}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Container>
  );
};

export default ProductPage;
