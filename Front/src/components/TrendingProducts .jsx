import React, { useState, useEffect } from 'react';
import { getTrendingProducts } from '../api/api';
import { useNavigate } from 'react-router-dom';

const TrendingProducts = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setLoading(true);
        const response = await getTrendingProducts();
        const products = response.data || response;
        setTrendingProducts(Array.isArray(products) ? products : []);
      } catch (error) {
        console.error('Error fetching trending products:', error);
        setTrendingProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const getImageUrl = (product) => {
    if (product.img) {
      return product.img.startsWith('http') ? product.img : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dnrpj0v3l'}/image/upload/${product.img}`;
    }
    if (product.image) {
      return product.image.startsWith('http') 
        ? product.image 
        : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dnrpj0v3l'}/image/upload/${product.image}`;
    }
    return "/default-image.jpg";
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const shadows = {
    card: {
      default: "var(--shadow-md), 0 0 0 1px var(--border-color)",
      hover: "0 30px 40px -15px rgba(99, 102, 241, 0.4), 0 0 0 2px rgba(99, 102, 241, 0.3)",
    },
  };

  const styles = {
    container: {
      width: '100%',
      maxWidth: '1400px',
      margin: '60px auto',
      padding: isMobile ? '0 20px' : '0 30px',
      fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    header: {
      textAlign: 'center',
      marginBottom: '50px',
      position: 'relative',
    },
    trendingBadge: {
      display: 'inline-block',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      color: 'white',
      padding: '10px 28px',
      borderRadius: '40px',
      fontSize: '14px',
      fontWeight: '700',
      marginBottom: '20px',
      boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
    title: {
      fontSize: isMobile ? '2rem' : '2.75rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, var(--text-primary) 0%, #a78bfa 50%, #c084fc 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '15px',
      letterSpacing: '-0.02em',
    },
    subtitle: {
      fontSize: isMobile ? '1rem' : '1.15rem',
      color: 'var(--text-secondary)',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.7',
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile 
        ? '1fr' 
        : 'repeat(5, 1fr)',
      gap: isMobile ? '20px' : '24px',
      marginTop: '40px',
    },
    productCard: (index) => ({
      backgroundColor: 'var(--bg-glass)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: hoveredCard === index ? shadows.card.hover : shadows.card.default,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      transform: hoveredCard === index && !isMobile 
        ? 'translateY(-12px) scale(1.03)' 
        : 'translateY(0) scale(1)',
      border: '1px solid var(--border-color)',
    }),
    productImageContainer: {
      position: 'relative',
      paddingTop: '100%',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-primary)',
    },
    productImage: (isHovered) => ({
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    }),
    badgeContainer: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      right: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      zIndex: 2,
    },
    trendingTag: (index) => ({
      padding: '6px 14px',
      borderRadius: '30px',
      fontSize: '11px',
      fontWeight: '700',
      zIndex: 2,
      background: index === 0 
        ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
        : index === 1
          ? 'linear-gradient(135deg, #94a3b8, #64748b)'
          : index === 2
            ? 'linear-gradient(135deg, #d97706, #b45309)'
            : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: index < 3 ? '#000' : '#fff',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    }),
    rankBadge: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      color: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '800',
      boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)',
      border: '2px solid rgba(15, 23, 42, 0.8)',
    },
    productInfo: {
      padding: '18px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(20px)',
    },
    productName: {
      fontSize: isMobile ? '1rem' : '0.95rem',
      fontWeight: '600',
      color: 'var(--text-primary)',
      marginBottom: '8px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    ratingContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginBottom: '10px',
    },
    stars: {
      display: 'flex',
      gap: '2px',
      color: '#fbbf24',
      fontSize: '13px',
    },
    reviewsCount: {
      fontSize: '11px',
      color: 'var(--text-muted)',
      fontWeight: '500',
    },
    priceRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '10px',
    },
    productPrice: {
      fontSize: isMobile ? '1.25rem' : '1.15rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    orderCount: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '11px',
      color: 'var(--text-muted)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      padding: '4px 10px',
      borderRadius: '20px',
      fontWeight: '600',
    },
    progressBar: {
      width: '100%',
      height: '4px',
      backgroundColor: 'var(--border-color)',
      borderRadius: '2px',
      marginTop: '8px',
      overflow: 'hidden',
    },
    progressFill: (orders) => ({
      width: `${Math.min((orders / 200) * 100, 100)}%`,
      height: '100%',
      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
      borderRadius: '2px',
      transition: 'width 1s ease-in-out',
    }),
    loadingContainer: {
      textAlign: 'center',
      padding: '80px 40px',
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '4px solid rgba(99, 102, 241, 0.2)',
      borderTopColor: '#6366f1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 20px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px',
      color: 'var(--text-muted)',
      fontSize: '1.1rem',
      gridColumn: '1 / -1',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid var(--border-color)',
    },
    viewAllBtn: {
      display: 'inline-block',
      color: '#a78bfa',
      textDecoration: 'none',
      fontSize: '1rem',
      fontWeight: '600',
      padding: '14px 32px',
      borderRadius: '12px',
      border: '2px solid #6366f1',
      transition: 'all 0.3s ease',
      background: 'transparent',
      cursor: 'pointer',
      marginTop: '40px',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <div style={{ color: '#64748b', fontSize: '1rem' }}>Loading trending products...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.trendingBadge}>
          🔥 TRENDING NOW
        </span>
        <h2 style={styles.title}>Most Demanded Products</h2>
        <p style={styles.subtitle}>
          Discover what everyone's talking about - top 5 hottest products this week
        </p>
      </div>

      <div style={styles.productsGrid}>
        {trendingProducts.length > 0 ? (
          trendingProducts.slice(0, 5).map((product, index) => {
            const isHovered = hoveredCard === index;
            const imageUrl = !imageErrors[product.id || product._id] 
              ? getImageUrl(product)
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=6366f1&color=fff&size=200`;

            return (
              <div
                key={product.id || product._id}
                style={styles.productCard(index)}
                onClick={() => handleProductClick(product.id || product._id)}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleProductClick(product.id || product._id);
                  }
                }}
              >
                <div style={styles.productImageContainer}>
                  <div style={styles.badgeContainer}>
                    <span style={styles.trendingTag(index)}>
                      {index === 0 ? '🥇 TOP' :
                       index === 1 ? '🥈 #2' :
                       index === 2 ? '🥉 #3' : `#${index + 1}`}
                    </span>
                    <span style={styles.rankBadge}>
                      #{index + 1}
                    </span>
                  </div>
                  
                  <img
                    src={imageUrl}
                    alt={product.name}
                    style={styles.productImage(isHovered)}
                    onError={() => handleImageError(product.id || product._id)}
                    loading="lazy"
                  />
                </div>

                <div style={styles.productInfo}>
                  <h3 style={styles.productName} title={product.name}>
                    {product.name}
                  </h3>

                  {(product.rating || product.reviews) && (
                    <div style={styles.ratingContainer}>
                      <div style={styles.stars}>
                        {'★'.repeat(Math.floor(product.rating || 4))}
                        {'☆'.repeat(5 - Math.floor(product.rating || 4))}
                      </div>
                      <span style={styles.reviewsCount}>
                        ({product.reviews || product.orders || 0})
                      </span>
                    </div>
                  )}

                  <div style={styles.priceRow}>
                    <span style={styles.productPrice}>
                      ₹{(product.price || 0).toLocaleString()}
                    </span>
                    <span style={styles.orderCount}>
                      {product.orders || 0} orders
                    </span>
                  </div>

                  <div style={styles.progressBar}>
                    <div style={styles.progressFill(product.orders || 0)} />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={styles.emptyState}>
            ✨ No trending products available at the moment
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          style={styles.viewAllBtn}
          onClick={() => navigate('/products')}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#6366f1';
            e.target.style.color = '#fff';
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#a78bfa';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Explore All Products →
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TrendingProducts;
