import { useEffect, useState, useContext } from "react";
import { apiFetch, validateCoupon, getImageUrl } from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaGift, FaTicketAlt, FaCopy, FaCheck, FaShoppingBag, FaMapMarkerAlt, FaCreditCard, FaQrcode } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import QRPayment from "../components/QRPayment";

export default function Checkout() {
  const { cart: globalCart, clearCart, cartCount } = useContext(CartContext);
  const { isDarkMode } = useTheme();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [discountedTotal, setDiscountedTotal] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
 
  const navigate = useNavigate();
 
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 480);
      setIsTablet(width > 480 && width <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
 
  const loadData = async () => {
    setLoading(true);
    try {
      const userRes = await apiFetch("/user");
      setAddresses(userRes.data.addresses || []);
 
      if (userRes.data.addresses?.length > 0) {
        setSelectedAddress(userRes.data.addresses[0]._id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load checkout data");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    loadData();
  }, []);
 
  const total = globalCart.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
  const finalTotal = discountedTotal !== null ? discountedTotal : total;
  const discountAmount = total - finalTotal;

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setValidatingCoupon(true);
    try {
      const response = await validateCoupon(couponCode, total);
      if (response.data.isValid) {
        setAppliedCoupon({
          code: couponCode,
          discountPercentage: response.data.discountPercentage,
          discountAmount: response.data.discountAmount,
        });
        setDiscountedTotal(response.data.finalAmount);
        toast.success(`Coupon applied! You saved ₹${response.data.discountAmount}`);
      }
    } catch (error) {
      setAppliedCoupon(null);
      setDiscountedTotal(null);
      toast.error(error.response?.data?.message || "Invalid coupon code");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountedTotal(null);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };
 
  const placeOrder = async () => {
    if (isPlacingOrder) {
      return;
    }
    
    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }
    
    if (!globalCart.length) {
      toast.error("Cart is empty");
      return;
    }
    
    setIsPlacingOrder(true);
    
    try {
      const orderRes = await apiFetch("/orders/create", {
        method: "POST",
        body: { 
          paymentMethod, 
          addressId: selectedAddress,
          couponCode: appliedCoupon ? appliedCoupon.code : null
        },
      });
      
      toast.success(orderRes.message || "Order placed successfully!");
      
      await clearCart();
      
      setAppliedCoupon(null);
      setDiscountedTotal(null);
      setCouponCode("");
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      navigate("/orders");
      
    } catch (err) {
      toast.error(err?.message || err?.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: isMobile ? "1rem" : "2rem",
      minHeight: "100vh",
      position: "relative",
    },
    bgOrb1: {
      position: "fixed",
      top: "-200px",
      right: "-200px",
      width: "500px",
      height: "500px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(201, 169, 98, 0.12) 0%, transparent 70%)",
      pointerEvents: "none",
      zIndex: 0,
    },
    bgOrb2: {
      position: "fixed",
      bottom: "-200px",
      left: "-200px",
      width: "600px",
      height: "600px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(201, 169, 98, 0.08) 0%, transparent 70%)",
      pointerEvents: "none",
      zIndex: 0,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: isMobile ? "1.25rem" : "2rem",
      position: "relative",
      zIndex: 1,
    },
    title: {
      fontSize: isMobile ? "1.5rem" : "2.5rem",
      fontWeight: "800",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      margin: 0,
    },
    themeToggle: {
      padding: "10px 16px",
      borderRadius: "12px",
      border: "1px solid rgba(201, 169, 98, 0.3)",
      background: "rgba(201, 169, 98, 0.1)",
      color: "#c9a962",
      cursor: "pointer",
      fontSize: "1.1rem",
      transition: "all 0.3s ease",
    },
    section: {
      background: isDarkMode ? "rgba(30, 30, 40, 0.95)" : "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      padding: isMobile ? "1rem" : "1.5rem",
      borderRadius: isMobile ? "16px" : "20px",
      boxShadow: isDarkMode ? "none" : "0 4px 20px rgba(0,0,0,0.08)",
      marginBottom: isMobile ? "1rem" : "1.5rem",
      border: "1px solid rgba(201, 169, 98, 0.15)",
      position: "relative",
      zIndex: 1,
    },
    sectionTitle: {
      marginBottom: isMobile ? "0.875rem" : "1.25rem",
      fontSize: isMobile ? "1rem" : "1.4rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      color: isDarkMode ? "#e8d5a3" : "#1e293b",
      fontWeight: 700,
    },
    cartItem: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "center",
      padding: isMobile ? "0.75rem" : "1rem",
      borderRadius: "14px",
      marginBottom: isMobile ? "0.5rem" : "0.75rem",
      background: "rgba(201, 169, 98, 0.05)",
      gap: isMobile ? "0.75rem" : "0",
      transition: "all 0.3s ease",
      border: "1px solid rgba(201, 169, 98, 0.1)",
    },
    cartItemLeft: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "0.75rem" : "1rem",
      width: isMobile ? "100%" : "auto",
    },
    cartItemImage: {
      width: isMobile ? "50px" : "70px",
      height: isMobile ? "50px" : "70px",
      objectFit: "cover",
      borderRadius: "10px",
      flexShrink: 0,
    },
    cartItemDetails: {
      flex: 1,
      minWidth: 0,
    },
    cartItemName: {
      fontWeight: 600,
      fontSize: isMobile ? "0.85rem" : "1rem",
      color: isDarkMode ? "#ffffff" : "#1e293b",
      marginBottom: "0.25rem",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    cartItemPrice: {
      fontSize: isMobile ? "0.8rem" : "0.95rem",
      color: isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b",
    },
    cartItemTotal: {
      fontWeight: 700,
      fontSize: isMobile ? "0.95rem" : "1.1rem",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginTop: isMobile ? "0.5rem" : "0",
    },
    totalAmount: {
      textAlign: "right",
      marginTop: "1.25rem",
      fontSize: isMobile ? "1.2rem" : "1.5rem",
    },
    discountSection: {
      marginTop: "1.25rem",
      padding: "1.25rem",
      background: "rgba(201, 169, 98, 0.05)",
      borderRadius: "16px",
      border: "1px solid rgba(201, 169, 98, 0.15)",
    },
    couponInput: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "0.75rem" : "1rem",
      marginTop: "1rem",
    },
    input: {
      flex: 1,
      padding: isMobile ? "0.75rem 0.875rem" : "0.875rem 1rem",
      border: "1px solid rgba(201, 169, 98, 0.3)",
      borderRadius: "10px",
      fontSize: isMobile ? "0.9rem" : "1rem",
      outline: "none",
      transition: "all 0.3s ease",
      background: isDarkMode ? "rgba(0,0,0,0.2)" : "rgba(201, 169, 98, 0.05)",
      color: isDarkMode ? "#ffffff" : "#1e293b",
    },
    applyBtn: {
      padding: isMobile ? "0.75rem 1.25rem" : "0.875rem 1.5rem",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      color: "#000",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: isMobile ? "0.85rem" : "1rem",
      fontWeight: 600,
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(201, 169, 98, 0.3)",
      whiteSpace: "nowrap",
    },
    appliedCoupon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1rem",
      background: "rgba(16, 185, 129, 0.1)",
      borderRadius: "12px",
      marginTop: "1rem",
      border: "1px solid rgba(16, 185, 129, 0.2)",
    },
    removeCoupon: {
      padding: "0.5rem 1rem",
      background: "rgba(239, 68, 68, 0.1)",
      color: "#ef4444",
      border: "1px solid rgba(239, 68, 68, 0.2)",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: 600,
      transition: "all 0.3s ease",
    },
    addressLabel: {
      display: "flex",
      alignItems: isMobile ? "flex-start" : "center",
      flexDirection: isMobile ? "column" : "row",
      padding: isMobile ? "0.875rem" : "1.25rem",
      cursor: "pointer",
      gap: isMobile ? "0.5rem" : "1rem",
      borderRadius: "12px",
      transition: "all 0.2s",
      border: "1px solid rgba(201, 169, 98, 0.15)",
      marginBottom: isMobile ? "0.5rem" : "0.75rem",
      background: "rgba(201, 169, 98, 0.03)",
    },
    addressRadio: {
      marginTop: isMobile ? "0" : "0.2rem",
      accentColor: "#c9a962",
      width: isMobile ? "18px" : "20px",
      height: isMobile ? "18px" : "20px",
    },
    addressContent: {
      flex: 1,
      minWidth: 0,
    },
    addressLabel_text: {
      fontWeight: 700,
      color: "#c9a962",
      marginBottom: "0.25rem",
      fontSize: isMobile ? "0.85rem" : "1rem",
    },
    addressDetails: {
      fontSize: isMobile ? "0.8rem" : "0.9rem",
      color: isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b",
      lineHeight: 1.5,
    },
    paymentOption: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "0.75rem" : "1rem",
      padding: isMobile ? "0.75rem" : "1rem",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "all 0.2s",
      border: "1px solid rgba(201, 169, 98, 0.15)",
      marginBottom: isMobile ? "0.5rem" : "0.75rem",
      background: "rgba(201, 169, 98, 0.03)",
    },
    paymentRadio: {
      margin: 0,
      accentColor: "#c9a962",
      width: isMobile ? "18px" : "20px",
      height: isMobile ? "18px" : "20px",
    },
    paymentLabel: {
      fontSize: isMobile ? "0.85rem" : "1rem",
      fontWeight: 600,
      color: isDarkMode ? "#ffffff" : "#1e293b",
    },
    onlinePaymentGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
      gap: "1rem",
      marginTop: "1rem",
    },
    onlinePaymentCard: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "1rem",
      border: "1px solid rgba(201, 169, 98, 0.15)",
      borderRadius: "14px",
      cursor: "pointer",
      transition: "all 0.2s",
      background: "rgba(201, 169, 98, 0.03)",
    },
    paymentImg: {
      width: isMobile ? "40px" : "60px",
      height: "auto",
    },
    placeOrderBtn: {
      padding: isMobile ? "1rem" : "1rem 2.5rem",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      color: "#000",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: isMobile ? "1rem" : "1.1rem",
      fontWeight: 700,
      width: isMobile ? "100%" : "auto",
      marginTop: isMobile ? "1rem" : "0",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 20px rgba(201, 169, 98, 0.4)",
    },
    loadingContainer: {
      textAlign: "center",
      marginTop: "4rem",
      position: "relative",
      zIndex: 1,
    },
    emptyCart: {
      textAlign: "center",
      marginTop: "6rem",
      position: "relative",
      zIndex: 1,
    },
    discountBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      background: "rgba(201, 169, 98, 0.15)",
      color: "#c9a962",
      padding: "0.4rem 0.9rem",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: 700,
      marginLeft: "0.5rem",
    },
    copyIcon: {
      cursor: "pointer",
      marginLeft: "0.5rem",
      color: "#c9a962",
      transition: "all 0.3s ease",
    },
    spinner: {
      width: "50px",
      height: "50px",
      border: "3px solid rgba(201, 169, 98, 0.2)",
      borderTop: "3px solid #c9a962",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto 1rem",
    },
    priceRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0.5rem 0",
      color: isDarkMode ? "#a0a0a0" : "#64748b",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "1rem 0 0.5rem",
      borderTop: "2px solid rgba(201, 169, 98, 0.2)",
      marginTop: "0.75rem",
      fontSize: "1.2rem",
      fontWeight: 800,
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
  };
 
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.bgOrb1} />
        <div style={styles.bgOrb2} />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={{ color: isDarkMode ? "#a0a0a0" : "#64748b" }}>Loading checkout...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
 
  if (!globalCart.length) {
    return (
      <div style={styles.container}>
        <div style={styles.bgOrb1} />
        <div style={styles.bgOrb2} />
        <div style={styles.emptyCart}>
          <FaShoppingBag style={{ fontSize: "4rem", color: "rgba(201, 169, 98, 0.3)", marginBottom: "1.5rem" }} />
          <p style={{ fontSize: "1.3rem", color: isDarkMode ? "#a0a0a0" : "#64748b" }}>Your cart is empty</p>
          <button
            onClick={() => navigate("/products")}
            style={{
              ...styles.placeOrderBtn,
              background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
              width: isMobile ? "100%" : "auto",
            }}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }
 
  return (
    <div style={styles.container}>
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />
      
      <div style={styles.header}>
        <h2 style={styles.title}>Checkout</h2>
      </div>
 
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <FaShoppingBag style={{ color: "#c9a962" }} />
          Your Cart ({cartCount} items)
          {discountedTotal !== null && (
            <span style={styles.discountBadge}>
              <FaTicketAlt /> {appliedCoupon?.discountPercentage}% OFF
            </span>
          )}
        </h3>
        {globalCart.map((item) => (
          <div
            key={item._id}
            style={styles.cartItem}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.background = "rgba(201, 169, 98, 0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "rgba(201, 169, 98, 0.05)";
              }
            }}
          >
            <div style={styles.cartItemLeft}>
              <img
                src={
                  item.product?.img
                    ? getImageUrl(item.product.img)
                    : "/default-image.jpg"
                }
                alt={item.product?.name}
                style={styles.cartItemImage}
              />
              <div style={styles.cartItemDetails}>
                <div style={styles.cartItemName}>{item.product?.name}</div>
                <div style={styles.cartItemPrice}>
                  ₹{item.product?.price?.toLocaleString()} × {item.quantity}
                </div>
              </div>
            </div>
            <div style={styles.cartItemTotal}>
              ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
        
        <div style={styles.discountSection}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <FaGift style={{ color: "#c9a962" }} />
            <strong style={{ color: isDarkMode ? "#e8d5a3" : "#1e293b" }}>Have a coupon code?</strong>
          </div>
          
          {!appliedCoupon ? (
            <div style={styles.couponInput}>
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = "#c9a962"}
                onBlur={(e) => e.target.style.borderColor = "rgba(201, 169, 98, 0.3)"}
              />
              <button
                onClick={handleValidateCoupon}
                disabled={validatingCoupon}
                style={{
                  ...styles.applyBtn,
                  opacity: validatingCoupon ? 0.7 : 1,
                  cursor: validatingCoupon ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!validatingCoupon) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(201, 169, 98, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!validatingCoupon) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(201, 169, 98, 0.3)";
                  }
                }}
              >
                {validatingCoupon ? "Validating..." : "Apply Coupon"}
              </button>
            </div>
          ) : (
            <div style={styles.appliedCoupon}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FaCheck style={{ color: "#10b981" }} />
                <strong>{appliedCoupon.code}</strong>
                <span style={{ fontSize: "0.9rem", color: "#10b981", fontWeight: 600 }}>
                  {appliedCoupon.discountPercentage}% OFF
                </span>
                <FaCopy
                  style={styles.copyIcon}
                  onClick={() => copyToClipboard(appliedCoupon.code)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>
              <button
                onClick={handleRemoveCoupon}
                style={styles.removeCoupon}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
              >
                Remove
              </button>
            </div>
          )}
        </div>
        
        <div style={{ marginTop: "1.25rem" }}>
          <div style={styles.priceRow}>
            <span>Subtotal:</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          {discountAmount > 0 && (
            <div style={{ ...styles.priceRow, color: "#10b981" }}>
              <span>Discount ({appliedCoupon?.discountPercentage}%):</span>
              <span>-₹{discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div style={styles.totalRow}>
            <span>Total:</span>
            <span>₹{finalTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
 
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <FaMapMarkerAlt style={{ color: "#c9a962" }} />
          Select Address
        </h3>
        {addresses.length === 0 && (
          <p style={{ textAlign: "center", color: isDarkMode ? "#a0a0a0" : "#666" }}>
            No addresses found. 
            <button
              onClick={() => navigate("/profile/addresses")}
              style={{ 
                background: "none", 
                border: "none", 
                color: "#c9a962", 
                cursor: "pointer",
                textDecoration: "underline",
                marginLeft: "0.5rem",
                fontWeight: 600,
              }}
            >
              Add one
            </button>
          </p>
        )}
        {addresses.map((addr) => (
          <label
            key={addr._id}
            style={{
              ...styles.addressLabel,
              borderColor: selectedAddress === addr._id ? "#c9a962" : "rgba(201, 169, 98, 0.15)",
              background: selectedAddress === addr._id ? "rgba(201, 169, 98, 0.1)" : "rgba(201, 169, 98, 0.03)",
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.background = "rgba(201, 169, 98, 0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.background = selectedAddress === addr._id ? "rgba(201, 169, 98, 0.1)" : "rgba(201, 169, 98, 0.03)";
              }
            }}
          >
            <input
              type="radio"
              value={addr._id}
              checked={selectedAddress === addr._id}
              onChange={() => setSelectedAddress(addr._id)}
              style={styles.addressRadio}
            />
            <div style={styles.addressContent}>
              <div style={styles.addressLabel_text}>{addr.label}</div>
              <div style={styles.addressDetails}>
                {addr.name} • {addr.phone}<br />
                {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}<br />
                {addr.country}
              </div>
            </div>
          </label>
        ))}
      </div>
 
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <FaCreditCard style={{ color: "#c9a962" }} />
          Payment Method
        </h3>
 
        <label
          style={{
            ...styles.paymentOption,
            borderColor: paymentMethod === "COD" ? "#c9a962" : "rgba(201, 169, 98, 0.15)",
            background: paymentMethod === "COD" ? "rgba(201, 169, 98, 0.1)" : "rgba(201, 169, 98, 0.03)",
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.currentTarget.style.background = "rgba(201, 169, 98, 0.1)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.currentTarget.style.background = paymentMethod === "COD" ? "rgba(201, 169, 98, 0.1)" : "rgba(201, 169, 98, 0.03)";
            }
          }}
        >
          <input
            type="radio"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
            style={styles.paymentRadio}
          />
          <span style={styles.paymentLabel}>Cash on Delivery</span>
        </label>
 
        <label
          style={{
            ...styles.paymentOption,
            borderColor: paymentMethod === "Online" ? "#c9a962" : "rgba(201, 169, 98, 0.15)",
            background: paymentMethod === "Online" ? "rgba(201, 169, 98, 0.1)" : "rgba(201, 169, 98, 0.03)",
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.currentTarget.style.background = "rgba(201, 169, 98, 0.1)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.currentTarget.style.background = paymentMethod === "Online" ? "rgba(201, 169, 98, 0.1)" : "rgba(201, 169, 98, 0.03)";
            }
          }}
        >
          <input
            type="radio"
            checked={paymentMethod === "Online"}
            onChange={() => setPaymentMethod("Online")}
            style={styles.paymentRadio}
          />
<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FaQrcode style={{ color: "#c9a962" }} />
            <span style={styles.paymentLabel}>UPI / QR Code</span>
          </div>
        </label>

        {paymentMethod === "Online" && (
          <div style={{
            ...styles.onlinePaymentGrid,
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem",
            background: isDarkMode ? "rgba(201, 169, 98, 0.05)" : "rgba(201, 169, 98, 0.05)",
            borderRadius: "16px",
            marginTop: "1rem",
            border: `1px solid ${isDarkMode ? "rgba(201, 169, 98, 0.2)" : "rgba(201, 169, 98, 0.2)"}`,
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, #c9a962, #e8d5a3)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
              boxShadow: "0 8px 30px rgba(201, 169, 98, 0.3)",
            }}>
              <FaQrcode style={{ fontSize: "2.5rem", color: "#0f172a" }} />
            </div>
            <h4 style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: isDarkMode ? "#e8d5a3" : "#0f172a",
              marginBottom: "0.5rem",
            }}>
              QR Code Payment
            </h4>
            <p style={{
              fontSize: "0.9rem",
              color: isDarkMode ? "rgba(255,255,255,0.6)" : "#64748b",
              textAlign: "center",
              marginBottom: "1rem",
              lineHeight: 1.5,
            }}>
              Pay instantly using any UPI app<br/>
              (PhonePe, Google Pay, Paytm, etc.)
            </p>
            <button
              onClick={() => setShowQRModal(true)}
              style={{
                padding: "14px 28px",
                borderRadius: "14px",
                background: `linear-gradient(135deg, #c9a962, #e8d5a3)`,
                border: "none",
                color: "#0f172a",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 8px 25px rgba(201, 169, 98, 0.4)",
              }}
            >
              <FaQrcode /> Generate QR Code
            </button>
          </div>
        )}
      </div>
 
      <div style={{ textAlign: "center", marginBottom: "2rem", position: "relative", zIndex: 1 }}>
        <button
          onClick={placeOrder}
          disabled={isPlacingOrder}
          style={{
            ...styles.placeOrderBtn,
            opacity: isPlacingOrder ? 0.7 : 1,
            cursor: isPlacingOrder ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!isMobile && !isPlacingOrder) {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(201, 169, 98, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile && !isPlacingOrder) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(201, 169, 98, 0.4)";
            }
          }}
        >
          {isPlacingOrder ? "Placing Order..." : `Place Order • ₹${finalTotal.toLocaleString()}`}
        </button>
      </div>

      {showQRModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          backdropFilter: "blur(8px)",
        }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowQRModal(false)}
              style={{
                position: "absolute",
                top: "-40px",
                right: 0,
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "#fff",
                fontSize: "1.2rem",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "8px",
              }}
            >
              ✕
            </button>
            <QRPayment
              amount={finalTotal}
              orderId={`ORD${Date.now()}`}
              customerName={globalCart[0]?.product?.name || "Multiple Items"}
              onSuccess={() => {
                setShowQRModal(false);
                toast.success("Payment initiated! Admin will confirm after verification.");
                placeOrder();
              }}
              onCancel={() => setShowQRModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
