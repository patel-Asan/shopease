import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { FavouritesContext } from "../context/FavouritesContext";
import { AuthContext } from "../context/AuthContext";
import API, { getImageUrl } from "../api/api";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductCard = ({ product, onProductChange }) => {
  const { user } = useContext(AuthContext);
  const { cart, addToCart } = useContext(CartContext);
  const { addToFavourites, removeFromFavourites, isFavourite } = useContext(FavouritesContext);
  
  const [deviceType, setDeviceType] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });
  
  const [previews, setPreviews] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const [updateForm, setUpdateForm] = useState({
    name: product.name,
    price: product.price,
    description: product.description || "",
    category: product.category || "general",
    stock: product.stock || 0,
    images: [],
  });
  
  const [isFavLocal, setIsFavLocal] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setDeviceType({
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
        isDesktop: width > 1024
      });
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const getFontSize = (mobile, tablet, desktop) => {
    if (deviceType.isMobile) return mobile;
    if (deviceType.isTablet) return tablet;
    return desktop;
  };

  const getSpacing = (mobile, tablet, desktop) => {
    if (deviceType.isMobile) return mobile;
    if (deviceType.isTablet) return tablet;
    return desktop;
  };

  const styles = {
    card: {
      display: "flex",
      flexDirection: "column",
      borderRadius: getSpacing("16px", "20px", "24px"),
      overflow: "hidden",
      background: "var(--bg-glass)",
      backdropFilter: "blur(20px)",
      border: "1px solid var(--border-color)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      width: "100%",
      maxWidth: deviceType.isMobile ? "100%" : deviceType.isTablet ? "280px" : "300px",
      flex: "1 1 auto",
      margin: getSpacing("0.5rem", "0.5rem", "0.5rem"),
      position: "relative",
      transform: isHovered && deviceType.isDesktop ? "translateY(-12px) scale(1.03)" : "translateY(0) scale(1)",
      boxShadow: isHovered && deviceType.isDesktop 
        ? "0 25px 50px -12px rgba(201, 169, 98, 0.35), 0 0 0 2px rgba(201, 169, 98, 0.2)" 
        : "var(--shadow-md)",
    },
    imageContainer: {
      width: "100%",
      paddingTop: "100%",
      position: "relative",
      overflow: "hidden",
      background: "var(--bg-primary)",
    },
    image: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s ease",
      transform: isHovered && deviceType.isDesktop ? "scale(1.1)" : "scale(1)",
    },
    imagePlaceholder: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(110deg, #1e293b 8%, #3d3520 18%, #1e293b 33%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s linear infinite",
    },
    badgeContainer: {
      position: "absolute",
      top: getSpacing("10px", "12px", "14px"),
      left: getSpacing("10px", "12px", "14px"),
      right: getSpacing("10px", "12px", "14px"),
      display: "flex",
      justifyContent: "space-between",
      zIndex: 2,
      gap: "8px",
      flexWrap: "wrap",
    },
    discountBadge: {
      background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
      color: "white",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: getFontSize("10px", "11px", "12px"),
      fontWeight: "700",
      boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
    },
    stockBadge: (stock) => ({
      background: stock > 10 
        ? "linear-gradient(135deg, #10b981 0%, #34d399 100%)" 
        : stock > 0 
        ? "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
        : "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
      color: "white",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: getFontSize("10px", "11px", "12px"),
      fontWeight: "600",
      boxShadow: stock > 10 
        ? "0 4px 15px rgba(16, 185, 129, 0.4)"
        : stock > 0
        ? "0 4px 15px rgba(245, 158, 11, 0.4)"
        : "0 4px 15px rgba(239, 68, 68, 0.4)",
    }),
    content: {
      padding: getSpacing("14px", "16px", "18px"),
      display: "flex",
      flexDirection: "column",
      flex: 1,
    },
    name: {
      fontSize: getFontSize("14px", "15px", "16px"),
      fontWeight: "600",
      marginBottom: "6px",
      color: "var(--text-primary)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: "1.4",
    },
    priceContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "12px",
      flexWrap: "wrap",
    },
    price: {
      fontSize: getFontSize("18px", "20px", "22px"),
      fontWeight: "800",
      background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      lineHeight: 1.2,
    },
    originalPrice: {
      fontSize: getFontSize("12px", "13px", "14px"),
      color: "var(--text-muted)",
      textDecoration: "line-through",
    },
    buttonContainer: {
      display: "flex",
      gap: "10px",
      marginTop: "auto",
    },
    cartButton: (isInCart) => ({
      flex: 2,
      padding: "12px 16px",
      borderRadius: "12px",
      border: "none",
      background: isInCart 
        ? "linear-gradient(135deg, #10b981 0%, #34d399 100%)" 
        : "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: getFontSize("12px", "13px", "14px"),
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      boxShadow: isInCart 
        ? "0 4px 15px rgba(16, 185, 129, 0.4)" 
        : "0 4px 15px rgba(201, 169, 98, 0.4)",
      minHeight: "44px",
    }),
    favButton: (isFav) => ({
      flex: 1,
      minWidth: "44px",
      padding: "12px",
      borderRadius: "12px",
      border: isFav ? "none" : "1px solid var(--border-color)",
      background: isFav ? "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)" : "var(--bg-glass)",
      color: isFav ? "#fff" : "var(--text-muted)",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: isFav ? "0 4px 15px rgba(236, 72, 153, 0.4)" : "var(--shadow-sm)",
      minHeight: "44px",
    }),
    adminButton: {
      flex: 1,
      padding: "12px 16px",
      borderRadius: "12px",
      border: "none",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: getFontSize("12px", "13px", "14px"),
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
      minHeight: "44px",
    },
    removedCard: {
      padding: "24px",
      border: "1px solid rgba(239, 68, 68, 0.3)",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      color: "#f87171",
      borderRadius: "20px",
      textAlign: "center",
      fontSize: "14px",
    },
    removeBtn: {
      marginTop: "16px",
      padding: "10px 24px",
      backgroundColor: "#dc2626",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "13px",
    },
    previewContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
      gap: "10px",
      marginTop: "15px",
    },
    previewItem: {
      position: "relative",
      width: "100%",
      aspectRatio: "1/1",
      borderRadius: "8px",
      overflow: "hidden",
    },
    previewImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    removePreviewBtn: {
      position: "absolute",
      top: "-6px",
      right: "-6px",
      width: "22px",
      height: "22px",
      borderRadius: "50%",
      backgroundColor: "#ef4444",
      color: "white",
      border: "2px solid white",
      fontSize: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
    categoryBadge: {
      background: "rgba(201, 169, 98, 0.2)",
      color: "#c9a962",
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: "500",
      display: "inline-block",
    },
  };

  useEffect(() => {
    if (cart && product) {
      const productInCart = cart.some(item => {
        const itemId = item.product?._id || item.product;
        return itemId === product._id;
      });
      setIsInCart(productInCart);
    }
  }, [cart, product]);

  useEffect(() => {
    setIsFavLocal(isFavourite(product._id));
  }, [isFavourite, product._id]);

  const handleCart = async (e) => {
    e.stopPropagation();
    if (!user) return;
    
    try {
      setLoadingCart(true);
      await addToCart(product._id);
      setIsInCart(true);
    } finally {
      setLoadingCart(false);
    }
  };

  const handleFav = async (e) => {
    e.stopPropagation();
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
    } finally {
      setLoadingFav(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      setLoadingAdmin(true);
      await API.delete(`/products/delete/${product._id}`);
      onProductChange();
    } catch {
      console.error("Error deleting product");
    } finally {
      setLoadingAdmin(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoadingAdmin(true);
      const formData = new FormData();
      formData.append("name", updateForm.name);
      formData.append("price", updateForm.price);
      formData.append("description", updateForm.description);
      formData.append("category", updateForm.category);
      if (updateForm.stock) {
        formData.append("stock", updateForm.stock);
      }
      
      if (updateForm.images?.length > 0) {
        updateForm.images.forEach((image) => {
          formData.append("productImages", image);
        });
      }
      
      await API.put(`/products/update/${product._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setShowModal(false);
      onProductChange();
    } catch {
      console.error("Error updating product");
    } finally {
      setLoadingAdmin(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUpdateForm({ ...updateForm, images: files });
    
    const newPreviews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === files.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = [...updateForm.images];
    newImages.splice(index, 1);
    setUpdateForm({ ...updateForm, images: newImages });
    
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const calculateDiscount = () => {
    if (!product.originalPrice || product.originalPrice <= product.price) return null;
    const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
    return Math.round(discount);
  };

  const discount = calculateDiscount();

  const getProductImage = () => {
    if (imageError || !product.img) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=c9a962&color=fff&size=300&bold=true`;
    }
    return getImageUrl(product.img);
  };

  if (!product.name || !product.price) {
    return (
      <div style={styles.removedCard}>
        <p>Product unavailable</p>
      </div>
    );
  }

  return (
    <>
      <div
        style={styles.card}
        onMouseEnter={() => deviceType.isDesktop && setIsHovered(true)}
        onMouseLeave={() => deviceType.isDesktop && setIsHovered(false)}
        onClick={() => window.location.href = `/product/${product._id}`}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && (window.location.href = `/product/${product._id}`)}
      >
        <div style={styles.imageContainer}>
          <div style={styles.badgeContainer}>
            {discount && discount > 0 && (
              <span style={styles.discountBadge}>
                -{discount}%
              </span>
            )}
            {product.stock !== undefined && (
              <span style={styles.stockBadge(product.stock)}>
                {product.stock > 10 ? "In Stock" : product.stock > 0 ? `${product.stock} left` : "Out of Stock"}
              </span>
            )}
          </div>
          
          {!imageLoaded && !imageError && (
            <div style={styles.imagePlaceholder} />
          )}
          
          <img
            src={getProductImage()}
            alt={product.name}
            style={styles.image}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            loading="lazy"
          />
        </div>

        <div style={styles.content}>
          {product.category && (
            <span style={styles.categoryBadge}>
              {product.category}
            </span>
          )}
          <h5 style={styles.name} title={product.name}>
            {product.name}
          </h5>

          <div style={styles.priceContainer}>
            <span style={styles.price}>₹{product.price?.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={styles.originalPrice}>₹{product.originalPrice?.toLocaleString()}</span>
            )}
          </div>

          <div style={styles.buttonContainer}>
            {user?.role === "admin" ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                  }}
                  disabled={loadingAdmin}
                  style={{ ...styles.adminButton, background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)", color: "#000" }}
                >
                  {loadingAdmin ? <Spinner size="sm" /> : "Edit"}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loadingAdmin}
                  style={{ ...styles.adminButton, background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)", color: "#fff" }}
                >
                  {loadingAdmin ? <Spinner size="sm" /> : "Delete"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCart}
                  disabled={loadingCart || product.stock === 0}
                  style={styles.cartButton(isInCart)}
                >
                  {loadingCart ? (
                    <Spinner size="sm" />
                  ) : isInCart ? (
                    <>
                      <span>✓</span>
                      {!deviceType.isMobile && " In Cart"}
                    </>
                  ) : (
                    <>
                      <span>+</span>
                      {!deviceType.isMobile && " Add"}
                    </>
                  )}
                </button>
                <button
                  onClick={handleFav}
                  disabled={loadingFav}
                  style={styles.favButton(isFavLocal)}
                  title={isFavLocal ? "Remove from favourites" : "Add to favourites"}
                >
                  {loadingFav ? (
                    <Spinner size="sm" />
                  ) : isFavLocal ? (
                    <FaHeart 
                      style={{ 
                        fontSize: "1.3rem",
                        animation: "heartBeat 0.5s ease",
                      }} 
                    />
                  ) : (
                    <FaRegHeart 
                      style={{ 
                        fontSize: "1.3rem",
                      }} 
                    />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>

      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered 
        size={deviceType.isMobile ? "sm" : "lg"}
        fullscreen={deviceType.isMobile ? "sm-down" : false}
        contentClassName="dark-modal"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title style={{ color: "var(--text-primary)" }}>Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "var(--bg-card)" }}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "var(--text-secondary)" }}>Name</Form.Label>
            <Form.Control
              type="text"
              value={updateForm.name}
              onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
              required
              style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: "var(--text-secondary)" }}>Price</Form.Label>
            <Form.Control
              type="number"
              value={updateForm.price}
              onChange={(e) => setUpdateForm({ ...updateForm, price: e.target.value })}
              required
              style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: "var(--text-secondary)" }}>Category</Form.Label>
            <Form.Control
              type="text"
              value={updateForm.category}
              onChange={(e) => setUpdateForm({ ...updateForm, category: e.target.value })}
              style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: "var(--text-secondary)" }}>Stock</Form.Label>
            <Form.Control
              type="number"
              value={updateForm.stock}
              onChange={(e) => setUpdateForm({ ...updateForm, stock: e.target.value })}
              style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: "var(--text-secondary)" }}>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={updateForm.description}
              onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
              style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: "var(--text-secondary)" }}>Images</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
            />
          </Form.Group>

          {previews.length > 0 && (
            <div style={styles.previewContainer}>
              {previews.map((preview, index) => (
                <div key={index} style={styles.previewItem}>
                  <img src={preview} alt={`Preview ${index + 1}`} style={styles.previewImage} />
                  <button type="button" style={styles.removePreviewBtn} onClick={() => removeImage(index)}>×</button>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border-color)" }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button type="submit" onClick={handleUpdate} disabled={loadingAdmin} style={{ background: "linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%)", border: "none" }}>
            {loadingAdmin ? <Spinner size="sm" /> : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductCard;
