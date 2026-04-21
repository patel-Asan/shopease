import { useEffect, useState, useContext } from "react";
import { apiFetch } from "../api/api";
import ProductCard from "../components/ProductCard.jsx";
import AddProduct from "../components/AddProduct.jsx";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FaShoppingBag, FaFire, FaStar } from "react-icons/fa";

export default function Home() {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await apiFetch("/products");
      setProducts(response.data || response || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const accentColor = isDarkMode ? "#c9a962" : "#6366f1";
  const accentLight = isDarkMode ? "#e8d5a3" : "#818cf8";
  const bgColor = isDarkMode ? "#050507" : "#f8fafc";
  const textColor = isDarkMode ? "#ffffff" : "#0f172a";
  const textSecondary = isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  const styles = {
    container: {
      minHeight: "calc(100vh - 80px)",
      padding: "40px 20px",
      maxWidth: "1400px",
      margin: "0 auto",
    },
    heroSection: {
      textAlign: "center",
      marginBottom: "50px",
      padding: "50px 30px",
      background: `linear-gradient(135deg, ${accentColor}15 0%, ${accentLight}08 100%)`,
      border: `1px solid ${accentColor}30`,
      borderRadius: "24px",
      position: "relative",
      overflow: "hidden",
    },
    heroTitle: {
      fontSize: "clamp(28px, 5vw, 40px)",
      fontWeight: "800",
      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentLight} 100%)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "16px",
    },
    heroSubtitle: {
      fontSize: "16px",
      color: textSecondary,
      maxWidth: "500px",
      margin: "0 auto",
      lineHeight: "1.7",
    },
    adminSection: {
      marginBottom: "30px",
      padding: "24px",
      backgroundColor: cardBg,
      border: `1px solid ${borderColor}`,
      borderRadius: "20px",
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "calc(100vh - 150px)",
      gap: "30px",
    },
    loaderWrapper: {
      position: "relative",
      width: "120px",
      height: "120px",
    },
    loaderCircle: {
      position: "absolute",
      width: "100%",
      height: "100%",
      border: `4px solid transparent`,
      borderTopColor: accentColor,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    loaderCircle2: {
      position: "absolute",
      width: "80%",
      height: "80%",
      top: "10%",
      left: "10%",
      border: `4px solid transparent`,
      borderTopColor: accentLight,
      borderRadius: "50%",
      animation: "spin 1.5s linear infinite reverse",
    },
    loaderCenter: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "40px",
      color: accentColor,
    },
    skeletonCard: {
      width: "280px",
      height: "350px",
      borderRadius: "16px",
      background: cardBg,
      overflow: "hidden",
    },
    skeletonImage: {
      width: "100%",
      height: "200px",
      background: `linear-gradient(90deg, ${borderColor} 25%, ${cardBg} 50%, ${borderColor} 75%)`,
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    },
    skeletonText: {
      height: "16px",
      margin: "16px",
      borderRadius: "4px",
      background: `linear-gradient(90deg, ${borderColor} 25%, ${cardBg} 50%, ${borderColor} 75%)`,
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    },
    loadingText: {
      color: textSecondary,
      fontSize: "18px",
      fontWeight: "500",
    },
    emptyContainer: {
      textAlign: "center",
      padding: "80px 30px",
      backgroundColor: cardBg,
      border: `1px solid ${borderColor}`,
      borderRadius: "24px",
    },
    emptyIcon: {
      fontSize: "60px",
      marginBottom: "20px",
    },
    emptyTitle: {
      fontSize: "24px",
      fontWeight: "700",
      color: textColor,
      marginBottom: "10px",
    },
    emptyText: {
      fontSize: "15px",
      color: textSecondary,
    },
    productsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      flexWrap: "wrap",
      gap: "16px",
    },
    productsTitle: {
      fontSize: "24px",
      fontWeight: "700",
      color: textColor,
    },
    productsCount: {
      fontSize: "14px",
      color: accentColor,
      background: `${accentColor}15`,
      padding: "8px 16px",
      borderRadius: "20px",
    },
    productsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: "24px",
    },
  };

  const getResponsiveStyles = () => {
    if (isMobile) {
      return {
        container: { padding: "20px 16px" },
        heroSection: { padding: "30px 20px", marginBottom: "30px", borderRadius: "16px" },
        heroTitle: { fontSize: "22px" },
        heroSubtitle: { fontSize: "14px", maxWidth: "100%" },
        adminSection: { padding: "16px", marginBottom: "20px", borderRadius: "16px" },
        productsHeader: { flexDirection: "column", alignItems: "flex-start", gap: "12px" },
        productsTitle: { fontSize: "20px" },
        productsCount: { fontSize: "12px", padding: "6px 12px" },
        productsGrid: { gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
        emptyContainer: { padding: "40px 20px", borderRadius: "16px" },
        emptyIcon: { fontSize: "40px" },
        emptyTitle: { fontSize: "18px" },
        emptyText: { fontSize: "14px" },
        loadingContainer: { minHeight: "40vh" },
      };
    }
    return {};
  };

  const responsiveStyles = getResponsiveStyles();
  const mergedStyles = { ...styles, ...responsiveStyles };

  if (loading) {
    return (
      <div style={mergedStyles.container}>
        <div style={styles.heroSection}>
          <div style={styles.loadingContainer}>
            <div style={styles.loaderWrapper}>
              <div style={styles.loaderCircle} />
              <div style={styles.loaderCircle2} />
              <div style={styles.loaderCenter}>
                <FaShoppingBag />
              </div>
            </div>
            <p style={styles.loadingText}>Loading products...</p>
          </div>
        </div>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={mergedStyles.container}>
      <div style={mergedStyles.heroSection}>
        <h1 style={styles.heroTitle}>
          <FaFire style={{ marginRight: "12px", color: accentColor }} />
          Discover Premium Products
        </h1>
        <p style={styles.heroSubtitle}>
          Explore our curated collection of luxury items designed for the discerning.
        </p>
      </div>

      {user?.role === "admin" && (
        <div style={mergedStyles.adminSection}>
          <AddProduct onAdded={loadProducts} />
        </div>
      )}

      {products.length === 0 ? (
        <div style={mergedStyles.emptyContainer}>
          <div style={mergedStyles.emptyIcon}>📦</div>
          <h3 style={mergedStyles.emptyTitle}>No Products Yet</h3>
          <p style={mergedStyles.emptyText}>
            {user?.role === "admin" ? "Start by adding your first product!" : "Check back soon for exciting products!"}
          </p>
        </div>
      ) : (
        <>
          <div style={mergedStyles.productsHeader}>
            <h2 style={mergedStyles.productsTitle}>
              <FaStar style={{ marginRight: "10px", color: accentColor }} />
              All Products
            </h2>
            <span style={mergedStyles.productsCount}>{products.length} products</span>
          </div>
          <div style={mergedStyles.productsGrid}>
            {products.map((p, index) => (
              <div key={p._id} style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both` }}>
                <ProductCard product={p} onProductChange={loadProducts} />
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}
