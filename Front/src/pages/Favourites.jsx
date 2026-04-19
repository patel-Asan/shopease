import { useEffect, useContext, useState, useCallback } from "react";
import { getImageUrl } from "../api/api";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { FavouritesContext } from "../context/FavouritesContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHeart, FaArrowRight } from "react-icons/fa";
 
export default function Favourites() {
  const { favourites, loading, removeFromFavourites, fetchFavourites } =
    useContext(FavouritesContext);
  const { isDarkMode } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 576);
      setIsTablet(width > 576 && width <= 992);
    };
 
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
 
  useEffect(() => {
    fetchFavourites();
  }, [fetchFavourites]);
 
  const handleRemove = async (productId, favId) => {
    const idToRemove = productId || favId;
 
    if (!idToRemove) {
      toast.error("Cannot remove item: Invalid ID");
      return;
    }
 
    try {
      setRemovingId(idToRemove);
      await removeFromFavourites(idToRemove);
    } catch (error) {
      console.error("Error removing favourite:", error);
      toast.error("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };
 
  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };
 
  const getGridCols = useCallback(() => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 4;
  }, [isMobile, isTablet]);

  const styles = {
    container: {
      paddingTop: isMobile ? "1.5rem" : "2rem",
      paddingBottom: isMobile ? "1.5rem" : "2rem",
      paddingLeft: isMobile ? "0.5rem" : "1rem",
      paddingRight: isMobile ? "0.5rem" : "1rem",
      minHeight: "80vh",
      maxWidth: "1200px",
      margin: "0 auto",
      width: "100%",
      position: "relative",
    },
    bgOrb1: {
      position: "fixed",
      top: "-200px",
      right: "-200px",
      width: "500px",
      height: "500px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(201, 169, 98, 0.1) 0%, transparent 70%)",
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
      marginBottom: "2rem",
      position: "relative",
      zIndex: 1,
    },
    title: {
      fontSize: isMobile ? "1.8rem" : "2.5rem",
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
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
      gap: "1.5rem",
      position: "relative",
      zIndex: 1,
    },
    spinner: {
      width: isMobile ? "40px" : "50px",
      height: isMobile ? "40px" : "50px",
      border: "3px solid rgba(201, 169, 98, 0.2)",
      borderTopColor: "#c9a962",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    loadingText: {
      fontSize: isMobile ? "1rem" : "1.1rem",
      color: isDarkMode ? "#a0a0a0" : "#64748b",
      fontWeight: 500,
    },
    emptyContainer: {
      textAlign: "center",
      padding: isMobile ? "4rem 1rem" : "6rem 1rem",
      maxWidth: "500px",
      margin: "2rem auto",
      position: "relative",
      zIndex: 1,
    },
    emptyIcon: {
      fontSize: isMobile ? "4rem" : "5rem",
      marginBottom: "1.5rem",
      color: "rgba(201, 169, 98, 0.3)",
    },
    emptyText: {
      color: isDarkMode ? "#a0a0a0" : "#64748b",
      fontSize: isMobile ? "1.2rem" : "1.3rem",
      marginBottom: "2rem",
      fontWeight: 500,
    },
    browseBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      padding: isMobile ? "1rem 2rem" : "0.875rem 2.5rem",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      color: "#000",
      border: "none",
      borderRadius: "14px",
      cursor: "pointer",
      fontSize: "1.1rem",
      fontWeight: 700,
      transition: "all 0.3s ease",
      boxShadow: "0 4px 20px rgba(201, 169, 98, 0.4)",
    },
    removedCard: {
      padding: isMobile ? "1rem" : "1.5rem",
      border: "1px solid rgba(239, 68, 68, 0.3)",
      background: isDarkMode ? "rgba(30, 30, 40, 0.9)" : "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      color: "#ef4444",
      borderRadius: "16px",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: isMobile ? "1rem" : "0",
      height: "100%",
      minHeight: isMobile ? "auto" : "120px",
    },
    removedText: {
      fontSize: isMobile ? "0.95rem" : "1rem",
      fontWeight: 500,
    },
    card: {
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      cursor: "pointer",
      border: "1px solid rgba(201, 169, 98, 0.15)",
      background: isDarkMode ? "rgba(30, 30, 40, 0.9)" : "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      width: "100%",
      maxWidth: "100%",
      position: "relative",
      zIndex: 1,
    },
    cardImageContainer: {
      width: "100%",
      paddingTop: "100%",
      position: "relative",
      overflow: "hidden",
      background: "rgba(201, 169, 98, 0.1)",
    },
    cardImage: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s ease",
    },
    cardBody: {
      display: "flex",
      flexDirection: "column",
      padding: isMobile ? "1rem" : "1.25rem",
      flex: 1,
    },
    cardTitle: {
      fontWeight: 600,
      fontSize: isMobile ? "1rem" : "1.1rem",
      marginBottom: "0.5rem",
      color: isDarkMode ? "#e8d5a3" : "#1e293b",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    cardPrice: {
      fontWeight: 700,
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "1rem",
      fontSize: isMobile ? "1.1rem" : "1.2rem",
    },
    removeBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      background: "rgba(239, 68, 68, 0.1)",
      border: "1px solid rgba(239, 68, 68, 0.2)",
      color: "#ef4444",
      padding: isMobile ? "0.75rem" : "0.65rem",
      fontSize: "0.9rem",
      fontWeight: 600,
      transition: "all 0.3s ease",
      marginTop: "auto",
      width: "100%",
      borderRadius: "12px",
      cursor: "pointer",
    },
    removeBtnDisabled: {
      background: "rgba(108, 117, 125, 0.1)",
      color: "#6c757d",
      border: "1px solid rgba(108, 117, 125, 0.2)",
      cursor: "not-allowed",
      opacity: 0.7,
    },
    placeholderImage: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(201, 169, 98, 0.1)",
      color: "#c9a962",
      fontSize: isMobile ? "2.5rem" : "3rem",
      fontWeight: 700,
    },
    row: {
      marginLeft: isMobile ? "-0.5rem" : "-0.75rem",
      marginRight: isMobile ? "-0.5rem" : "-0.75rem",
      position: "relative",
      zIndex: 1,
    },
    col: {
      paddingLeft: isMobile ? "0.5rem" : "0.75rem",
      paddingRight: isMobile ? "0.5rem" : "0.75rem",
      marginBottom: isMobile ? "0.75rem" : "1.5rem",
    },
    footer: {
      textAlign: "center",
      marginTop: "2rem",
      padding: "1.5rem",
      background: isDarkMode ? "rgba(30, 30, 40, 0.9)" : "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "16px",
      border: "1px solid rgba(201, 169, 98, 0.2)",
      position: "relative",
      zIndex: 1,
    },
    footerText: {
      fontSize: isMobile ? "0.95rem" : "1rem",
      color: isDarkMode ? "#a0a0a0" : "#64748b",
      margin: 0,
    },
    footerCount: {
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: 700,
    },
  };
 
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
 
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.bgOrb1} />
        <div style={styles.bgOrb2} />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <span style={styles.loadingText}>Loading your favourites...</span>
        </div>
      </div>
    );
  }
 
  if (!favourites || favourites.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.bgOrb1} />
        <div style={styles.bgOrb2} />
        <div style={styles.emptyContainer}>
          <FaHeart style={styles.emptyIcon} />
          <p style={styles.emptyText}>Your favourites list is empty</p>
          <button
            onClick={() => navigate("/products")}
            style={styles.browseBtn}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 25px rgba(201, 169, 98, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 20px rgba(201, 169, 98, 0.4)";
            }}
          >
            Browse Products <FaArrowRight />
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
        <h2 style={styles.title}>
          <FaHeart style={{ marginRight: "12px" }} />
          Your Favourites
        </h2>
      </div>
 
      <Row 
        xs={1} 
        sm={isTablet ? 2 : 2} 
        md={isTablet ? 2 : 3} 
        lg={4} 
        className="g-3 g-md-4"
        style={styles.row}
      >
        {favourites.map((item, index) => {
          const productId = item.productId || item._id || item.id;
          const favId = item._id || item.id;
          const uniqueId = productId || favId || `temp-${index}`;
 
          const product = item.product || item;
          const productName = product.name || item.name || "Unknown Product";
          const productPrice = product.price || item.price || 0;
          const productImage = product.img || item.img;
 
          const hasImageError = imageErrors[uniqueId];
          const isRemoving = removingId === (productId || favId);
          const isProductRemoved = !product.name && !item.name;
 
          return (
            <Col key={uniqueId} style={styles.col}>
              {isProductRemoved ? (
                <div style={styles.removedCard}>
                  <span style={styles.removedText}>Product removed from catalog</span>
                  <button
                    onClick={() => handleRemove(productId, favId)}
                    disabled={isRemoving}
                    style={{
                      ...styles.removeBtn,
                      ...(isRemoving ? styles.removeBtnDisabled : {}),
                      minWidth: isMobile ? "100%" : "80px",
                    }}
                  >
                    {isRemoving ? <Spinner animation="border" size="sm" /> : "Remove"}
                  </button>
                </div>
              ) : (
                <Card
                  style={styles.card}
                  onClick={() => navigate(`/product/${productId || favId}`)}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow = "0 12px 40px rgba(201, 169, 98, 0.25)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                    }
                  }}
                >
                  <div style={styles.cardImageContainer}>
                    {productImage && !hasImageError ? (
                      <Card.Img
                        variant="top"
                        src={getImageUrl(productImage)}
                        alt={productName}
                        style={styles.cardImage}
                        onError={() => handleImageError(uniqueId)}
                        onMouseEnter={(e) => {
                          if (!isMobile) {
                            e.currentTarget.style.transform = "scale(1.1)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isMobile) {
                            e.currentTarget.style.transform = "scale(1)";
                          }
                        }}
                        loading="lazy"
                      />
                    ) : (
                      <div style={styles.placeholderImage}>
                        {productName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
 
                  <Card.Body style={styles.cardBody}>
                    <Card.Title style={styles.cardTitle} title={productName}>
                      {productName}
                    </Card.Title>
                    <Card.Text style={styles.cardPrice}>
                      ₹{Number(productPrice).toLocaleString("en-IN")}
                    </Card.Text>
 
                    <button
                      style={{
                        ...styles.removeBtn,
                        ...(isRemoving ? styles.removeBtnDisabled : {}),
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(productId, favId);
                      }}
                      disabled={isRemoving}
                      onMouseEnter={(e) => {
                        if (!isMobile && !isRemoving) {
                          e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isMobile && !isRemoving) {
                          e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                        }
                      }}
                    >
                      {isRemoving ? (
                        <>
                          <Spinner animation="border" size="sm" />
                          Removing...
                        </>
                      ) : (
                        <>
                          <FaHeart style={{ color: "#ef4444" }} />
                          Remove
                        </>
                      )}
                    </button>
                  </Card.Body>
                </Card>
              )}
            </Col>
          );
        })}
      </Row>
 
      {favourites.length > 0 && (
        <div style={styles.footer}>
          <p style={styles.footerText}>
            You have <span style={styles.footerCount}>{favourites.length}</span> {favourites.length === 1 ? 'item' : 'items'} in your favourites
          </p>
        </div>
      )}
    </div>
  );
}
