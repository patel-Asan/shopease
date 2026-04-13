// components/RelatedProducts.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRelatedProducts } from '../api/api';

const RelatedProducts = ({ category, currentProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const navigate = useNavigate();

  // Screen size check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch related products
  useEffect(() => {
    if (category) {
      fetchRelatedProducts();
    }
  }, [category, currentProductId]);

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true);
      const response = await getRelatedProducts(category, currentProductId);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  // Shadow styles
  const shadows = {
    card: {
      default: "0 10px 25px -5px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02), 0 0 15px -5px rgba(255,107,107,0.1)",
      hover: "0 25px 35px -12px rgba(255,107,107,0.3), 0 0 0 2px rgba(255,107,107,0.2), 0 0 25px -8px rgba(255,107,107,0.3)",
    },
    button: {
      default: "0 4px 10px -2px rgba(255,107,107,0.2)",
      hover: "0 8px 20px -5px rgba(255,107,107,0.4)",
    },
  };

  const styles = {
    container: {
      marginTop: '80px',
      padding: isMobile ? '30px 0' : '40px 0',
      borderTop: '2px solid linear-gradient(90deg, transparent, #ff6b6b, transparent)',
      position: 'relative',
      background: 'linear-gradient(180deg, transparent 0%, rgba(255,107,107,0.02) 100%)',
      borderRadius: '40px 40px 0 0',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
      flexWrap: 'wrap',
      gap: '20px',
      padding: '0 10px',
    },
    titleContainer: {
      position: 'relative',
    },
    title: {
      fontSize: isMobile ? '26px' : '32px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #2d3436 0%, #ff6b6b 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0,
      letterSpacing: '-0.02em',
      position: 'relative',
      display: 'inline-block',
    },
    titleUnderline: {
      width: '80px',
      height: '4px',
      background: 'linear-gradient(90deg, #ff6b6b, #ff8e8e, transparent)',
      borderRadius: '2px',
      marginTop: '8px',
      animation: 'underlineExpand 0.8s ease-out',
    },
    viewAllBtn: {
      padding: '12px 28px',
      background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
      color: 'white',
      border: 'none',
      borderRadius: '40px',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: shadows.button.default,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      letterSpacing: '0.5px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: isMobile 
        ? 'repeat(2, 1fr)' 
        : 'repeat(4, 1fr)',
      gap: isMobile ? '20px' : '30px',
      padding: '10px',
    },
    productCard: (index) => ({
      cursor: 'pointer',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: hoveredCard === index ? shadows.card.hover : shadows.card.default,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: '#fff',
      transform: hoveredCard === index && !isMobile 
        ? 'translateY(-10px) scale(1.02)' 
        : 'translateY(0) scale(1)',
      position: 'relative',
      animation: hoveredCard === index ? 'cardGlow 2s infinite' : 'none',
    }),
    imageContainer: {
      width: '100%',
      aspectRatio: '1/1',
      overflow: 'hidden',
      backgroundColor: '#f8fafc',
      position: 'relative',
    },
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(180deg, transparent 0%, rgba(255,107,107,0.1) 100%)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none',
    },
    image: (isHovered) => ({
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      transform: isHovered ? 'scale(1.15)' : 'scale(1)',
    }),
    discountBadge: {
      position: 'absolute',
      top: '15px',
      left: '15px',
      background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
      color: 'white',
      padding: '6px 14px',
      borderRadius: '30px',
      fontSize: '12px',
      fontWeight: '700',
      zIndex: 2,
      boxShadow: '0 4px 12px rgba(255,107,107,0.3)',
      animation: 'badgePulse 2s infinite',
    },
    info: {
      padding: isMobile ? '16px' : '20px',
      background: 'linear-gradient(180deg, #fff 0%, #fafafa 100%)',
    },
    name: {
      fontSize: isMobile ? '15px' : '17px',
      fontWeight: '700',
      marginBottom: '10px',
      color: '#1e293b',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      letterSpacing: '-0.02em',
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '12px',
      flexWrap: 'wrap',
    },
    price: {
      fontSize: isMobile ? '18px' : '20px',
      color: '#ff6b6b',
      fontWeight: '800',
      lineHeight: 1.2,
    },
    originalPrice: {
      fontSize: isMobile ? '13px' : '15px',
      color: '#94a3b8',
      textDecoration: 'line-through',
    },
    ratingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '8px',
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    stars: {
      display: 'flex',
      gap: '2px',
      color: '#ffc107',
      fontSize: isMobile ? '13px' : '14px',
    },
    orders: {
      fontSize: isMobile ? '12px' : '13px',
      color: '#64748b',
      backgroundColor: '#f1f5f9',
      padding: '4px 10px',
      borderRadius: '20px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '60px',
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #ff6b6b',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite, glow 2s infinite',
      margin: '0 auto 20px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px',
      color: '#94a3b8',
      fontSize: isMobile ? '15px' : '17px',
      gridColumn: '1 / -1',
      background: '#f8fafc',
      borderRadius: '30px',
      border: '2px dashed #ff6b6b',
    },
    ratingStars: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.titleContainer}>
            <h2 style={styles.title}>Related Products</h2>
            <div style={styles.titleUnderline} />
          </div>
        </div>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={{ color: '#666', fontSize: '16px' }}>Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  // Render rating stars
  const renderRating = (rating = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div style={styles.ratingStars}>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} style={{ color: '#ffc107' }}>★</span>
        ))}
        {hasHalfStar && <span style={{ color: '#ffc107' }}>½</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} style={{ color: '#e0e0e0' }}>☆</span>
        ))}
      </div>
    );
  };

  // Calculate discount percentage
  const getDiscount = (product) => {
    if (!product.originalPrice || product.originalPrice <= product.price) return null;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleContainer}>
          <h2 style={styles.title}>You Might Also Like</h2>
          <div style={styles.titleUnderline} />
        </div>
        <button
          style={styles.viewAllBtn}
          onClick={() => {
            navigate(`/products?category=${category}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
            e.currentTarget.style.boxShadow = shadows.button.hover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = shadows.button.default;
          }}
        >
          <span>View All</span>
          <span style={{ fontSize: '18px' }}>→</span>
        </button>
      </div>

      <div style={styles.grid}>
        {products.slice(0, 4).map((product, index) => {
          const isHovered = hoveredCard === index;
          const discount = getDiscount(product);
          const imageUrl = !imageErrors[product._id] && product.img
            ? `http://localhost:5000/uploads/products/${product.img}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=ff6b6b&color=fff&size=200`;

          return (
            <div
              key={product._id}
              style={styles.productCard(index)}
              onClick={() => handleProductClick(product._id)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.imageContainer}>
                {discount && (
                  <span style={styles.discountBadge}>
                    -{discount}%
                  </span>
                )}
                <img
                  src={imageUrl}
                  alt={product.name}
                  style={styles.image(isHovered)}
                  loading="lazy"
                  onError={() => handleImageError(product._id)}
                />
                <div style={styles.imageOverlay} />
              </div>
              
              <div style={styles.info}>
                <h4 style={styles.name} title={product.name}>
                  {product.name}
                </h4>
                
                <div style={styles.priceContainer}>
                  <span style={styles.price}>
                    ₹{product.price?.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span style={styles.originalPrice}>
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                
                <div style={styles.ratingContainer}>
                  <div style={styles.rating}>
                    {renderRating(product.rating || 4)}
                  </div>
                  <span style={styles.orders}>
                    <span>📦</span> {product.totalOrders || 0}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(255,107,107,0.3)); }
          50% { filter: drop-shadow(0 0 15px rgba(255,107,107,0.6)); }
        }

        @keyframes underlineExpand {
          0% { width: 0; opacity: 0; }
          100% { width: 80px; opacity: 1; }
        }

        @keyframes cardGlow {
          0%, 100% { box-shadow: ${shadows.card.hover}; }
          50% { box-shadow: 0 30px 45px -15px rgba(255,107,107,0.4), 0 0 0 3px rgba(255,107,107,0.3); }
        }

        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default RelatedProducts;