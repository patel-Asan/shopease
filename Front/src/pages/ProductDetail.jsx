// pages/ProductDetail.jsx - Fully Responsive
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addToCart } from '../api/api';
import { FavouritesContext } from '../context/FavouritesContext';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import RelatedProducts from '../components/RelatedProducts';
import Reviews from '../components/Reviews';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToFavourites, removeFromFavourites, isFavourite } = useContext(FavouritesContext);
  const { cart, fetchCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isFavLocal, setIsFavLocal] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [zoomImage, setZoomImage] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [hoveredThumbnail, setHoveredThumbnail] = useState(null);

  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get responsive font sizes
  const getFontSize = (mobile, tablet, desktop) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  // Get responsive spacing
  const getSpacing = (mobile, tablet, desktop) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  // Fetch product
  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Check if product is in cart
  useEffect(() => {
    if (cart && product) {
      const productInCart = cart.some(item => {
        if (item.product && typeof item.product === 'object') {
          return item.product._id === product._id;
        }
        if (item.product && typeof item.product === 'string') {
          return item.product === product._id;
        }
        if (typeof item === 'string') {
          return item === product._id;
        }
        return false;
      });
      
      setIsInCart(productInCart);
    }
  }, [cart, product]);

  // Check favourite status
  useEffect(() => {
    if (product) {
      setIsFavLocal(isFavourite(product._id));
    }
  }, [isFavourite, product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductById(id);
      setProduct(response.data || response);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }

    setLoadingCart(true);
    try {
      await addToCart(product._id || product.id, 1);
      toast.success(`✅ ${product.name} added to cart!`);
      setIsInCart(true);
      
      if (fetchCart) {
        await fetchCart();
      }
      
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setLoadingCart(false);
    }
  };

  const handleToggleFavourite = async () => {
    if (!user) {
      toast.info('Please login to add to favourites');
      navigate('/login');
      return;
    }

    if (loadingFav) return;
    setLoadingFav(true);

    const newFavState = !isFavLocal;
    setIsFavLocal(newFavState);

    try {
      if (isFavLocal) {
        await removeFromFavourites(product._id);
      } else {
        await addToFavourites(product._id);
      }
    } catch (error) {
      setIsFavLocal(!newFavState);
      console.error("Favourite action failed:", error);
    } finally {
      setLoadingFav(false);
    }
  };

  const handleImageError = (imageId) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  };

  // Get all product images
  const productImages = product?.images?.length > 0 
    ? product.images 
    : product?.img 
      ? [product.img] 
      : [];

  // Calculate average rating
  const averageRating = product?.reviews?.length > 0
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : 0;

  const styles = {
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: isMobile ? '50vh' : '70vh',
      padding: getSpacing('20px', '30px', '40px'),
    },
    spinner: {
      width: getSpacing('40px', '50px', '70px'),
      height: getSpacing('40px', '50px', '70px'),
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #ff6b6b',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: getSpacing('15px', '20px', '25px'),
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: getSpacing('16px', '24px', '40px'),
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    breadcrumb: {
      display: 'flex',
      alignItems: 'center',
      gap: getSpacing('6px', '8px', '12px'),
      marginBottom: getSpacing('20px', '30px', '40px'),
      fontSize: getFontSize('12px', '14px', '16px'),
      color: '#94a3b8',
      flexWrap: 'wrap',
      padding: getSpacing('8px 12px', '10px 16px', '12px 20px'),
      background: '#fff',
      borderRadius: getSpacing('30px', '40px', '50px'),
      boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
    },
    breadcrumbLink: {
      color: '#ff6b6b',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      fontWeight: '600',
      padding: getSpacing('4px 6px', '5px 8px', '5px 10px'),
      borderRadius: '20px',
      fontSize: getFontSize('11px', '13px', '14px'),
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : (isTablet ? '1fr' : '1fr 1fr'),
      gap: getSpacing('20px', '30px', '60px'),
      marginBottom: getSpacing('40px', '60px', '80px'),
    },
    imageGallery: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : (isTablet ? 'column' : 'row-reverse'),
      gap: getSpacing('15px', '20px', '25px'),
    },
    thumbnails: {
      display: 'flex',
      flexDirection: isMobile ? 'row' : (isTablet ? 'row' : 'column'),
      gap: getSpacing('8px', '10px', '15px'),
      order: isMobile ? '1' : (isTablet ? '1' : '0'),
      justifyContent: isMobile ? 'center' : (isTablet ? 'center' : 'flex-start'),
      flexWrap: 'wrap',
    },
    thumbnail: (index) => ({
      width: getSpacing('60px', '70px', '100px'),
      height: getSpacing('60px', '70px', '100px'),
      borderRadius: getSpacing('10px', '12px', '16px'),
      cursor: 'pointer',
      border: selectedImage === index ? '3px solid #ff6b6b' : '2px solid transparent',
      transition: 'all 0.3s ease',
      objectFit: 'cover',
      boxShadow: hoveredThumbnail === index ? '0 10px 20px rgba(255,107,107,0.3)' : '0 4px 10px rgba(0,0,0,0.05)',
      transform: hoveredThumbnail === index ? 'scale(1.05)' : 'scale(1)',
      opacity: selectedImage === index ? 1 : 0.8,
    }),
    mainImage: {
      flex: 1,
      width: '100%',
      aspectRatio: '1/1',
      borderRadius: getSpacing('16px', '20px', '32px'),
      overflow: 'hidden',
      boxShadow: zoomImage ? '0 20px 40px rgba(255,107,107,0.3)' : '0 10px 30px rgba(0,0,0,0.1)',
      cursor: zoomImage ? 'zoom-out' : 'zoom-in',
      transition: 'all 0.4s ease',
      position: 'relative',
    },
    mainImageImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.4s ease',
      transform: zoomImage ? 'scale(1.5)' : 'scale(1)',
    },
    zoomHint: {
      position: 'absolute',
      bottom: getSpacing('10px', '15px', '20px'),
      right: getSpacing('10px', '15px', '20px'),
      backgroundColor: 'rgba(255,255,255,0.95)',
      padding: getSpacing('6px 12px', '8px 15px', '10px 18px'),
      borderRadius: '40px',
      fontSize: getFontSize('11px', '12px', '14px'),
      color: '#1e293b',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: getSpacing('4px', '6px', '8px'),
      backdropFilter: 'blur(10px)',
    },
    productInfo: {
      padding: isMobile ? '0' : (isTablet ? '0' : '20px 0'),
    },
    productName: {
      fontSize: getFontSize('24px', '32px', '48px'),
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: getSpacing('12px', '15px', '20px'),
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    ratingSection: {
      display: 'flex',
      alignItems: 'center',
      gap: getSpacing('12px', '18px', '25px'),
      marginBottom: getSpacing('15px', '20px', '25px'),
      flexWrap: 'wrap',
      padding: getSpacing('10px 15px', '12px 18px', '15px 20px'),
      background: '#f8fafc',
      borderRadius: getSpacing('30px', '40px', '50px'),
      width: 'fit-content',
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: getSpacing('8px', '10px', '15px'),
    },
    stars: {
      display: 'flex',
      gap: '3px',
    },
    starFilled: {
      color: '#ffc107',
      fontSize: getFontSize('16px', '18px', '24px'),
    },
    starEmpty: {
      color: '#e0e0e0',
      fontSize: getFontSize('16px', '18px', '24px'),
    },
    averageRating: {
      fontSize: getFontSize('16px', '18px', '24px'),
      fontWeight: '700',
      color: '#1e293b',
    },
    reviewsCount: {
      color: '#64748b',
      fontSize: getFontSize('12px', '14px', '16px'),
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    price: {
      fontSize: getFontSize('28px', '36px', '56px'),
      fontWeight: '800',
      color: '#ff6b6b',
      display: 'flex',
      alignItems: 'center',
      gap: getSpacing('10px', '15px', '20px'),
      flexWrap: 'wrap',
      marginBottom: getSpacing('15px', '20px', '25px'),
    },
    originalPrice: {
      fontSize: getFontSize('16px', '20px', '28px'),
      color: '#94a3b8',
      textDecoration: 'line-through',
      fontWeight: '500',
    },
    discount: {
      fontSize: getFontSize('14px', '16px', '20px'),
      color: '#10b981',
      fontWeight: '700',
      padding: getSpacing('4px 12px', '6px 16px', '8px 20px'),
      backgroundColor: '#e8f5e9',
      borderRadius: getSpacing('20px', '30px', '40px'),
    },
    description: {
      fontSize: getFontSize('14px', '16px', '18px'),
      color: '#475569',
      lineHeight: '1.8',
      marginBottom: getSpacing('20px', '30px', '40px'),
      padding: getSpacing('15px', '20px', '25px'),
      background: '#fff',
      borderRadius: getSpacing('12px', '16px', '24px'),
      border: '1px solid #f0f0f0',
    },
    actionButtons: {
      display: 'flex',
      gap: getSpacing('10px', '15px', '20px'),
      marginBottom: getSpacing('20px', '25px', '30px'),
      flexWrap: 'wrap',
    },
    addToCartBtn: (isInCart) => ({
      flex: isMobile ? '1 1 100%' : (isTablet ? '2' : '3'),
      minWidth: isMobile ? '100%' : (isTablet ? '200px' : '280px'),
      padding: getSpacing('14px 20px', '16px 30px', '20px 40px'),
      background: isInCart ? '#10b981' : '#ff6b6b',
      color: 'white',
      border: 'none',
      borderRadius: getSpacing('40px', '50px', '60px'),
      fontSize: getFontSize('16px', '18px', '20px'),
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: isInCart ? '0 10px 20px rgba(16,185,129,0.3)' : '0 10px 20px rgba(255,107,107,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: getSpacing('6px', '8px', '12px'),
    }),
    favButton: (isFavLocal) => ({
      flex: isMobile ? '1 1 100%' : (isTablet ? '1' : '1'),
      minWidth: isMobile ? '100%' : '60px',
      padding: getSpacing('14px', '16px', '20px'),
      backgroundColor: isFavLocal ? '#ff6b6b' : 'white',
      color: isFavLocal ? 'white' : '#ff6b6b',
      border: '2px solid #ff6b6b',
      borderRadius: getSpacing('40px', '50px', '60px'),
      fontSize: getFontSize('20px', '24px', '28px'),
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    }),
    stockStatus: {
      padding: getSpacing('12px 15px', '14px 20px', '18px 25px'),
      borderRadius: getSpacing('10px', '12px', '16px'),
      marginBottom: getSpacing('15px', '20px', '25px'),
      display: 'flex',
      alignItems: 'center',
      gap: getSpacing('8px', '10px', '15px'),
      fontSize: getFontSize('14px', '15px', '18px'),
      fontWeight: '600',
    },
    inStock: {
      backgroundColor: '#e8f5e9',
      color: '#2e7d32',
    },
    lowStock: {
      backgroundColor: '#fff3e0',
      color: '#f57c00',
    },
    outOfStock: {
      backgroundColor: '#ffebee',
      color: '#c62828',
    },
    cartStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: getSpacing('10px', '12px', '15px'),
      padding: getSpacing('12px 15px', '14px 20px', '15px 25px'),
      backgroundColor: '#e8f5e9',
      borderRadius: getSpacing('10px', '12px', '16px'),
      color: '#2e7d32',
      fontSize: getFontSize('13px', '14px', '16px'),
      marginTop: getSpacing('10px', '15px', '20px'),
      flexWrap: 'wrap',
    },
    tabs: {
      display: 'flex',
      gap: getSpacing('15px', '25px', '40px'),
      borderBottom: '2px solid #f0f0f0',
      marginBottom: getSpacing('20px', '30px', '40px'),
      flexWrap: 'wrap',
      padding: getSpacing('0 10px', '0 15px', '0 20px'),
    },
    tab: {
      padding: getSpacing('12px 0', '15px 0', '20px 0'),
      fontSize: getFontSize('14px', '16px', '20px'),
      color: '#64748b',
      cursor: 'pointer',
      borderBottom: '3px solid transparent',
      transition: 'all 0.3s ease',
      fontWeight: '600',
    },
    activeTab: {
      color: '#ff6b6b',
      borderBottom: '3px solid #ff6b6b',
    },
    tabContent: {
      padding: getSpacing('20px', '30px', '40px'),
      minHeight: isMobile ? '300px' : '400px',
      background: '#fff',
      borderRadius: getSpacing('12px', '16px', '24px'),
    },
    specTable: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: getFontSize('13px', '14px', '16px'),
    },
    specRow: {
      borderBottom: '1px solid #f0f0f0',
    },
    specLabel: {
      padding: getSpacing('12px 15px', '14px 20px', '18px 25px'),
      color: '#64748b',
      width: isMobile ? '40%' : '35%',
      fontWeight: '600',
      backgroundColor: '#f8fafc',
    },
    specValue: {
      padding: getSpacing('12px 15px', '14px 20px', '18px 25px'),
      color: '#1e293b',
      fontWeight: '600',
    },
    deliveryInfo: {
      marginTop: getSpacing('20px', '25px', '30px'),
      padding: getSpacing('15px', '20px', '30px'),
      background: '#f8fafc',
      borderRadius: getSpacing('12px', '16px', '20px'),
    },
    deliveryItem: {
      display: 'flex',
      alignItems: 'center',
      gap: getSpacing('10px', '12px', '15px'),
      color: '#475569',
      fontSize: getFontSize('13px', '14px', '16px'),
      marginBottom: getSpacing('8px', '10px', '12px'),
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ fontSize: getFontSize('14px', '16px', '18px') }}>
          Loading product details...
        </p>
      </div>
    );
  }

  if (!product) return null;

  const renderTabContent = () => {
    switch(activeTab) {
      case 'description':
        return (
          <div>
            <h4 style={{ 
              fontSize: getFontSize('18px', '20px', '24px'),
              marginBottom: getSpacing('15px', '20px', '25px'),
              color: '#1e293b',
            }}>
              Product Description
            </h4>
            <p style={{ 
              fontSize: getFontSize('14px', '15px', '16px'),
              lineHeight: '1.8',
              color: '#475569',
            }}>
              {product.description || 'No description available.'}
            </p>
          </div>
        );
      case 'specifications':
        return (
          <div>
            <h4 style={{ 
              fontSize: getFontSize('18px', '20px', '24px'),
              marginBottom: getSpacing('15px', '20px', '25px'),
              color: '#1e293b',
            }}>
              Specifications
            </h4>
            <table style={styles.specTable}>
              <tbody>
                <tr style={styles.specRow}>
                  <td style={styles.specLabel}>Category</td>
                  <td style={styles.specValue}>{product.category || 'General'}</td>
                </tr>
                <tr style={styles.specRow}>
                  <td style={styles.specLabel}>Stock</td>
                  <td style={styles.specValue}>{product.stock || 0} units</td>
                </tr>
                <tr style={styles.specRow}>
                  <td style={styles.specLabel}>Total Orders</td>
                  <td style={styles.specValue}>{product.totalOrders || 0}</td>
                </tr>
                <tr style={styles.specRow}>
                  <td style={styles.specLabel}>Added On</td>
                  <td style={styles.specValue}>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={styles.deliveryInfo}>
              <h5 style={{ 
                fontSize: getFontSize('16px', '18px', '20px'),
                marginBottom: getSpacing('10px', '12px', '15px'),
              }}>
                📦 Delivery Info
              </h5>
              <div style={styles.deliveryItem}>🚚 Free delivery above ₹499</div>
              <div style={styles.deliveryItem}>⏱️ 3-5 business days</div>
              <div style={styles.deliveryItem}>🔄 7-day returns</div>
            </div>
          </div>
        );
      case 'reviews':
        return <Reviews productId={id} />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <span style={styles.breadcrumbLink} onClick={() => navigate('/')}>🏠 Home</span>
        <span>›</span>
        <span style={styles.breadcrumbLink} onClick={() => navigate('/products')}>🛍️ Products</span>
        <span>›</span>
        <span style={{ color: '#1e293b', fontWeight: '600' }}>{product.name}</span>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Image Gallery */}
        <div style={styles.imageGallery}>
          {productImages.length > 1 && (
            <div style={styles.thumbnails}>
              {productImages.map((img, index) => (
                <img
                  key={index}
                  src={!imageErrors[`thumb-${index}`] && img 
                    ? `http://localhost:5000/uploads/products/${img}` 
                    : `https://ui-avatars.com/api/?name=P&background=ff6b6b&color=fff`
                  }
                  alt={`Thumbnail ${index + 1}`}
                  style={styles.thumbnail(index)}
                  onMouseEnter={() => setHoveredThumbnail(index)}
                  onMouseLeave={() => setHoveredThumbnail(null)}
                  onClick={() => setSelectedImage(index)}
                  onError={() => handleImageError(`thumb-${index}`)}
                />
              ))}
            </div>
          )}

          <div 
            style={styles.mainImage}
            onClick={() => setZoomImage(!zoomImage)}
          >
            <img
              src={!imageErrors['main'] && productImages[selectedImage]
                ? `http://localhost:5000/uploads/products/${productImages[selectedImage]}` 
                : `https://ui-avatars.com/api/?name=${product.name}&background=ff6b6b&color=fff`
              }
              alt={product.name}
              style={styles.mainImageImg}
              onError={() => handleImageError('main')}
            />
            <div style={styles.zoomHint}>
              🔍 {zoomImage ? 'Zoom out' : 'Zoom in'}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div style={styles.productInfo}>
          <h1 style={styles.productName}>{product.name}</h1>

          {/* Rating */}
          <div style={styles.ratingSection}>
            <div style={styles.rating}>
              <div style={styles.stars}>
                {[1,2,3,4,5].map(star => (
                  <span key={star} style={star <= averageRating ? styles.starFilled : styles.starEmpty}>★</span>
                ))}
              </div>
              <span style={styles.averageRating}>{averageRating}</span>
            </div>
            <span style={styles.reviewsCount} onClick={() => setActiveTab('reviews')}>
              {product.reviews?.length || 0} reviews
            </span>
          </div>

          {/* Price */}
          <div style={styles.price}>
            ₹{product.price?.toLocaleString()}
            {product.originalPrice && (
              <>
                <span style={styles.originalPrice}>₹{product.originalPrice}</span>
                <span style={styles.discount}>
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p style={styles.description}>{product.description}</p>

          {/* Buttons */}
          <div style={styles.actionButtons}>
            <button
              style={styles.addToCartBtn(isInCart)}
              onClick={handleAddToCart}
              disabled={loadingCart || product.stock === 0}
            >
              {loadingCart ? '⏳' : isInCart ? '✅ In Cart' : '🛒 Add to Cart'}
            </button>
            <button
              style={styles.favButton(isFavLocal)}
              onClick={handleToggleFavourite}
              disabled={loadingFav}
            >
              {loadingFav ? '...' : (isFavLocal ? '❤️' : '🤍')}
            </button>
          </div>

          {/* Stock Status */}
          <div style={{
            ...styles.stockStatus,
            ...(product.stock > 10 ? styles.inStock :
               product.stock > 0 ? styles.lowStock : styles.outOfStock)
          }}>
            {product.stock > 10 ? '✅ In Stock' :
             product.stock > 0 ? `⚠️ Only ${product.stock} left` :
             '❌ Out of Stock'}
          </div>

          {/* Cart Status */}
          {isInCart && (
            <div style={styles.cartStatus}>
              <span>🛒</span>
              <span>Item in cart. <span style={{color:'#ff6b6b', cursor:'pointer'}} onClick={()=>navigate('/cart')}>View Cart</span></span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div style={styles.tabs}>
          <span style={{...styles.tab, ...(activeTab==='description'?styles.activeTab:{})}} onClick={()=>setActiveTab('description')}>📝 Description</span>
          <span style={{...styles.tab, ...(activeTab==='specifications'?styles.activeTab:{})}} onClick={()=>setActiveTab('specifications')}>⚙️ Specs</span>
          <span style={{...styles.tab, ...(activeTab==='reviews'?styles.activeTab:{})}} onClick={()=>setActiveTab('reviews')}>⭐ Reviews ({product.reviews?.length||0})</span>
        </div>
        <div style={styles.tabContent}>{renderTabContent()}</div>
      </div>

      {/* Related Products */}
      <RelatedProducts category={product.category} currentProductId={id} />

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ProductDetail;