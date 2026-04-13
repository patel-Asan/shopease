
import { useEffect, useState, useContext } from "react";
import { FavouritesContext } from "../context/FavouritesContext";
import { CartContext } from "../context/CartContext";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
 
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = isMobile ? 6 : 12;
  const navigate = useNavigate();
 
  const { addToFavourites, removeFromFavourites, isFavourite } = useContext(FavouritesContext);
  const { addToCart } = useContext(CartContext);
 
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
 
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const result = await res.json();
      setProducts(result.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchProducts();
  }, []);
 
  const handleFav = async (productId) => {
    if (isFavourite(productId)) await removeFromFavourites(productId);
    else await addToFavourites(productId);
  };
 
  const handleCart = async (productId) => {
    try {
      await addToCart(productId);
      alert("Added to cart!");
    } catch (err) {
      alert("Error adding to cart");
    }
  };
 
  // Filter and paginate products
  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
 
  const styles = {
    container: {
      padding: isMobile ? "1rem" : "2rem",
    },
    header: {
      marginBottom: "2rem",
    },
    searchInput: {
      width: "100%",
      padding: isMobile ? "0.8rem" : "0.6rem",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: isMobile ? "1rem" : "0.95rem",
      marginBottom: "1rem",
    },
    productsGrid: {
      display: "grid",
      gridTemplateColumns: isMobile 
        ? "repeat(auto-fill, minmax(140px, 1fr))" 
        : "repeat(auto-fill, minmax(200px, 1fr))",
      gap: isMobile ? "0.8rem" : "1rem",
    },
    card: {
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      transition: "all 0.3s",
      overflow: "hidden",
      cursor: "pointer",
      height: "100%",
    },
    cardImage: {
      height: isMobile ? "140px" : "200px",
      objectFit: "cover",
      transition: "transform 0.3s",
    },
    cardBody: {
      display: "flex",
      flexDirection: "column",
      padding: isMobile ? "0.8rem" : "1rem",
    },
    cardTitle: {
      fontSize: isMobile ? "0.9rem" : "1rem",
      fontWeight: 600,
      marginBottom: "0.3rem",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    cardPrice: {
      fontSize: isMobile ? "0.85rem" : "0.95rem",
      fontWeight: 500,
      color: "#333",
      marginBottom: "0.5rem",
    },
    buttonContainer: {
      display: "flex",
      gap: "0.3rem",
      marginTop: "auto",
    },
    cartButton: {
      flex: 1,
      backgroundColor: "#007bff",
      border: "none",
      padding: isMobile ? "0.4rem" : "0.375rem 0.75rem",
      fontSize: isMobile ? "0.8rem" : "0.85rem",
    },
    favButton: {
      width: isMobile ? "40px" : "50px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: isMobile ? "1rem" : "1.2rem",
      padding: isMobile ? "0.4rem" : "0.375rem",
      borderRadius: "8px",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "1rem",
      marginTop: "2rem",
      flexWrap: "wrap",
    },
    pageButton: (active) => ({
      padding: isMobile ? "0.5rem 1rem" : "0.5rem 1rem",
      border: "1px solid #dee2e6",
      borderRadius: "6px",
      backgroundColor: active ? "#007bff" : "#fff",
      color: active ? "#fff" : "#333",
      cursor: "pointer",
    }),
    loadingContainer: {
      textAlign: "center",
      marginTop: "3rem",
    },
  };
 
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
 
  return (
    <Container fluid style={styles.container}>
      <div style={styles.header}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>
 
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          No products found.
        </div>
      ) : (
        <>
          <div style={styles.productsGrid}>
            {currentProducts.map((p) => {
              const fav = isFavourite(p._id);
 
              return (
                <Card
                  key={p._id}
                  style={styles.card}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                    }
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={p.img ? `http://localhost:5000/uploads/products/${p.img}` : "/default-image.jpg"}
                    style={styles.cardImage}
                    onMouseEnter={(e) => {
                      if (!isMobile) e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile) e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                  <Card.Body style={styles.cardBody}>
                    <Card.Title style={styles.cardTitle}>
                      {p.name}
                    </Card.Title>
                    <Card.Text style={styles.cardPrice}>
                      ₹{p.price}
                    </Card.Text>
                    <div style={styles.buttonContainer}>
                      <Button
                        style={styles.cartButton}
                        size="sm"
                        onClick={() => handleCart(p._id)}
                      >
                        Cart
                      </Button>
                      <Button
                        style={{
                          ...styles.favButton,
                          backgroundColor: fav ? "#dc3545" : "transparent",
                          border: fav ? "none" : "1px solid #dc3545",
                          color: fav ? "white" : "#dc3545",
                        }}
                        size="sm"
                        onClick={() => handleFav(p._id)}
                      >
                        {fav ? "❤️" : "🤍"}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
 
          {/* Pagination */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                style={styles.pageButton(false)}
              >
                Previous
              </button>
              <span>
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
    </Container>
  );
}
 
